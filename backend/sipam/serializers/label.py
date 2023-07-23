from rest_framework.serializers import ModelSerializer

from sipam.models import CIDR, Label


class LabelSerializer(ModelSerializer):
    """Serializes a labelset for a cidr to a dictionary"""

    def create(self, validated_data):
        """Add a new label to a CIDR"""
        cidr = CIDR.objects.get(pk=self.context["view"].kwargs["cidr_pk"])
        return cidr.labels.create(name=validated_data["name"], value=validated_data["value"])

    class Meta:
        model = Label
        fields = ("name", "value")
