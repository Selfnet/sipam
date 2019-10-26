from ipaddress import IPv4Network

import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIRequestFactory

from sipam.utilities.error import NoSuchPrefix
from sipam.serializers import PoolSerializer, AssignmentSerializer
from sipam.utilities.enums import IP, HostType
from sipam.views import PoolViewSet


@pytest.mark.usefixtures('testPool', 'emptyPool')
class PoolTest(TestCase):
    """Test pool creation and assignments
    """

    def test_get_pool(self):
        assert self.pool.id == 'test'
        assert self.emptyPool.id == 'testEmpty'
        assert len(self.emptyPool.getPrefixes()) == 0
        assert len(self.pool.getPrefixes()) == 2

    def test_assign_from_empty_pool(self):
        with pytest.raises(NoSuchPrefix):
            assert self.emptyPool.assignFromPool(IP.v4, HostType.VIRTUAL, 'Desc', 'host')

    def test_assign_from_pool(self):
        ip = self.pool.assignFromPool(IP.v4, HostType.VIRTUAL, 'Desc', 'host')
        assert isinstance(ip.cidr, IPv4Network)

        net, gw, ip = self.pool.assignFromPool(IP.v4, HostType.PHYSICAL, 'Desc', 'physhost')
        assert isinstance(net.cidr, IPv4Network)
        assert isinstance(gw.cidr, IPv4Network)
        assert isinstance(ip.cidr, IPv4Network)

    def test_pool_serializer(self):
        serializer = PoolSerializer(instance=self.pool)

        assert set(serializer.data.keys()) == set(['id', 'label', 'created', 'edited', 'prefixes', 'description'])

    def test_pool_view(self):
        factory = APIRequestFactory()
        view = PoolViewSet.as_view({'get': 'list'})

        request = factory.get(reverse('pool-list'))

        response = view(request)
        assert response.status_code == 200

    def test_pool_detail_view(self):
        factory = APIRequestFactory()
        view = PoolViewSet.as_view({'get': 'retrieve'})

        request = factory.get(reverse('pool-detail', kwargs={'pk': self.pool.id}))

        response = view(request, pk=self.pool.id)
        assert response.status_code == 200

    def test_pool_view_assign(self):
        factory = APIRequestFactory()
        view = PoolViewSet.as_view({'post': 'assign'})

        newAssignment = {
            'hostname': 'Test',
            'hostType': 'HostType.VIRTUA',  # Intended mistake
            'description': 'Test'
        }

        # Test serializer with invalid data
        serializer = AssignmentSerializer(data=newAssignment)
        assert not serializer.is_valid()

        newAssignment['hostType'] = 'HostType.VIRTUAL'

        # Now it should be valid
        serializer = AssignmentSerializer(data=newAssignment)
        assert serializer.is_valid()

        # Continue with a request with valid data
        request = factory.post(reverse('pool-assign', kwargs={'pk': self.pool.id}), newAssignment)

        response = view(request, pk=self.pool.id)
        assert response.status_code == 204

        # Emtpy pool
        request = factory.post(reverse('pool-assign', kwargs={'pk': self.emptyPool.id}), newAssignment)

        response = view(request, pk=self.emptyPool.id)
        assert response.status_code == 507
