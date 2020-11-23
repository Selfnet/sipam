from ipaddress import IPv4Network, IPv6Network
from typing import Dict, List

from drf_yasg.utils import swagger_serializer_method
from rest_framework.serializers import (CharField, DictField, ListField,
                                        ModelSerializer, SerializerMethodField,
                                        ValidationError)
from sipam.models import CIDR

from ..utilities import subcidr


class StringListField(ListField):
    child = CharField()


class DocumentField(DictField):
    child = CharField()


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

    @swagger_serializer_method(serializer_or_field=StringListField)
    def get_children(self, obj) -> List[str]:
        return obj.getChildIDs()

    @swagger_serializer_method(serializer_or_field=DocumentField)
    def get_labels(self, obj) -> Dict[str, str]:
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
