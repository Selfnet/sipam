from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Pool
from ..models.error import NoSuchPrefix
from ..serializers import AssignmentSerializer, PoolSerializer
from ..utilities.enums import IP


class PoolViewSet(ModelViewSet):
    """
    API endpoint that allows Pools to be viewed or edited.
    """
    queryset = Pool.objects.all()
    serializer_class = PoolSerializer

    def list(self, request):
        """List all pools
        """
        return Response(PoolSerializer(Pool.objects.all(), many=True, read_only=True, context={'request': request}).data)

    @transaction.atomic
    @action(detail=True, methods=['POST'], name="Assign Subnet from Pool", serializer_class=AssignmentSerializer)
    def assign(self, request, pk=None):
        """Adds a new address within the pool
        """
        pool = self.get_object()

        # Check if we have prefixes to assign from
        if len(pool.getPrefixes()) == 0:
            return Response(status=status.HTTP_507_INSUFFICIENT_STORAGE)

        serializer = AssignmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        hostType = serializer.data['hostType']
        description = serializer.data['description']
        hostname = serializer.data['hostname']

        # Try to assign an ip for v4 and v6, if NoSuchPrefix is raised we
        # assume the pool is not intented to be used with this network type
        result = {}
        noprefix = {}
        for IPType in IP:
            try:
                result[IPType] = pool.assignFromPool(IPType, hostType, description, hostname)
            except NoSuchPrefix:
                noprefix[IPType] = True

        # Check whether the pool is full
        # If NoSuchPrefix has been raised this is considered to be as intended
        # We ignore this issue, otherwise the pool is full and we roll back
        # the complete assignment, pretending nothing ever happended
        if result.get(IP.v4, None) is None and not noprefix.get(IP.v4, False) or result.get(IP.v6, None) is None and not noprefix.get(IP.v6, False):
            transaction.set_rollback(True)
            return Response(status=status.HTTP_507_INSUFFICIENT_STORAGE)

        # Successfully assigned
        return Response(status=status.HTTP_204_NO_CONTENT)

    @assign.mapping.delete
    def deleteAssignment(self, request, pk=None):
        """Deletes an assigned address
        """
        pass
