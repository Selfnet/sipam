from .enums import IP
from typing import Union
from ipaddress import IPv4Network, IPv6Network


def subcidr(cidr: Union[IPv4Network, IPv6Network]) -> bool:
    return IP(cidr.version) == IP.v4 and cidr.prefixlen <= 31 or IP(cidr.version) == IP.v6 and cidr.prefixlen <= 127
