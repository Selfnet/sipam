from typing import List, Optional

from django.db import transaction
from django.db.models import CharField, TextField

from ..utilities.enums import IP, HostType
from .cidr import CIDR
from ..utilities.error import NoSuchPrefix, NotEnoughSpace
from .base import BaseModel


class Pool(BaseModel):
    id = CharField(max_length=10, primary_key=True)
    label = CharField(max_length=100, null=False)
    description = TextField(blank=True, null=True)

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

            # When there is not enough space an exception is thrown, we continue with the next subnet
            except NotEnoughSpace:
                continue

        return assign
