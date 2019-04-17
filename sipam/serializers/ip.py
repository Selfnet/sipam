from rest_framework import serializers
from sipam.models import IP


class IPSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = IP
        fields = ('id', 'created', 'edited', 'ip', 'parent', 'fqdn', 'description')