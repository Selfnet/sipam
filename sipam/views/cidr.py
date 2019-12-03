from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
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

    @method_decorator(cache_page(60))
    def list(self, request):
        """
            Get the Root Prefixes with their children
        """

        # If a search term is available apply it to the queryset
        if self.request.query_params.get('search', None):
            queryset = self.filter_queryset(self.queryset)

        # No filter, so prune the dataset to the root networks
        else:
            queryset = [cidr for cidr in self.queryset if cidr.supercidr is None]

        # Only to this, if explicitly requested, increases load
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

    @method_decorator(cache_page(60))
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
