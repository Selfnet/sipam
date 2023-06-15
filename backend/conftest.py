import pytest
from django.core.management import call_command

from accounts.models import FlaggedToken, User
from sipam.models import CIDR, Pool


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
        call_command('loaddata', 'sample_pool_nets.json')
        CIDR._tree_manager.rebuild()


@pytest.fixture(scope='class')
def testData(request) -> CIDR:
    """Attach test data to be easily accessible from tests
    Test data are imported in the previous step
    """
    # Pin CIDRs to request objects
    request.cls.cidr = CIDR.objects.get(cidr='10.3.141.0/24')
    request.cls.cidrLink = CIDR.objects.get(cidr='10.3.142.0/24')
    request.cls.cidrEmpty = CIDR.objects.get(cidr='10.3.143.0/24')
    request.cls.cidrSmallEmpty = CIDR.objects.get(cidr='10.3.144.0/28')

    # Pin Pools to request objects
    request.cls.emptyPool = Pool.objects.get(id='testEmpty')
    request.cls.linkPool = Pool.objects.get(id='SRV')
    request.cls.pool = Pool.objects.get(id='vm')

    CIDR.objects.create(cidr='10.2.71.82/32', description='TestNet')
    request.cls.fullcidr = CIDR.objects.get(cidr='10.2.71.82/32')


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
