from ipaddress import ip_network

from accounts.permissions import ReadOnlyToken, UserAccess, WriteToken
from django.shortcuts import get_object_or_404
from netfields.functions import Masklen
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import CIDR
from ..serializers import CIDRSerializer, RecursiveCIDRSerializer


class CIDRViewSet(ModelViewSet):
    """
        API endpoint that allows Prefixes to be viewed or edited.
    """
    queryset = CIDR.objects.all()
    serializer_class = CIDRSerializer
    filter_backends = [SearchFilter]
    search_fields = ['cidr', 'fqdn', 'description', 'labels__value', 'labels__name']

    permission_classes = [ReadOnlyToken | WriteToken | UserAccess]

    def list(self, request):
        """
            Get the Root Prefixes with their children
        """
        # If a search term is available apply it to the queryset
        if self.request.query_params.get('search', False):
            queryset = self.filter_queryset(self.queryset)

        # No filter, so prune the dataset to the root networks
        else:
            queryset = CIDR.objects.filter(parent=None)

        # Only do this, if explicitly requested, increases load
        if self.request.query_params.get('full', False):
            return Response(
                RecursiveCIDRSerializer(
                    queryset,
                    many=True,
                    read_only=True,
                    context={'request': request}).data)

        return Response(
            CIDRSerializer(
                queryset,
                many=True,
                read_only=True,
                context={'request': request}).data)

    def retrieve(self, request, pk=None):
        cidr = get_object_or_404(self.queryset, pk=pk)

        if self.request.query_params.get('full', False):
            return Response(
                RecursiveCIDRSerializer(
                    cidr,
                    context={'request': request}).data)

        return Response(
            self.serializer_class(
                cidr,
                context={'request': request}).data)

    def create(self, request, *args, **kwargs):
        """Create a new cidr object by automatically detecting parents
        """

        serializer = self.serializer_class(data=request.data, context={'request': request})

        if not serializer.is_valid():
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        data = serializer.validated_data

        # Check whether there is a parent node and if so take the nearest parent
        ip = ip_network(data['cidr'])

        parent = CIDR.objects.filter(cidr__net_contains=ip).order_by(Masklen('cidr').desc()).first()

        cidr = CIDR(**data, parent=parent)
        cidr.save()

        return Response(self.serializer_class(
            cidr,
            context={'request': request}).data,
            status=status.HTTP_201_CREATED)

    @action(detail=True)
    def supercidr(self, request, pk=None):
        """
            API endpoint that allows direct super cidr (network) to be viewed.
        """
        return Response(
            CIDRSerializer(
                self.get_object().supercidr,
                many=False,
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
