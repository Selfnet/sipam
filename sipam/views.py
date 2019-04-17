from rest_framework import viewsets
from sipam.models import Prefix, Pool, IP
from rest_framework.response import Response
from sipam.serializers import PrefixSerializer, PoolSerializer, IPSerializer

