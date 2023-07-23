from rest_framework.serializers import ModelSerializer, StringRelatedField

from accounts.models import FlaggedToken


class TokenSerializer(ModelSerializer):
    user = StringRelatedField()

    class Meta:
        model = FlaggedToken
        fields = ["key", "user", "write", "description"]
        read_only_fields = ["key", "user"]
