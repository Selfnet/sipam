from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import CIDR
from ..serializers import CIDRSerializer


class CIDRViewSet(ModelViewSet):
    """
        API endpoint that allows Prefixes to be viewed or edited.
    """
    queryset = CIDR.objects.all()
    serializer_class = CIDRSerializer

    def list(self, request):
        """
            Get the Root Prefixes with their children
        """
        root = []
        for cidr in CIDR.objects.all():
            if not cidr.supercidr:
                root.append(cidr)
        return Response(
            CIDRSerializer(
                root,
                many=True,
                read_only=True,
                context={'request': request}).data)

    @action(detail=True)
    def supercidr(self, request, pk=None):
        """
            API endpoint that allows direct super cidr (network) to be viewed.
        """
        return Response(
            CIDRSerializer(
                self.get_object().supercidr,
                many=True,
                read_only=True,
                context={'request': request}).data
        )

    @action(detail=True)
    def subcidr(self, request, pk=None):
        """
        API endpoint that allows direct subordinary cidr (networks) to be viewed.
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
