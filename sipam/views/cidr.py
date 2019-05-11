from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import CIDR
from ..serializers import CIDRSerializer


class CIDRViewSet(viewsets.ModelViewSet):
    """
        API endpoint that allows Prefixes to be viewed or edited.
    """
    queryset = CIDR.objects.all()
    serializer_class = CIDRSerializer

    def list(self, request):
        """
            Get the Root Prefixes with their childrens
        """
        root = []
        for cidr in CIDR.objects.all():
            if not cidr.parents:
                root.append(cidr)
        return Response(
            CIDRSerializer(
                [cidr for cidr in root],
                many=True,
                read_only=True,
                context={'request': request}).data)

    @action(detail=True)
    def parents(self, request, pk=None):
        """
            API endpoint that allows direct parents to be viewed.
        """
        return Response(
            CIDRSerializer(
                self.get_object().parents,
                many=True,
                read_only=True,
                context={'request': request}).data
        )

    @action(detail=True)
    def subcidr(self, request, pk=None):
        """
        API endpoint that allows direct subcidr to be viewed.
        """
        return Response(
            CIDRSerializer(
                self.get_object().subcidr,
                many=True,
                read_only=True,
                context={'request': request}).data
        )

    @action(detail=True)
    def ips(self, request, pk=None):
        """
        API Endpoint that allows direct children ips to be viewed.
        """
        return Response(
            CIDRSerializer(
                self.get_object().ips,
                many=True,
                read_only=True,
                context={'request': request}).data
        )
