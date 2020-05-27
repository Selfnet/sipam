#!/bin/bash

HOSTNAME=sap.selfnet.de
REALM_NAME=master
USERNAME=$1
CLIENT_ID=sipam-dev


KEYCLOAK_URL=https://$HOSTNAME/auth/realms/$REALM_NAME/protocol/openid-connect/token

echo "Using Keycloak: $KEYCLOAK_URL"
echo "realm:          $REALM_NAME"
echo "client-id:      $CLIENT_ID"
echo "username:       $USERNAME"



echo -n Password: 
read -s PASSWORD


TOKEN=$(curl -L -X POST "$KEYCLOAK_URL" \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode "client_id=$CLIENT_ID" \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid' \
--data-urlencode "username=$USERNAME" \
--data-urlencode "password=$PASSWORD" | jq -r '.access_token')

curl -H "Authorization: OpenID $TOKEN" http://localhost:8000/api/v1/cidr/