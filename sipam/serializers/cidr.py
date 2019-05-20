from rest_framework import serializers
from sipam.models import CIDR


class CIDRSerializer(serializers.HyperlinkedModelSerializer):
    children = serializers.SerializerMethodField()

    def validate(self, data):
        """
        Check that the flag is correctly set for /32 and /128
        """
        if (data['cidr'].version == 6 and data['cidr'].prefixlen == 128
                or data['cidr'].version == 4 and data['cidr'].prefixlen == 32):
            data['flag'] = 'host'
        return data

    class Meta:
        model = CIDR
        fields = ('id', 'cidr', 'created', 'edited',
                  'children', 'pool', 'flag', 'fqdn', 'description')

    def get_children(self, obj):
        return CIDRSerializer(
            obj.subcidr,
            many=True,
            read_only=True).data
