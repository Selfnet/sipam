from rest_framework import serializers

from .cidr import CIDRSerializer


class AssignmentSerializer(serializers.Serializer):
    """This is a serializer for a custom form."""

    hostname = serializers.CharField(required=False, write_only=True)
    useDefaultDomain = serializers.BooleanField(default=True, write_only=True, help_text="Use pools default domain")
    description = serializers.CharField(required=True, write_only=True)
    assignments = CIDRSerializer(many=True, read_only=True)
