"""sipam URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from accounts.urls import router as auth_router
# from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_nested import routers
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from sipam import views


schema_view = get_schema_view(
    openapi.Info(
        title="SIPAM API",
        default_version='v1',
        description="Selfnet e.V. IP Address Management API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="support@selfnet.de"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


router = routers.DefaultRouter()
router.register(r'cidr', views.CIDRViewSet, basename='cidr')
router.register(r'pool', views.PoolViewSet)

cidr_router = routers.NestedSimpleRouter(router, r'cidr', lookup='cidr')
cidr_router.register(r'labels', views.LabelViewSet, basename='cidr-labels')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    # API
    path('api/v1/', include(router.urls)),
    path('api/v1/', include(cidr_router.urls)),
    path('api/v1/', include(auth_router.urls)),
    # Authentication
    path('api/v1/jwt/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    # Only Documentation
    re_path(
        r'^swagger(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0),
        name='schema-json'),
    re_path(
        r'^swagger/$',
        schema_view.with_ui(
            'swagger',
            cache_timeout=0),
        name='schema-swagger-ui'),
    re_path(
        r'^redoc/$',
        schema_view.with_ui(
            'redoc',
            cache_timeout=0),
        name='schema-redoc'),
    re_path('', include('django_prometheus.urls')),

]

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]

# from django.urls import include, path
