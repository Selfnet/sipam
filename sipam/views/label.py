from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Label
from ..serializers import LabelSerializer


class LabelViewSet(ModelViewSet):
    """
        API endpoint that allows Labels to be added and removed from a network.
    """
    serializer_class = LabelSerializer

    def get_queryset(self):
        return Label.objects.filter(cidr__pk=self.kwargs['cidr_pk'])

    def list(self, request, cidr_pk=None):
        """
            Get labels as key-value pair
        """
        queryset = Label.objects.filter(cidr__pk=cidr_pk)
        labels = LabelSerializer(queryset,
                                 many=True,
                                 read_only=True,
                                 context={'request': request}).data

        labelDict = {label['name']: label['value'] for label in labels}

        return Response(labelDict)
