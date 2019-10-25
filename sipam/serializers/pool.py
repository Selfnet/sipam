from rest_framework.serializers import ModelSerializer

from sipam.models import Pool

from ..serializers import CIDRSerializer


class PoolSerializer(ModelSerializer):
    prefixes = CIDRSerializer(many=True, read_only=True)

    class Meta:
        model = Pool
        fields = ('id', 'label', 'created', 'edited', 'prefixes', 'description')
