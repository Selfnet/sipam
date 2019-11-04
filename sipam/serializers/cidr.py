from rest_framework.serializers import ModelSerializer, SerializerMethodField

from sipam.models import CIDR
from sipam.utilities.enums import IP


class CIDRSerializer(ModelSerializer):
    children = SerializerMethodField()
    labels = SerializerMethodField()

    def validate(self, data):
        """
        Check that the flag is correctly set for /32 and /128
        """
        if data['cidr'].version == IP.v6 and data['cidr'].prefixlen == 128 or data['cidr'].version == IP.v4 and data['cidr'].prefixlen == 32:
            data['flag'] = 'host'
        return data

    class Meta:
        model = CIDR
        fields = ('id', 'cidr', 'created', 'edited',
                  'children', 'pool', 'flag', 'fqdn', 'description', 'labels')

    def get_children(self, obj):
        return CIDRSerializer(
            obj.subcidr,
            many=True,
            read_only=True).data

    def get_labels(self, obj) -> dict:
        return obj.labelDict
