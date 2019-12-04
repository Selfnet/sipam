#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import datetime

import ldap3
from django.conf import settings
from django.contrib.auth.backends import ModelBackend
from ldap3.core.exceptions import LDAPInvalidCredentialsResult
from prometheus_client import Counter, Histogram

# from django.contrib.auth.models import Group
from .models import User


class SelfnetLDAPAuth(ModelBackend):

    """
    Klasse, welche die Authentifizierung der Siam-User übernimmt.
    Zur LDAP-Auth wird python3-ldap verwendet.
    """
    authentications_count = Counter('siam_accounts_ldap_auths_total', 'Total LDAP Auths', ['result'])
    authentication_time = Histogram('siam_accounts_ldap_auth_time_seconds', 'Time consumed for authentication')

    @authentication_time.time()
    def authenticate(self, request=None, username=None, password=None):  # pragma: no cover
        # case-insensitive usernames!
        username = username.lower()

        # ldap Verbindung aufbauen
        server = ldap3.Server(settings.LDAP_SERVER)
        dn = 'uid=' + username + ',' + settings.BASEDN_UID
        conn = ldap3.Connection(server, user=dn, password=password, authentication=ldap3.SIMPLE, raise_exceptions=True)
        try:
            conn.bind()
        except LDAPInvalidCredentialsResult:
            self.authentications_count.labels(result="invalid").inc()
            return None

        # get ldap attributes
        conn.search(settings.BASEDN_UID, '(uid=%s)' % username, attributes=['sn', 'givenName', 'mail', 'vnr'])
        attrdata = conn.response[0]['attributes']

        # check if a VNR is given from ldap
        if attrdata.get('vnr') is None:
            self.authentications_count.labels(result='no_vnr').inc()
            return None

        # get user
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = User(username=username)

        # attribute search
        user.email = attrdata['mail'][0]
        user.first_name = attrdata['givenName'][0]
        user.last_name = attrdata['sn'][0]
        user.last_login = datetime.datetime.now()
        user.save()

        # TODO: Set is_staff flag from magic ldap attribute
        # group search
        # groupnames = attrdata.get('sipam', [])
        # user.groups.set(Group.objects.get_or_create(name=groupname)[0] for groupname in groupnames)

        # close LDAP connection
        conn.unbind()

        self.authentications_count.labels(result='success').inc()

        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
