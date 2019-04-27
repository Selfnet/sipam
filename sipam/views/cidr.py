import copy
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import CIDR
from ..serializers import CIDRSerializer
from ..utilities.enums import Invoke


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
            if not CIDR.objects.filter(cidr__net_contains=cidr.cidr):
                root.append(cidr)
        return Response(CIDRSerializer([cidr for cidr in root], many=True, read_only=True, context={'request': request}).data)

    def directly(self, objects, type=Invoke.CHILDREN):
        """
            This method ensures that only direct neighbours are showed
            :param objects: this is a first param
            :param type: should be of type Invoke. else it will fail.
            :returns: the direct neighbours above or under the self.get_object().
        """
        direct = []
        undirect = []
        assert isinstance(type, Invoke)
        for i in range(0, len(objects)):
            obj = objects[i]
            before = len(undirect)
            compare = copy.copy(list(objects))
            compare.pop(i)
            for compare_object in compare:
                if type == Invoke.CHILDREN:
                    if obj.cidr.subnet_of(compare_object.cidr):
                        undirect.append(obj)
                        break
                elif type == Invoke.PARENTS:
                    if obj.cidr.supernet_of(compare_object.cidr):
                        undirect.append(obj)
                        break
            del(compare)
            if before == len(undirect):
                direct.append(obj)
            if len(direct) + len(undirect) == len(objects):
                break
        del(undirect)
        return direct

    @action(detail=True)
    def parents(self, request, pk=None):
        """
            API endpoint that allows direct parents to be viewed.
        """
        parents = CIDR.objects.filter(
            cidr__net_contains=self.get_object().cidr)
        direct_parents = self.directly(parents, type=Invoke.PARENTS)
        return Response(
            CIDRSerializer(
                direct_parents,
                many=True,
                read_only=True,
                context={'request': request}).data
        )

    @action(detail=True)
    def children(self, request, pk=None):
        """
        API endpoint that allows direct children to be viewed.
        """
        children = CIDR.objects.filter(
            cidr__net_contained=self.get_object().cidr
        )
        direct_children = self.directly(children, type=Invoke.CHILDREN)
        return Response(
            CIDRSerializer(
                direct_children,
                many=True,
                read_only=True,
                context={'request': request}).data
        )
