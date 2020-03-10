from rest_framework import serializers

from .cidr import CIDRSerializer


class AssignmentSerializer(serializers.Serializer):
    """This is a serializer for a custom form
    """
    hostname = serializers.CharField(required=False)
    useDefaultDomain = serializers.BooleanField(default=True, help_text='Use pools default domain')
    description = serializers.CharField(required=True)
    assignments = CIDRSerializer(many=True, read_only=True)
