from django.db.models import Q
from rest_framework import serializers
from rest_framework.decorators import action
from sipam.models import CIDR
from .. import utilities


class CIDRSerializer(serializers.HyperlinkedModelSerializer):
    children = serializers.SerializerMethodField()

    def validate(self, data):
        """
        Check that the flag is correctly set for /32 and /128
        """
        if data['cidr'].prefixlen in [128, 32]:
            data['flag'] = 'host'
        return data

    class Meta:
        model = CIDR
        fields = ('id', 'cidr', 'created', 'edited',
                  'children', 'pool', 'flag', 'fqdn', 'description')

    def get_children(self, obj):
        return CIDRSerializer(
            [cidr for cidr in CIDR.objects.filter(
                Q(cidr__net_contained=obj.cidr)
            ) if utilities.subnet(cidr)],
            many=True,
            read_only=True).data
