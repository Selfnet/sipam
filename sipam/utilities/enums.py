from enum import Enum


class Invoke(Enum):
    CHILDREN = 'children'
    PARENTS = 'parents'


class HostType(str, Enum):
    """Types of host to differentiate in a pool
    """
    PHYSICAL = 'physical'
    VIRTUAL = 'virtual'

class FlagChoices(str, Enum):
    """Types of IP Assignments
    """
    RESERVATION = 'reservation'
    ASSIGNMENT = 'assignment'
    HOST = 'host'