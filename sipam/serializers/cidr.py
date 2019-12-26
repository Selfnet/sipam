from ipaddress import IPv4Network, IPv6Network
from typing import List

from rest_framework.serializers import (ModelSerializer, SerializerMethodField,
                                        ValidationError)

from sipam.models import CIDR

from ..utilities import subcidr


class CIDRSerializer(ModelSerializer):
    children = SerializerMethodField()
    labels = SerializerMethodField()

    class Meta:
        model = CIDR
        fields = (
            'id',
            'cidr',
            'created',
            'edited',
            'parent',
            'children',
            'pool',
            'flag',
            'fqdn',
            'description',
            'labels'
        )

    def get_children(self, obj) -> List[str]:
        return obj.getChildIDs()

    def get_labels(self, obj) -> dict:
        return obj.labelDict


class RecursiveCIDRSerializer(CIDRSerializer):

    def get_children(self, obj) -> List['CIDR']:
        return RecursiveCIDRSerializer(
            obj.subcidr,
            many=True,
            read_only=True,
            context=self.context).data

    def validate(self, data):
        """
        Check that the flag is correctly set for /32 and /128
        """
        if not isinstance(data.get('cidr'), (IPv4Network, IPv6Network)):
            raise ValidationError(
                "cidr should not be type {}".format(type(data['cidr']))
            )

        if not subcidr(data['cidr']):
            data['flag'] = 'host'
        return data
