"""Custom Errors."""


class NotEnoughSpace(Exception):
    """The subnet has not enough space for a Subnet of the requested size."""



class NoSuchPrefix(Exception):
    """The pool has no such IP prefix assigned."""

