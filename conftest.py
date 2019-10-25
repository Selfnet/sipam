import pytest

from sipam.models import CIDR, Pool


@pytest.fixture(scope='class')
def testCIDR(request) -> CIDR:
    """Create a test network to work with

    Returns:
        CIDR -- The test network as CIDR object
    """
    CIDR.objects.create(cidr='10.3.141.0/24', description='TestNet')
    request.cls.cidr = CIDR.objects.get(cidr='10.3.141.0/24')


@pytest.fixture(scope='class')
def fullCIDR(request) -> CIDR:
    """Create a test network to work with

    Returns:
        CIDR -- The test network as CIDR object
    """
    CIDR.objects.create(cidr='10.2.71.82/32', description='TestNet')
    request.cls.fullcidr = CIDR.objects.get(cidr='10.2.71.82/32')


@pytest.fixture(scope='class')
def emptyPool(request) -> Pool:
    """Create an empty pool to test this special case

    Returns:
        Pool -- An empty test pool to use
    """
    Pool.objects.create(id='testEmpty', label='testEmpty', description='Empty Test Pool')
    request.cls.emptyPool = Pool.objects.get(id='testEmpty')


@pytest.fixture(scope='class')
def testPool(request, testCIDR, fullCIDR) -> Pool:
    """Create a test pool to work with

    Returns:
        Pool -- A test pool to use
    """
    Pool.objects.create(id='test', label='test', description='Test Pool')
    request.cls.pool = Pool.objects.get(id='test')

    request.cls.fullcidr.pool = request.cls.pool
    request.cls.fullcidr.save()

    request.cls.cidr.pool = request.cls.pool
    request.cls.cidr.save()
