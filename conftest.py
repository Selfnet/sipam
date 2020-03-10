import pytest

from accounts.models import FlaggedToken, User
from sipam.models import CIDR, Pool
from sipam.utilities.enums import PoolType


@pytest.fixture(scope='class')
def testCIDR(request) -> CIDR:
    """Create a test network to work with

    Returns:
        CIDR -- The test network as CIDR object
    """
    CIDR.objects.create(cidr='10.3.141.0/24', description='TestNet')
    request.cls.cidr = CIDR.objects.get(cidr='10.3.141.0/24')

    CIDR.objects.create(cidr='10.3.142.0/24', description='TestNet for LinkNet pool')
    request.cls.cidrLink = CIDR.objects.get(cidr='10.3.142.0/24')


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
def testLinkPool(request, testCIDR) -> Pool:
    """Create a test pool to work with

    Returns:
        Pool -- A test pool to use
    """
    Pool.objects.create(id='testLink', label='test', description='Test Link Pool', poolType=PoolType.HOST)
    request.cls.linkPool = Pool.objects.get(id='testLink')

    request.cls.cidrLink.pool = request.cls.linkPool
    request.cls.cidrLink.save()


@pytest.fixture(scope='class')
def testHostPool(request, testCIDR, fullCIDR) -> Pool:
    """Create a test pool to work with

    Returns:
        Pool -- A test pool to use
    """
    Pool.objects.create(id='testHost', label='test', description='Test Host Pool', poolType=PoolType.VM)
    request.cls.pool = Pool.objects.get(id='testHost')

    request.cls.fullcidr.pool = request.cls.pool
    request.cls.fullcidr.save()

    request.cls.cidr.pool = request.cls.pool
    request.cls.cidr.save()


@pytest.fixture(scope='class')
def testUser(request):
    username = 'test'
    password = 'very_secure'

    User.objects.create(username=username, password=password)
    request.cls.user = User.objects.get(username=username)

    request.cls.username = username
    request.cls.password = password


@pytest.fixture(scope='class')
def testAdmin(request):
    username = 'Admin'
    password = 'very_very_secure'

    User.objects.create(username=username, password=password)
    request.cls.admin = User.objects.get(username=username)

    # Set admin flag
    request.cls.admin.is_staff = True
    request.cls.admin.save()

    request.cls.admin_username = username
    request.cls.admin_password = password


@pytest.fixture(scope='class')
def testToken(request, testAdmin, testUser):
    admin = User.objects.get(username='Admin')
    user = User.objects.get(username='test')

    token = FlaggedToken.objects.create(user=admin, write=True)
    rtoken = FlaggedToken.objects.create(user=user, write=False)

    request.cls.token = token
    request.cls.rtoken = rtoken
