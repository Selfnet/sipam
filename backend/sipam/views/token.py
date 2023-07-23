from django.utils.decorators import method_decorator
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        responses={
            status.HTTP_200_OK: openapi.Schema(
                title="TokenPair",
                type="object",
                properties={
                    "refresh": openapi.Schema(title="Refresh token", type="string"),
                    "access": openapi.Schema(title="Access token", type="string"),
                },
                required=["access", "refresh"],
            )
        },
    ),
)
class SIPAMTokenView(TokenObtainPairView):
    pass


@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        responses={
            status.HTTP_200_OK: openapi.Schema(
                title="AccessToken",
                type="object",
                properties={"access": openapi.Schema(title="Access token", type="string")},
                required=["access"],
            )
        }
    ),
)
class SIPAMRefreshView(TokenRefreshView):
    pass


@method_decorator(
    name="post",
    decorator=swagger_auto_schema(
        responses={
            status.HTTP_200_OK: openapi.Schema(
                title="TokenVerification",
                type="object",
                properties={},
            )
        },
    ),
)
class SIPAMTokenVerifyView(TokenVerifyView):
    pass
