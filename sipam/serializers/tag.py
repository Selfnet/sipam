from rest_framework.serializers import ModelSerializer

from sipam.models import Tag


class TagSerializer(ModelSerializer):

    class Meta:
        model = Tag
        fields = ('name',)
