import uuid
from ipaddress import ip_address, ip_network

from django.db import models, transaction
from mptt.models import MPTTModel, TreeForeignKey
from netfields import CidrAddressField, NetManager

from sipam import utilities
from sipam.utilities.enums import IP, FlagChoices
from sipam.utilities.error import NotEnoughSpaceError
from sipam.utilities.fields import FQDNField

from .base import BaseModel


class CIDR(MPTTModel, BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cidr = CidrAddressField(unique=True)
    parent = TreeForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="children")
    pool = models.ForeignKey("Pool", blank=True, null=True, on_delete=models.DO_NOTHING, related_name="prefixes")
    fqdn = FQDNField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    flag = models.CharField(
        blank=False,
        max_length=11,
        choices=[(tag.value, tag.value) for tag in FlagChoices],
        default=FlagChoices.RESERVATION,
    )
    objects = NetManager()

    class Meta:
        ordering = ("cidr",)

    @property
    def supercidr(self) -> "CIDR":
        """:returns: the direct parent of self (by cidr)"""
        return self.parent

    @property
    def subcidr(self) -> list["CIDR"]:
        """:returns: the direct subcidr of self (by cidr)"""
        return list(CIDR.objects.filter(parent=self).order_by("cidr").all())

    def getChildIDs(self) -> list[str]:
        """Get the IDs of every child.

        Returns
        -------
            List[str] -- List of child IDs
        """
        return [child.id for child in CIDR.objects.filter(parent=self).order_by("cidr").all()]

    @property
    def ips(self) -> list["CIDR"]:
        """:returns: the direct ips allocated under this prefix"""
        return [cidr for cidr in self.get_children() if not utilities.subcidr(cidr.cidr)]

    @property
    def version(self) -> IP:
        """Returns the version of this object Either IPv4 our IPv6.

        Returns
        -------
            IP -- Version (IP.v4 or IP.v6)
        """
        return IP(self.cidr.version)

    @property
    def labelDict(self) -> dict:
        """Get labels as key value pair.

        Returns
        -------
            dict -- Labels as key-value pair
        """
        return {label.name: label.value for label in self.labels.all()}

    @transaction.atomic
    def assignLinknet(self, description: str, hostname=None) -> 'CIDR': #tuple["CIDR", "CIDR", "CIDR"]:
        """Assigns a new linknet from the pool to be used with physical nodes.

        Arguments:
        ---------
            description {str} -- Description of the use for this subnet
            hostname {str} -- Hostname to use
        """
        size = 31 if self.version == IP.v4 else 127

        net = self.assignNet(size, description)

        # Assign gateway ip manually because network address = assignment is prohibited by assign net
        gateway_ip = str(net.cidr.network_address) + "/" + str(size + 1)
        gateway_ip = ip_network(gateway_ip)
        gateway = CIDR(cidr=gateway_ip, description="Gateway", flag=FlagChoices.ASSIGNMENT, parent=net)
        gateway.save()

        # Now use assignIP to not do the assign workaround again
        _ = net.assignIP(description, hostname)

        return net

    def assignIP(self, description: str, hostname=None) -> "CIDR":
        """Assigns a new single ip to be used for VMs.

        Arguments:
        ---------
            description {str} -- Description of the use for this subnet
            hostname {str} -- Hostname to use
        """
        size = 32 if self.version == IP.v4 else 128

        return self.assignNet(size, description, hostname, flag=FlagChoices.HOST)

    def assignNet(self, size: int, description: str, hostname=None, flag=FlagChoices.RESERVATION, offset=1) -> "CIDR":
        """Assign a subnet of requested size from this network.

        Arguments:
        ---------
            size {int} -- Desired size of the subnet
            description {str} -- Description of the use for this subnet

        Keyword Arguments:
        -----------------
            hostname {[type]} -- Hostname to use (default: {None})
            flag: {FlagChoices} -- Network type (reservation, assignment, host)
            offset: {int} -- Offset from the network address (e.g. to allow network address assignments)
        """

        def getStartAddress(net: CidrAddressField, size: int) -> int:
            """Calculate the next possible start address of a network with requested size.

            Arguments:
            ---------
                net {CidrAddressField} -- Net to start with
                size {int} -- subnet size

            Returns
            -------
                int -- The actual distance
            """
            if size >= net.prefixlen:
                startAddress = int(net.broadcast_address) + 1
            else:
                sizeDiff = net.prefixlen - size
                supernet = net.supernet(sizeDiff)
                startAddress = int(supernet.network_address) + 2 ** (supernet.max_prefixlen - supernet.prefixlen)
            return startAddress

        if size <= self.cidr.prefixlen:
            raise NotEnoughSpaceError

        gapSize = 2 ** (self.cidr.max_prefixlen - size)

        # When the network is empty, take first
        if len(self.subcidr) == 0:
            # Make use of ipaddress functions to get all subnets of requested size
            subnets = self.cidr.subnets(new_prefix=size)
            next(subnets)
            newNet = next(subnets)

            # Instantiate new object and persist
            newCIDR = CIDR(cidr=newNet, description=description, fqdn=hostname, flag=flag, parent=self)
            newCIDR.save()
            return newCIDR

        # Non empty network --> find best place
        smallestGap = None

        # Check whether there is enough space before the first child
        firstChild = self.subcidr[0]
        firstGap = int(firstChild.cidr.network_address) - int(self.cidr.network_address + offset)
        if firstGap >= gapSize:
            smallestGap = {"address": self.cidr.network_address + offset, "length": firstGap}

        for i, child in enumerate(self.subcidr[:-1]):
            net1 = child.cidr
            net2 = self.subcidr[i + 1].cidr

            startAddress = getStartAddress(net1, size)

            gap = int(net2.network_address) - startAddress
            if gap >= gapSize and (smallestGap is None or gap < smallestGap["length"]):
                smallestGap = {"address": ip_address(startAddress), "length": gap}

        # the last gap
        lastBlock = self.subcidr[-1].cidr
        lastGapStart = getStartAddress(lastBlock, size)
        lastGap = int(self.cidr.broadcast_address) - lastGapStart + 1

        if lastGap >= gapSize and (smallestGap is None or lastGap < smallestGap["length"]):
            smallestGap = {"address": ip_address(lastGapStart), "length": lastGap}

        if smallestGap is None:
            raise NotEnoughSpaceError

        # This is ugly but apparently IPVXNetwork has no way to change the netmask
        newNet = str(smallestGap["address"]) + "/" + str(size)
        newNet = ip_network(newNet)

        # Instantiate new object and persist
        newCIDR = CIDR(cidr=newNet, description=description, fqdn=hostname, flag=flag, parent=self)
        newCIDR.save()
        return newCIDR
