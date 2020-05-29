#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.exceptions import AuthenticationFailed
from typing import List, Union


def oidc_backend(request, token: dict):
    def append_groups(user, groups: Union[List[str], None]):
        if groups is not None:
            user.groups.set(
                Group.objects.get_or_create(name=group)
                for group in groups
            )
        return user

    def create(token: dict):
        try:
            User = get_user_model()
            user = User()
            user.id = token['sub']
            user.email = token['email']
            user.first_name = token['given_name']
            user.last_name = token['family_name']
            user.username = token['preferred_username']
            user.save()
        except KeyError:
            raise AuthenticationFailed("You are not authorized to login.")
        return user

    def authenticate(request, token: dict):
        User = get_user_model()
        try:
            user = User.objects.get(id=token.get('sub'))
        except User.DoesNotExist:
            user = create(token)

        user.last_login = datetime.datetime.now()
        user.save()
        user = append_groups(
            user, token.get(
                settings.OIDC_GROUPS_CLAIM
            )
        )

        return user

    return authenticate(request, token)
