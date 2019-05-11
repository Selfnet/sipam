import uuid
from django.db import models
from netfields import NetManager, CidrAddressField
from .pool import Pool
from ..utilities.fields import FQDNField
from ..utilities.enums import FlagChoices


class CIDR(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    edited = models.DateTimeField(auto_now=True)
    cidr = CidrAddressField(unique=True)
    # TODO: should migrate all prefixes and ips
    # from self under the parent.
    pool = models.ForeignKey(Pool, blank=True, null=True,
                             on_delete=models.DO_NOTHING, related_name='prefixes')
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
