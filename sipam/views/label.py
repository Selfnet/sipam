from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Label
from ..serializers import LabelSerializer


class LabelViewSet(ModelViewSet):
    """
        API endpoint that allows PLabels to be added and removed from a network.
    """
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

    def list(self, request):
        """
            Get all tags
        """
        return Response(LabelSerializer(Label.objects.all(), many=True, read_only=True, context={'request': request}).data)
