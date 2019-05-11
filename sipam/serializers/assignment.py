from rest_framework import serializers
from ..utilities.enums import HostType


class AssignmentSerializer(serializers.Serializer):
    """This is a serializer for a custom form
    """
    hostname = serializers.CharField(required=False)
    hostType = serializers.ChoiceField(choices=[(tag, tag.value) for tag in HostType], default=HostType.VIRTUAL)
    description = serializers.CharField(required=True)
