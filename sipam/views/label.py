from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Label, CIDR
from ..serializers import LabelSerializer


class LabelViewSet(ModelViewSet):
    """
        API endpoint that allows Labels to be added and removed from a network.
    """
    serializer_class = LabelSerializer

    def get_queryset(self):
        return Label.objects.filter(cidr_id=self.kwargs['cidr_pk'])

    def list(self, request, cidr_pk=None):
        """
            Get labels as key-value pair
        """
        queryset = Label.objects.filter(cidr_id=cidr_pk)
        labels = LabelSerializer(
            queryset,
            many=True,
            read_only=True,
            context={'request': request}).data

        labelDict = {label['name']: label['value'] for label in labels}

        return Response(labelDict)

    def update(self, request, pk=None, cidr_pk=None):
        """Updates a given label
        """
        cidr = CIDR.objects.get(pk=cidr_pk)

        if cidr.labelDict.get(pk, None) is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        label = cidr.labels.get(name=pk)
        label.value = request.data[pk]
        label.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
