import uuid
from django.db import models
from netfields import NetManager, CidrAddressField
from .pool import Pool
from ..utilities.fields import URLField
from .enums import FlagChoices


class CIDR(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    edited = models.DateTimeField(auto_now=True)
    cidr = CidrAddressField(unique=True)
    # TODO: should migrate all prefixes and ips
    # from self under the parent.
    pool = models.ForeignKey(Pool, blank=True, null=True,
                             on_delete=models.DO_NOTHING, related_name='prefixes')
    fqdn = URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    flag = models.CharField(
        max_length=11,
        choices=[(tag, tag.value) for tag in FlagChoices],
        default=FlagChoices.RESERVATION,
    )
    objects = NetManager()

    class Meta:
        ordering = ('cidr',)
