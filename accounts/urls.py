#!/usr/bin/env python
#  -*- coding: UTF-8 -*-
from django.urls import include, path
from rest_framework_nested import routers

from accounts import views

router = routers.DefaultRouter()
router.register(r'token', views.TokenViewSet, basename='token')

app_name = 'accounts'
urlpatterns = [
    path('token/', include(router.urls)),
]
