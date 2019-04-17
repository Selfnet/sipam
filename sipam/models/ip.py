import uuid
from django.db import models
from netfields import NetManager, InetAddressField
from sipam.models.prefix import Prefix


class IP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    edited = models.DateTimeField(auto_now=True)
    ip = InetAddressField()
    # TODO: ip address should be assigned to next greater Prefix
    # (should be implemented)
    parent = models.ForeignKey(Prefix, on_delete=models.CASCADE, related_name="ips")
    fqdn = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    objects = NetManager()

    class Meta:
        ordering = ('ip',)
