from .enums import IP


def subcidr(cidr):
    return cidr.cidr.version == IP.v4 and cidr.cidr.prefixlen <= 31 or cidr.cidr.version == IP.v6 and cidr.cidr.prefixlen <= 127
