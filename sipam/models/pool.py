from typing import List, Optional

from django.db import transaction
from django.db.models import CharField, DateTimeField, Model, TextField

from ..utilities.enums import IP, HostType
from .cidr import CIDR
from ..utilities.error import NoSuchPrefix, NotEnoughSpace


class Pool(Model):
    id = CharField(max_length=10, primary_key=True)
    label = CharField(max_length=100, null=False)
    created = DateTimeField(auto_now_add=True, editable=False)
    edited = DateTimeField(auto_now=True)
    description = TextField(blank=True, null=True)

    @property
    def prefixes(self):
        """Get all prefixes attached to a pool
        """
        return CIDR.objects.filter(pool=self)  # pragma: no cover

    def getPrefixes(self, version: IP = None) -> List[CIDR]:
        """Get prefixes for this pool selectable by IPv4 or IPv6

        Keyword Arguments:
            version {IP} -- 4 or 6 (default: {None})

        Returns:
            List[CIDR] -- List of all prefixes attached to this pool
        """
        if version is None:
            return self.prefixes.all()

        prefixes = self.prefixes.all()

        if len(prefixes) == 0:
            return list()

        return [prefix for prefix in prefixes if prefix.version == version]

    @transaction.atomic
    def assignFromPool(self, version: IP, hostType: HostType, description: str, hostname: str) -> Optional[CIDR]:
        """Assign a Network or IP from this pool

        Arguments:
            version {IP} -- v4 or v6
            hostType {HostType} -- Physical or virtual (determines linknet or IP)
            description {str} -- Description of the new net
            hostname {str} -- Hostname for this host

        Raises:
            NoSuchPrefix: There are no subnets of this type assigned to this pool

        Returns:
            Optional[CIDR] -- Newly assigned cidr objects or None, if all pools were full.
        """
        prefixes = self.getPrefixes(version)

        # Check first, if we have prefixes to assign from
        if len(prefixes) == 0:
            raise NoSuchPrefix

        assign = None
        # Try for each prefix in prefixes.
        for prefix in prefixes:
            try:
                # VMs get an IP, then the inner loop is cancelled
                if hostType == HostType.VIRTUAL:
                    assign = prefix.assignIP(description, hostname)
                    break

                # Phsyical hosts get a linknet then cancel
                assign = prefix.assignLinknet(description, hostname)
                break

            # When the not enough space exception is thrown we continue with the next subnet
            except NotEnoughSpace:
                continue

        return assign
