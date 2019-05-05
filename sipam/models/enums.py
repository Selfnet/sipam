from enum import Enum

class FlagChoices(str, Enum):
    """Types of IP Assignments
    """
    RESERVATION = 'reservation'
    ASSIGNMENT = 'assignment'
    HOST = 'host'
