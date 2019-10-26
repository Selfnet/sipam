from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Tag
from ..serializers import TagSerializer


class TagViewSet(ModelViewSet):
    """
        API endpoint that allows Prefixes to be viewed or edited.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def list(self, request):
        """
            Get all tags
        """
        return Response(TagSerializer(Tag.objects.all(), many=True, read_only=True, context={'request': request}).data)
