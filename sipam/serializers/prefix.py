from rest_framework import serializers
from sipam.models import Prefix
from ..serializers import IPSerializer


class PrefixSerializer(serializers.HyperlinkedModelSerializer):
    # ips = IPSerializer(many=True, read_only=True)
    class Meta:
        model = Prefix
        fields = ('id', 'created', 'edited', 'prefix', 'parent', 'pool', 'children', 'subdomain', 'description')
    def get_fields(self):
        fields = super(PrefixSerializer, self).get_fields()
        fields['children'] = PrefixSerializer(many=True, read_only=True)
        return fields