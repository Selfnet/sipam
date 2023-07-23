import pytest
from accounts.models import FlaggedToken
from accounts.views import TokenViewSet
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIRequestFactory, force_authenticate


@pytest.mark.usefixtures("testToken", "testAdmin", "testUser")
class TokenTest(TestCase):
    def setUp(self):
        assert hasattr(self, "user")
        assert hasattr(self, "token")
        assert hasattr(self, "admin")

    def test_get_token(self):
        factory = APIRequestFactory()
        view = TokenViewSet.as_view({"get": "list"})

        request = factory.get(reverse("token-list"))

        # No authentication - this should fail
        response = view(request)
        assert response.status_code == 401

        # Token auth - Tokens shall not pass
        force_authenticate(request, token=self.token)
        response = view(request)
        assert response.status_code == 403

        # The user should be able to authenticate, but get an empty list
        force_authenticate(request, user=self.user)
        response = view(request)
        assert response.status_code == 200
        assert len(response.data) == 1

        # Admin, should get a response
        force_authenticate(request, user=self.admin)
        response = view(request)
        assert response.status_code == 200
        assert len(response.data) == len(FlaggedToken.objects.all())

    def test_create_view_user_token(self):
        factory = APIRequestFactory()
        view = TokenViewSet.as_view({"post": "create"})

        newToken = {"write": True, "description": "A token created by a user"}

        request = factory.post(reverse("token-list"), newToken)

        # The user should end up with a token
        force_authenticate(request, user=self.user)
        response = view(request)
        assert response.status_code == 201

        user_token = FlaggedToken.objects.filter(user=self.user, write=True).first()
        assert response.data["key"] == str(user_token.key)

        # Check whether admin can see this token

        view = TokenViewSet.as_view({"get": "list"})

        request = factory.get(reverse("token-list"))

        # Admin, should see all three tokens now
        force_authenticate(request, user=self.admin)
        response = view(request)
        assert response.status_code == 200
        assert len(response.data) == len(FlaggedToken.objects.all())

        for token in response.data:
            assert token["key"] in [self.token.key, self.rtoken.key, user_token.key]

    def test_update_token(self):
        factory = APIRequestFactory()
        view = TokenViewSet.as_view({"put": "update"})

        newToken = {"write": False, "description": "An updated description"}

        request = factory.put(reverse("token-detail", kwargs={"pk": self.rtoken.key}), newToken)

        force_authenticate(request, user=self.user)
        response = view(request, pk=self.rtoken.key)
        assert response.status_code == 200

        # Get the updated object from the database
        db_token = FlaggedToken.objects.get(pk=self.rtoken.key)
        assert db_token.description == newToken["description"]

        # Show admin can update this token as well
        newToken["write"] = True
        request = factory.put(reverse("token-detail", kwargs={"pk": self.rtoken.key}), newToken)

        force_authenticate(request, user=self.admin)
        response = view(request, pk=self.rtoken.key)
        assert response.status_code == 200

        db_token = FlaggedToken.objects.get(pk=self.rtoken.key)
        assert db_token.write == newToken["write"]

    def test_delete_token(self):
        # First we let the user delete a token owned by admin
        factory = APIRequestFactory()
        view = TokenViewSet.as_view({"delete": "destroy"})

        request = factory.delete(reverse("token-detail", kwargs={"pk": self.token.key}))

        force_authenticate(request, user=self.user)
        response = view(request, pk=self.token.key)

        # The API pretends not to know this token
        assert response.status_code == 404
        assert FlaggedToken.objects.get(key=self.token.key)

        # Now we actually delete tokens

        for user, token in [(self.user, self.rtoken), (self.admin, self.token)]:
            request = factory.delete(reverse("token-detail", kwargs={"pk": self.token.key}))

            force_authenticate(request, user=user)
            response = view(request, pk=token.key)

            assert response.status_code == 204
            assert len(FlaggedToken.objects.filter(key=token.key)) == 0
