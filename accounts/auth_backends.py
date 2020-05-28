#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed


class OIDCBackend(object):

    @staticmethod
    def append_groups(user, groups):
        # TODO: Set is_staff flag from magic ldap attribute
        # group search
        # groupnames = attrdata.get('sipam', [])
        # user.groups.set(Group.objects.get_or_create(name=groupname)[0] for groupname in groupnames)
        pass

    @staticmethod
    def create(token):
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

    @staticmethod
    def authenticate(request, token):
        User = get_user_model()
        try:
            user = User.objects.get(id=token.get('sub'))
        except User.DoesNotExist:
            user = OIDCBackend.create(token)

        user.last_login = datetime.datetime.now()
        user.save()

        return user
