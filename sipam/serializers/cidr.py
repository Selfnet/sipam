from django.db.models import Q
from rest_framework import serializers
from rest_framework.decorators import action
from sipam.models import CIDR
from .. import utilities


class CIDRSerializer(serializers.HyperlinkedModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = CIDR
        fields = ('id', 'cidr', 'created', 'edited',
                  'children', 'pool', 'fqdn', 'description')

    def get_children(self, obj):
        return CIDRSerializer(
            [cidr for cidr in CIDR.objects.filter(
                Q(cidr__net_contained=obj.cidr)
            ) if utilities.subnet(cidr)],
            many=True,
            read_only=True).data
