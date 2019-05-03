from enum import Enum

class FlagChoices(Enum):
    """Types of IP Assignments
    """
    RESERVATION = 'reservation'
    ASSIGNMENT = 'assignment'
    HOST = 'host'
