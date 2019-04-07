# SIPAM

## Developer Initialization

* Install `docker`, `docker-compose` on a VM, PC, of your choice for the database Setup.
* Create a `.env` file in the project directory with the following stuff inside.

```.env
POSTGRES_PASSWORD=<password>
POSTGRES_USER=sipam
PGADMIN_DEFAULT_EMAIL=sipam@selfnet.de
PGADMIN_DEFAULT_PASSWORD=<password>
PGADMIN_PORT=5050
```

```sh
docker-compose up -d # this starts both container for development
```

1. The Database `sipam` is reachable with the user `sipam` and the `POSTGRES_PASSWORD`.
1. The Webinterface for the database management is reachable under `:::5050`.
1. Please note if you want the database and the management listen on localhost addresses you must
edit the `docker-compose.yml` file.

* create a `virtualenv` under `./env` in the project or under an other location.