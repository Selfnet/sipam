from enum import Enum


class FlagChoices(str, Enum):
    """Types of IP Assignments
    """
    RESERVATION = 'reservation'
    ASSIGNMENT = 'assignment'
    HOST = 'host'


class CIDRType(str, Enum):
    """Types of CIDRs.
       IP and Prefix
    """
    CIDR = 'cidr'
    IP = 'ip'


class IP(int, Enum):
    """Types of IP-Addresses
    v4 and v6
    """
    v4 = 4
    v6 = 6


class PoolType(str, Enum):
    """Types of a Pool
    """
    HOST = 'Host Linknet'
    VM = 'VM Linknet'
    ARBITRARY = 'Arbitrary'
