from ipaddress import IPv4Network

import pytest
from django.test import TestCase

from sipam.utilities.error import NotEnoughSpace
from sipam.utilities.enums import IP


@pytest.mark.usefixtures('testCIDR')
class CIDRTest(TestCase):

    def setUp(self):
        assert hasattr(self, 'cidr')

    def test_assign_too_large(self):
        # Should raise an exception
        with pytest.raises(NotEnoughSpace):
            assert self.cidr.assignNet(8, 'Too large')

    def test_assign_first(self):
        # Should fit
        sub = self.cidr.assignNet(32, 'Single IP')
        assert sub.cidr == IPv4Network('10.3.141.0/32')

    def test_assign_net(self):
        subNet = self.cidr.assignNet(25, 'Other half')
        assert subNet.cidr.prefixlen == 25

    def test_assign_ip(self):
        ip = self.cidr.assignIP('Some IP', 'mail')
        assert ip.cidr.prefixlen == 32

    def test_assign_linknet(self):
        net, gw, ip = self.cidr.assignLinknet('Some net')

        assert net.cidr.prefixlen == 31
        assert gw.cidr.prefixlen == 32
        assert ip.cidr.prefixlen == 32

    def test_get_ips(self):
        assert isinstance(self.cidr.ips, list)
        assert isinstance(self.cidr.version, IP)

    def test_supercidr(self):
        assert self.cidr.supercidr is None
