from ipaddress import IPv4Network, IPv6Network
from typing import Union

from .enums import IP


def subcidr(cidr: Union[IPv4Network, IPv6Network]) -> bool:
    return IP(cidr.version) == IP.v4 and cidr.prefixlen <= 31 or IP(cidr.version) == IP.v6 and cidr.prefixlen <= 127
