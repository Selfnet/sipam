from rest_framework import serializers
from sipam.models import Pool
from ..serializers import CIDRSerializer


class PoolSerializer(serializers.HyperlinkedModelSerializer):
    prefixes = CIDRSerializer(many=True, read_only=True)

    class Meta:
        model = Pool
        fields = ('id', 'created', 'edited', 'prefixes', 'description')
