from ipaddress import IPv4Network

import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIRequestFactory, force_authenticate

from sipam.serializers import AssignmentSerializer, PoolSerializer
from sipam.utilities.enums import IP
from sipam.utilities.error import NoSuchPrefixError
from sipam.views import PoolViewSet


@pytest.mark.usefixtures("testData", "testToken", "testAdmin")
class PoolTest(TestCase):
    """Test pool creation and assignments."""

    def test_get_pool(self):
        assert self.pool.id == "vm"
        assert self.linkPool.id == "SRV"
        assert self.emptyPool.id == "testEmpty"
        assert len(self.emptyPool.getPrefixes()) == 0
        assert len(self.pool.getPrefixes()) == 3
        assert len(self.linkPool.getPrefixes()) == 1

    def test_assign_from_empty_pool(self):
        with pytest.raises(NoSuchPrefixError):
            assert self.emptyPool.assignFromPool(IP.v4, "Desc", "host")

    def test_assign_from_pool(self):
        ip = self.pool.assignFromPool(IP.v4, "Desc", "host")
        assert isinstance(ip.cidr, IPv4Network)
        # does not anymore return gw, ip
        net = self.linkPool.assignFromPool(IP.v4, "Desc", "physhost")
        assert isinstance(net.cidr, IPv4Network)

    def test_pool_serializer(self):
        serializer = PoolSerializer(instance=self.pool)

        assert set(serializer.data.keys()) == {"id", "label", "prefixes", "poolType", "description", "defaultDomain"}

    def test_pool_view(self):
        factory = APIRequestFactory()
        view = PoolViewSet.as_view({"get": "list"})

        request = factory.get(reverse("pool-list"))

        # We set no authentication here
        response = view(request)
        assert response.status_code == 401

        # This time
        force_authenticate(request, token=self.token)
        response = view(request)
        assert response.status_code == 200

    def test_pool_detail_view(self):
        factory = APIRequestFactory()
        view = PoolViewSet.as_view({"get": "retrieve"})

        request = factory.get(reverse("pool-detail", kwargs={"pk": self.pool.id}))
        force_authenticate(request, token=self.token)

        response = view(request, pk=self.pool.id)
        assert response.status_code == 200

    def test_pool_view_assign(self):
        factory = APIRequestFactory()
        view = PoolViewSet.as_view({"post": "assign"})

        newAssignment = {"hostname": "Test", "description": "Test"}

        serializer = AssignmentSerializer(data=newAssignment)
        assert serializer.is_valid()

        # Continue with a request with valid data
        request = factory.post(reverse("pool-assign", kwargs={"pk": self.pool.id}), newAssignment)
        force_authenticate(request, token=self.token)

        response = view(request, pk=self.pool.id)
        assert response.status_code == 201

        assert len(response.data["assignments"]) > 0

        # Emtpy pool
        request = factory.post(reverse("pool-assign", kwargs={"pk": self.emptyPool.id}), newAssignment)
        force_authenticate(request, token=self.token)

        response = view(request, pk=self.emptyPool.id)
        assert response.status_code == 507
