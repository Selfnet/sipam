from ipaddress import IPv4Network

import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIRequestFactory, force_authenticate

from sipam.models import CIDR
from sipam.utilities.enums import IP
from sipam.utilities.error import NotEnoughSpaceError
from sipam.views import CIDRViewSet


@pytest.mark.usefixtures("testData", "testToken", "testAdmin")
class CIDRTest(TestCase):
    def setUp(self):
        assert hasattr(self, "cidr")

    def test_assign_too_large(self):
        # Should raise an exception
        with pytest.raises(NotEnoughSpaceError):
            assert self.cidr.assignNet(8, "Too large")

    def test_assign_first(self):
        # Should fit
        sub = self.cidrEmpty.assignNet(32, "Single IP")
        assert sub.cidr == IPv4Network("10.3.143.1/32")

    def test_assign_net(self):
        subNet = self.cidrEmpty.assignNet(25, "Other half")
        assert subNet.cidr.prefixlen == 25
        assert subNet.parent == self.cidrEmpty

    def test_assign_ip(self):
        ip = self.cidr.assignIP("Some IP", "mail")
        assert ip.cidr == IPv4Network("10.3.141.11/32")

    def test_assign_linknet(self):
        # does not anymore return gw, ip
        net = self.cidrLink.assignLinknet("Some net")

        assert net.cidr.prefixlen == 31
        assert net.parent == self.cidrLink

    def test_assign_until_full(self):
        # Should raise an exception
        with pytest.raises(NotEnoughSpaceError):
            for i in range(17):
                assert self.cidrSmallEmpty.assignIP(f"Some IP No {i}", f"mail-{i}")

    def test_get_ips(self):
        assert isinstance(self.cidr.ips, list)
        assert isinstance(self.cidr.version, IP)

    def test_supercidr(self):
        assert self.cidr.supercidr is None

    def test_get_labels(self):
        assert isinstance(self.cidr.labelDict, dict)

    def test_cidr_list_view(self):
        factory = APIRequestFactory()
        view = CIDRViewSet.as_view({"get": "list"})

        request = factory.get(reverse("cidr-list"))

        # No authentication - this should fail
        response = view(request)
        assert response.status_code == 401

        # This time we set the user
        force_authenticate(request, user=self.admin, token=self.token)
        response = view(request)
        assert response.status_code == 200

        # Also test the full subtree query parameter
        request = factory.get(reverse("cidr-list"), {"full": True})
        force_authenticate(request, user=self.admin, token=self.token)

        response = view(request)
        assert response.status_code == 200

    def test_cidr_detail_view(self):
        factory = APIRequestFactory()
        view = CIDRViewSet.as_view({"get": "retrieve"})

        request = factory.get(reverse("cidr-detail", kwargs={"pk": self.cidr.id}))
        force_authenticate(request, user=self.admin, token=self.token)

        response = view(request, pk=self.cidr.id)
        assert response.status_code == 200

        # Also take a look at the response
        res = response.data

        assert res["cidr"] == str(self.cidr.cidr)

        # Also test the full subtree query parameter
        request = factory.get(reverse("cidr-detail", kwargs={"pk": self.cidr.id}), {"full": True})
        force_authenticate(request, user=self.admin, token=self.token)

        response = view(request, pk=self.cidr.id)
        assert response.status_code == 200

    def test_search(self):
        factory = APIRequestFactory()
        view = CIDRViewSet.as_view({"get": "list"})

        # Search for a cidr
        request = factory.get(reverse("cidr-list"), {"search": str(self.cidr.cidr)})
        force_authenticate(request, user=self.admin, token=self.token)

        response = view(request)
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["id"] == str(self.cidr.id)

    def test_cidr_actions(self):
        factory = APIRequestFactory()

        for action in ["supercidr", "subcidr", "ips"]:
            view = CIDRViewSet.as_view({"get": action})
            request = factory.get(reverse(f"cidr-{action}", kwargs={"pk": self.cidr.id}))
            force_authenticate(request, user=self.admin, token=self.token)

            response = view(request, pk=self.cidr.id)
            assert response.status_code == 200

    def test_create_by_post(self):
        factory = APIRequestFactory()
        view = CIDRViewSet.as_view({"post": "create"})

        newCIDR = {
            "cidr": "100.64.0.0/10",
            "description": "Internal Network as defined in RFC6598",
            "flag": "reservation",
        }

        request = factory.post(reverse("cidr-list"), newCIDR)
        force_authenticate(request, user=self.admin, token=self.token)

        response = view(request)
        assert response.status_code == 201
        newObj = CIDR.objects.get(id=response.data["id"])
        assert str(newObj.cidr) == newCIDR["cidr"]
        assert str(newObj.flag) == newCIDR["flag"]

        # We've got a parent object, create a subnet and check whether it shows up in the tree.

        subCidr = {
            "cidr": "100.64.123.0/24",
            "description": "Some test subnet within a parent network",
            "flag": "reservation",
        }

        request = factory.post(reverse("cidr-list"), subCidr)
        force_authenticate(request, user=self.admin, token=self.token)

        response = view(request)
        assert response.status_code == 201
        subCIDR = CIDR.objects.get(id=response.data["id"])
        assert newObj == subCIDR.parent
