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

        response = view(request, cidr_pk=self.cidr.id)

        assert response.status_code == 201

        assert self.cidr.labelDict['TestLabel'] == 'TestValue'

    def test_get_labels(self):
        factory = APIRequestFactory()
        view = LabelViewSet.as_view({'get': 'list'})

        request = factory.get(reverse('cidr-labels-list', kwargs={'cidr_pk': self.cidr.id}))

        # No labels
        response = view(request, cidr_pk=self.cidr.id)

        assert response.status_code == 200
        assert response.data == self.cidr.labelDict

        # Created a label - something to retieve
        self.cidr.labels.create(name='WithLabelKey', value='WithLabelValue')
        assert self.cidr.labelDict['WithLabelKey'] == 'WithLabelValue'

        response = view(request, cidr_pk=self.cidr.id)

        assert response.status_code == 200
        assert response.data == self.cidr.labelDict

    def test_update_label(self):
        # Create a label
        self.cidr.labels.create(name='WithLabelKey', value='WithLabelValue')
        assert self.cidr.labelDict['WithLabelKey'] == 'WithLabelValue'

        factory = APIRequestFactory()
        view = LabelViewSet.as_view({'put': 'update'})

        updatedLabel = {
            'WithLabelKey': 'UpdatedValue'
        }

        request = factory.put(reverse('cidr-labels-detail', kwargs={'pk': 'WithLabelKey', 'cidr_pk': self.cidr.id}), updatedLabel)

        response = view(request, pk='WithLabelKey', cidr_pk=self.cidr.id)

        assert response.status_code == 204
        assert self.cidr.labelDict['WithLabelKey'] == updatedLabel['WithLabelKey']

    def test_delete_label(self):
        # Create a label
        self.cidr.labels.create(name='DeleteLabelKey', value='DeleteLabelValue')
        assert self.cidr.labelDict['DeleteLabelKey'] == 'DeleteLabelValue'

        factory = APIRequestFactory()
        view = LabelViewSet.as_view({'delete': 'destroy'})

        request = factory.delete(reverse('cidr-labels-detail', kwargs={'pk': 'DeleteLabelKey', 'cidr_pk': self.cidr.id}))

        response = view(request, pk='DeleteLabelKey', cidr_pk=self.cidr.id)

        assert response.status_code == 204
        assert self.cidr.labelDict.get('DeleteLabelKey', None) is None

        # Try to delete a label which does not exist
        request = factory.delete(reverse('cidr-labels-detail', kwargs={'pk': 'DeleteNonExistingLabelKey', 'cidr_pk': self.cidr.id}))

        response = view(request, pk='DeleteNonExistingLabelKey', cidr_pk=self.cidr.id)
        assert response.status_code == 404
