import uuid
import copy
from django.db import models
from netfields import NetManager, CidrAddressField
from .pool import Pool
from ..utilities.fields import FQDNField
from ..utilities import subcidr
from ..utilities.enums import FlagChoices, Invoke, CIDRType


class CIDR(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    edited = models.DateTimeField(auto_now=True)
    cidr = CidrAddressField(unique=True)
    # TODO: should migrate all prefixes and ips
    # from self under the parent.
    pool = models.ForeignKey(Pool, blank=True, null=True,
                             on_delete=models.DO_NOTHING,
                             related_name='prefixes')
    fqdn = FQDNField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    flag = models.CharField(
        max_length=11,
        choices=[(tag, tag.value) for tag in FlagChoices],
        default=FlagChoices.RESERVATION,
    )
    objects = NetManager()

    class Meta:
        ordering = ('cidr',)

    def directly(self, objects, type=Invoke.CHILDREN):
        """
            This method ensures that only direct neighbours are showed
            :param objects: this defines the array of objects calculated
            :param type: should be of type Invoke. else it will fail.
            :returns: the direct neighbours above or under self.
        """
        direct = []
        undirect = []
        assert isinstance(type, Invoke)
        for i in range(0, len(objects)):
            obj = objects[i]
            before = len(undirect)
            compare = copy.copy(list(objects))
            compare.pop(i)
            for compare_object in compare:
                if type == Invoke.CHILDREN:
                    if obj.cidr.subnet_of(compare_object.cidr):
                        undirect.append(obj)
                        break
                elif type == Invoke.PARENTS:
                    if obj.cidr.supernet_of(compare_object.cidr):
                        undirect.append(obj)
                        break
            del(compare)
            if before == len(undirect):
                direct.append(obj)
            if len(direct) + len(undirect) == len(objects):
                break
        del(undirect)
        return direct

    def children(self, type):
        children = CIDR.objects.filter(
            cidr__net_contained=self.cidr
        )
        assert isinstance(type, CIDRType)
        if type == CIDRType.CIDR:
            return [cidr for cidr in self.directly(children, type=Invoke.CHILDREN) if subcidr(cidr)]
        elif type == CIDRType.IP:
            return [cidr for cidr in self.directly(children, type=Invoke.CHILDREN) if not subcidr(cidr)]

    @property
    def parents(self):
        """
            :returns: the direct parent of self (by cidr)
        """
        parents = CIDR.objects.filter(
            cidr__net_contains=self.cidr)
        return self.directly(parents, type=Invoke.PARENTS)

    @property
    def subcidr(self):
        """
            :returns: the direct subcidr of self (by cidr)
        """
        return self.children(type=CIDRType.CIDR)

    @property
    def ips(self):
        """
            :returns: the direct ips allocated under this prefix
        """
        return self.children(type=CIDRType.IP)

    def assignLinknet(self, description: str, hostname=None):
        """Assigns a new linknet from the pool to be used with physical nodes

        Arguments:
            description {str} -- Description of the use for this subnet
            hostname {str} -- Hostname to use
        """
        pass

    def assignIP(self, description: str, hostname=None):
        """Assigns a new single ip to be used for VMs

        Arguments:
            description {str} -- Description of the use for this subnet
            hostname {str} -- Hostname to use
        """
        pass
