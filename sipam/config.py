
import enum

import environ


class Env(enum.Enum):
    PROD = "prod"
    DEV = "dev"


def list_converter(value: str) -> list:
    if "" == value:
        return []
    return value.split(',')


@environ.config
class User:
    name = environ.var(
        converter=str,
        default='sipam',
        help="The Username to use."
    )
    password = environ.var(
        default='sipam',
        converter=str,
        help="The Password for the user to use.",
    )


@environ.config(prefix="SIPAM")
class SIPAMConfig:
    port = environ.var(
        converter=int,
        default=8000,
        help="the port the APP listens on."
    )
    env = environ.var(
        converter=Env,
        default=Env.PROD,
        help="The environment the APP runs in."
    )
    secret_key = environ.var(
        default='#ar^t6d7k&nnvi7$&8g#9plu^6c)9qzg%-k+dtjrcxu7d(z6*_',
        converter=str,
        help=("The Secret Key of the Django Application. (Default is development Key,"
              " https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/")
    )
    debug = environ.bool_var(
        default=True,
        help="This enables the development mode."
    )
    fqdn = environ.var(
        default="sipam",
        converter=str,
        help="Adding the Allowed host from outside."
    )
    log_level = environ.var(
        default='INFO',
        converter=str,
        help="Log Level of the application."
    )

    @environ.config
    class OIDC:
        endpoint = environ.var(
            default="https://samples.auth0.com/",
            converter=str,
            help="This defines the endpoint of the OIDC provider"
        )
        client_id = environ.var(
            default='sipam',
            converter=str,
            help="This defines the allowed azp definition == client_id in keycloak."
        )
        allowed_groups = environ.var(
            default='',
            converter=list_converter,
            help="This defines allowed values in the groups_claim"
        )
        groups_claim = environ.var(
            default='aks',
            converter=str,
            help="This defines the key for the claim to use for groups."
        )
        bearer_auth_header_prefix = environ.var(
            default='OPENID',
            converter=str,
            help="This defines the Authorization Header prefix to look for when using OIDC."
        )

    @environ.config
    class Database:
        host = environ.var(
            default='postgres',
            converter=str,
            help="The RDBMS Hostname to use to connect to."
        )
        port = environ.var(
            default=5432,
            converter=int,
            help="The RDBMS Port to use to connect to."
        )
        name = environ.var(
            default='sipam',
            converter=str,
            help="The Name of the RDBMS Database to use to connect to."
        )
        user = environ.group(User)

    oidc = environ.group(OIDC)
    database = environ.group(Database)
