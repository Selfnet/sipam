import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIRequestFactory, force_authenticate

from sipam.serializers import LabelSerializer
from sipam.views import LabelViewSet


@pytest.mark.usefixtures('testData', 'testToken', 'testAdmin')
class LabelTest(TestCase):

    def setUp(self):
        assert hasattr(self, 'cidr')
        assert hasattr(self, 'token')
        assert hasattr(self, 'admin')

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

        # No authentication
        response = view(request, cidr_pk=self.cidr.id)
        assert response.status_code == 401

        # So try again
        force_authenticate(request, user=self.admin)
        response = view(request, cidr_pk=self.cidr.id)
        assert response.status_code == 201

        assert self.cidr.labelDict['TestLabel'] == 'TestValue'

    def test_get_labels(self):
        factory = APIRequestFactory()
        view = LabelViewSet.as_view({'get': 'list'})

        # Test a read-only token as well as a rw token
        for token in [self.token, self.rtoken]:
            request = factory.get(reverse('cidr-labels-list', kwargs={'cidr_pk': self.cidr.id}))
            force_authenticate(request, token=token)

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

        # No user still doesn't work since authentication is checked globally
        # But what about a read-only token?
        for token, rcode in [(self.token, 204), (self.rtoken, 403)]:
            request = factory.put(reverse('cidr-labels-detail', kwargs={'pk': 'WithLabelKey', 'cidr_pk': self.cidr.id}), updatedLabel)
            force_authenticate(request, token=token)

            response = view(request, pk='WithLabelKey', cidr_pk=self.cidr.id)

            assert response.status_code == rcode
            assert self.cidr.labelDict['WithLabelKey'] == updatedLabel['WithLabelKey']

    def test_delete_label(self):
        # Create a label
        self.cidr.labels.create(name='DeleteLabelKey', value='DeleteLabelValue')
        assert self.cidr.labelDict['DeleteLabelKey'] == 'DeleteLabelValue'

        factory = APIRequestFactory()
        view = LabelViewSet.as_view({'delete': 'destroy'})

        request = factory.delete(reverse('cidr-labels-detail', kwargs={'pk': 'DeleteLabelKey', 'cidr_pk': self.cidr.id}))
        force_authenticate(request, user=self.admin, token=self.token)

        response = view(request, pk='DeleteLabelKey', cidr_pk=self.cidr.id)

        assert response.status_code == 204
        assert self.cidr.labelDict.get('DeleteLabelKey', None) is None

        # Try to delete a label which does not exist
        request = factory.delete(reverse('cidr-labels-detail', kwargs={'pk': 'DeleteNonExistingLabelKey', 'cidr_pk': self.cidr.id}))
        force_authenticate(request, user=self.admin, token=self.token)

        response = view(request, pk='DeleteNonExistingLabelKey', cidr_pk=self.cidr.id)
        assert response.status_code == 404
