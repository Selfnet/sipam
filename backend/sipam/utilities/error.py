"""Custom Errors."""


class NotEnoughSpaceError(Exception):
    """The subnet has not enough space for a Subnet of the requested size."""



class NoSuchPrefixError(Exception):
    """The pool has no such IP prefix assigned."""

