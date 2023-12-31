from ipaddress import IPv4Network, IPv6Network
from typing import Any

from drf_yasg.utils import swagger_serializer_method
from rest_framework.serializers import (
    CharField,
    DictField,
    ListField,
    ModelSerializer,
    SerializerMethodField,
    ValidationError,
)
from rest_framework.utils.serializer_helpers import ReturnDict, ReturnList

from sipam.models import CIDR
from sipam.utilities import subcidr


class StringListField(ListField):
    child = CharField()


class DocumentField(DictField):
    child = CharField()


class CIDRSerializer(ModelSerializer):
    children = SerializerMethodField()
    labels = SerializerMethodField()
    instance: CIDR

    class Meta:
        model = CIDR
        fields = (
            "id",
            "cidr",
            "parent",
            "children",
            "created",
            "edited",
            "pool",
            "flag",
            "fqdn",
            "description",
            "labels",
        )
        read_only_fields = ("parent", "children", "id")

    @swagger_serializer_method(serializer_or_field=StringListField)
    def get_children(self, obj: CIDR) -> list[str]:
        return obj.getChildIDs()

    @swagger_serializer_method(serializer_or_field=DocumentField)
    def get_labels(self, obj: CIDR) -> dict[str, str]:
        return obj.labelDict

    def get_supercidr(self) -> Any | ReturnDict:
        return CIDRSerializer(self.instance.parent, many=False, read_only=True, context=self.context).data


class RecursiveCIDRSerializer(CIDRSerializer):
    @swagger_serializer_method(serializer_or_field="RecursiveCIDRSerializer(many=True, read_only=True)")
    def get_children(self, obj: CIDR) -> ReturnList | Any | ReturnDict:
        return RecursiveCIDRSerializer(obj.subcidr, many=True, read_only=True, context=self.context).data

    def validate(self, data):
        """Check that the flag is correctly set for /32 and /128."""
        if not isinstance(data.get("cidr"), IPv4Network | IPv6Network):
            raise ValidationError("cidr should not be type {}".format(type(data["cidr"])))

        if not subcidr(data["cidr"]):
            data["flag"] = "host"
        return data
