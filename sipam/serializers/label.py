from rest_framework.serializers import ModelSerializer

from sipam.models import Label


class LabelSerializer(ModelSerializer):

    class Meta:
        model = Label
        fields = ('name', 'value')
