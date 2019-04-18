from django.db.models import Q
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
        return Response(
            CIDRSerializer(
                CIDR.objects.filter(
                    Q(cidr__max_prefixlen=127) & Q(cidr__family=6) |
                    Q(cidr__max_prefixlen=31) & Q(cidr__family=4)
                ),
                context={'request': request},
                many=True
            ).data
        )

    @action(detail=True)
    def parents(self, request, pk=None):
        """
        API endpoint that allows Parents to be viewed.
        """
        return Response(
            CIDRSerializer(
                CIDR.objects.filter(
                    cidr__net_contains=self.get_object().cidr
                ),
                many=True,
                read_only=True,
                context={'request': request}).data
        )

    @action(detail=True)
    def children(self, request, pk=None):
        """
        API endpoint that allows Children to be viewed.
        """
        return Response(
            CIDRSerializer(
                CIDR.objects.filter(
                    cidr__net_contained=self.get_object().cidr
                ),
                many=True,
                read_only=True,
                context={'request': request}).data
        )
