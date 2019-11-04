import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIRequestFactory

from sipam.views import LabelViewSet
from sipam.serializers import LabelSerializer


@pytest.mark.usefixtures('testCIDR')
class LabelTest(TestCase):

    def setUp(self):
        assert hasattr(self, 'cidr')

    def test_add_label(self):
        factory = APIRequestFactory()
        view = LabelViewSet.as_view({'post': 'create'})

        newLabel = {
            'name': 'TestLabel',
            'value': 'TestValue'
        }

        serializer = LabelSerializer(data=newLabel)
        assert serializer.is_valid()

        request = factory.post(
            reverse('cidr-labels-list', kwargs={'cidr_pk': self.cidr.id}),
            newLabel)

        response = view(request)

        assert response.status_code == 201

        print(self.cidr.labels)

    def test_get_labels(self):
        factory = APIRequestFactory()
        view = LabelViewSet.as_view({'get': 'list'})

        request = factory.get(reverse('cidr-labels-list', kwargs={'cidr_pk': self.cidr.id}))

        response = view(request)

        print(response.data)
        assert response.status_code == 200
