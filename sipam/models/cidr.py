import copy
import uuid
from ipaddress import ip_address, ip_network

from django.db import models, transaction
from netfields import CidrAddressField, NetManager

from ..utilities import subcidr
from ..utilities.enums import IP, CIDRType, FlagChoices, Invoke
from ..utilities.error import NotEnoughSpace
from ..utilities.fields import FQDNField
from .tag import Tag


class CIDR(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    edited = models.DateTimeField(auto_now=True)
    cidr = CidrAddressField(unique=True)
    # TODO: should migrate all prefixes and ips
    # from self under the parent.
    pool = models.ForeignKey('Pool', blank=True, null=True,
                             on_delete=models.DO_NOTHING,
                             related_name='prefixes')
    fqdn = FQDNField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    flag = models.CharField(
        max_length=11,
        choices=[(tag, tag.value) for tag in FlagChoices],
        default=FlagChoices.RESERVATION,
    )
    tags = models.ManyToManyField(Tag)
    objects = NetManager()

    class Meta:
        ordering = ('cidr',)

    def directly(self, objects, invoke=Invoke.CHILDREN):
        """
            This method ensures that only direct neighbours are shown
            :param objects: this defines the array of objects calculated
            :param invoke: should be of type Invoke. else it will fail.
            :returns: the direct neighbours above or under self.
        """
        direct = []
        undirect = []
        assert isinstance(invoke, Invoke)
        for i, obj in enumerate(objects):
            before = len(undirect)
            compare = copy.copy(list(objects))
            compare.pop(i)
            for compare_object in compare:
                if invoke == Invoke.CHILDREN:
                    if obj.cidr.subnet_of(compare_object.cidr):
                        undirect.append(obj)
                        break
                elif invoke == Invoke.PARENTS:
                    if obj.cidr.supernet_of(compare_object.cidr):
                        undirect.append(obj)
                        break
            del compare
            if before == len(undirect):
                direct.append(obj)
            if len(direct) + len(undirect) == len(objects):
                break
        del undirect
        return direct

    def getChildren(self, cidrType: CIDRType):
        children = CIDR.objects.filter(
            cidr__net_contained=self.cidr
        )
        assert isinstance(cidrType, CIDRType)
        if cidrType == CIDRType.CIDR:
            return self.directly(children, invoke=Invoke.CHILDREN)

        return [cidr for cidr in self.directly(children, invoke=Invoke.CHILDREN) if not subcidr(cidr)]

    @property
    def supercidr(self):
        """
            :returns: the direct parent of self (by cidr)
        """
        supercidr = CIDR.objects.filter(
            cidr__net_contains=self.cidr)
        parent = self.directly(supercidr, invoke=Invoke.PARENTS)

        if len(parent) == 0:
            return None

        return parent[0]

    @property
    def subcidr(self):
        """
            :returns: the direct subcidr of self (by cidr)
        """
        return self.getChildren(cidrType=CIDRType.CIDR)

    @property
    def ips(self):
        """
            :returns: the direct ips allocated under this prefix
        """
        return self.getChildren(cidrType=CIDRType.IP)

    @property
    def version(self) -> IP:
        """Returns the version of this object
        Either IPv4 our IPv6

        Returns:
            IP -- Version (IP.v4 or IP.v6)
        """
        return IP(self.cidr.version)

    @transaction.atomic
    def assignLinknet(self, description: str, hostname=None):
        """Assigns a new linknet from the pool to be used with physical nodes

        Arguments:
            description {str} -- Description of the use for this subnet
            hostname {str} -- Hostname to use
        """
        if self.version == IP.v4:
            size = 31
        else:
            size = 127

        net = self.assignNet(size, description)

        gateway = net.assignNet(size + 1, 'Gateway', flag=FlagChoices.ASSIGNMENT)
        ip = net.assignIP(description, hostname)

        return net, gateway, ip

    def assignIP(self, description: str, hostname=None):
        """Assigns a new single ip to be used for VMs

        Arguments:
            description {str} -- Description of the use for this subnet
            hostname {str} -- Hostname to use
        """
        if self.version == IP.v4:
            size = 32
        else:
            size = 128

        return self.assignNet(size, description, hostname, flag=FlagChoices.HOST)

    def assignNet(self, size: int, description: str, hostname=None, flag=FlagChoices.RESERVATION):
        """Assign a subnet of requested size from this network

        Arguments:
            size {int} -- Desired size of the subnet
            description {str} -- Description of the use for this subnet

        Keyword Arguments:
            hostname {[type]} -- Hostname to use (default: {None})
            flag: {FlagChoices} -- Network type (reservation, assignment, host)
        """

        def getStartAddress(net: CidrAddressField, size: int) -> int:
            """Calculate the next possible start address of a network with requested size

            Arguments:
                net {CidrAddressField} -- Net to start with
                size {int} -- subnet size

            Returns:
                int -- The actual distance
            """
            if size >= net.prefixlen:
                startAddress = int(net.broadcast_address) + 1
            else:
                sizeDiff = net.prefixlen - size
                supernet = net.supernet(sizeDiff)
                startAddress = int(supernet.network_address) + 2**(supernet.max_prefixlen - supernet.prefixlen)
            return startAddress

        if size <= self.cidr.prefixlen:
            raise NotEnoughSpace

        gapSize = 2**(self.cidr.max_prefixlen - size)

        if len(self.subcidr) == 0:
            subnets = self.cidr.subnets(new_prefix=size)
            newNet = next(subnets)

            # Instantiate new object and persist
            newCIDR = CIDR(cidr=newNet, description=description, fqdn=hostname, flag=flag)
            newCIDR.save()
            return newCIDR

        smallestGap = None

        firstChild = self.subcidr[0]

        firstGap = int(self.cidr.network_address) - int(firstChild.cidr.network_address)

        if firstGap >= gapSize:
            smallestGap = {
                'address': self.cidr.network_address,
                'length': firstGap
            }

        for i, child in enumerate(self.subcidr[:-1]):
            net1 = child.cidr
            net2 = self.subcidr[i + 1].cidr

            startAddress = getStartAddress(net1, size)

            gap = int(net2.network_address) - startAddress
            if gap >= gapSize and (smallestGap is None or gap < smallestGap['length']):
                smallestGap = {
                    'address': ip_address(startAddress),
                    'length': gap
                }

        # the last gap
        lastBlock = self.subcidr[-1].cidr
        lastGapStart = getStartAddress(lastBlock, size)
        lastGap = int(self.cidr.broadcast_address) - lastGapStart + 1

        if lastGap >= gapSize and (smallestGap is None or lastGap < smallestGap['length']):
            smallestGap = {
                'address': ip_address(lastGapStart),
                'length': lastGap
            }

        if smallestGap is None:
            raise NotEnoughSpace

        # This is ugly but apparently IPVXNetwork has no way to change the netmask
        newNet = str(smallestGap['address']) + "/" + str(size)
        newNet = ip_network(newNet)

        # Instantiate new object and persist
        newCIDR = CIDR(cidr=newNet, description=description, fqdn=hostname, flag=flag)
        newCIDR.save()
        return newCIDR
