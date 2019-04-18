
def subnet(cidr):
    return cidr.cidr.version == 4 and cidr.cidr.prefixlen <= 31 or cidr.cidr.version == 6 and cidr.cidr.prefixlen <= 127