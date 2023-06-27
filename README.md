# SIPAM

[![pipeline status](https://git.selfnet.de/marcelf/sipam/badges/master/pipeline.svg)](https://git.selfnet.de/marcelf/sipam/commits/master)
[![coverage report](https://git.selfnet.de/marcelf/sipam/badges/master/coverage.svg)](https://git.selfnet.de/marcelf/sipam/commits/master)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Selfnet_sipam&metric=ncloc)](https://sonarcloud.io/dashboard?id=Selfnet_sipam)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Selfnet_sipam&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=Selfnet_sipam)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Selfnet_sipam&metric=alert_status)](https://sonarcloud.io/dashboard?id=Selfnet_sipam)

## Getting Started

> This project utilizes **poetry**, **podman**, **docker-compose**, and **just** for managing scripts, containers, and dependencies.

1. Install `podman`, `docker-compose`, and `just`
2. Create a `.env` at least with the following content:

    ```.env
    DATABASE_HOST=sipam
    DATABASE_NAME=sipam
    SIPAM_DATABASE_USER_NAME=sipam
    SIPAM_DATABASE_USER_PASSWORD=<password>
    ```

3. Run `just up -d` (this will initially build the containers and start them)
4. After the containers are up and running, run `just init-setup` (this will initialize the database and create a superuser)
    - You will be ask to create a superuser. This is the user you will use to login to the web interface of django.

To see what commands are available, run just `just`. This will list all available commands including a short description.

### Advanced

> Note: Depending on your `container.dev-override.yml` you may need to define more environment variables in your `.env` file.

If you want a UI for the database you can use `pgadmin`. This gives you full access to the database. Follow the steps below to get it running.

1. If the container are already running, stop them with `just down`
2. Add the following to your `container.dev-override.yml`:

    ```yaml
    services:
        pgadmin:
        image: dpage/pgadmin4:7
        environment:
            PGADMIN_DEFAULT_EMAIL: ${PGADMIN_DEFAULT_EMAIL:?err}
            PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_DEFAULT_PASSWORD:?err}
        ports:
            - ${PGADMIN_PORT:-5050}:80
        restart: unless-stopped
        depends_on:
            - postgres
    ```

3. Run `just up -d` (this will initially build the containers and start them)

This is only an example of how you can customize the compose file. This file also allows to override the default values of the `compose.dev.yml` file.

## Deprecated

### Manual Postgres

- Install `postgresql` on your local System
- Checkout the postgres user via and run the predefined commands

```bash
sudo -iu postgres
initdb -D /var/lib/postgres/data  # you can edit this path as you like (only arch)
exit
systemctl start postgresql
systemctl enable postgresql # this is optional if you want to start it on boot.
sudo -iu postgres
createuser --interactive  # <sipam> say no to everything it will be a dump database user.
psql
ALTER USER sipam CREATEDB; # For pytest
exit
createdb sipam -O sipam # first is database name second is username

psql
\password sipam  # set the password from secret.py their two times
GRANT ALL PRIVILEGES ON DATABASE sipam TO sipam;
\q
exit
```

1. The Database `sipam` is reachable with the user `sipam` and the `POSTGRES_PASSWORD`.
1. The Webinterface for the database management is reachable under `:::5050`.
    - this is not the case in the manual setup.
1. Please note if you want the database and the management listen on localhost addresses you must
   edit the `docker-compose.yml` file.

- This project uses [poetry](https://python-poetry.org/) for dependency management.
  - Setup is as easy as running `poetry install`
  - New packages can be added with `poetry add <package>`
  - If the package is only required for development purposes use `poetry add --dev <package>`
- create a file `sipam/secret.py` add the variable `PASSWORD="<password>` and `HOST="<hostname>"`
- If you have a local redis instance set the `REDIS_HOSTNAME` accordingly in `sipam/secret.py`. If you set it to `None` a dummy cache (aka. none) will be used.

### Initialize the project

```bash
poetry shell
python manage.py migrate  # this triggers all migrations for django
python manage.py migrate sipam # this triggers all migrations for the database of sipam.
python manage.py runserver # runs the server
```

### Backend Development

#### Base developer Dataset

Create some Base Datase for the database `sipam`. `sipam.pgsql` can be imported for this purpose.

```bash
sudo cp ./sipam.pgsql /var/lib/postgres/data/sipam.pgsql # Ensure this is the right directory on your system
sudo -iu postgres
cd data
psql -U sipam sipam < sipam.pgsql

# Flush the database
./manage.py sqlflush | ./manage.py dbshell
```

Now the database should be filled with some sample data.

#### Read Fixture Data into dev server

This is an import of the existing nipap database.
The fixture can be found in a well-known place (just ask)

```bash
# exclude auth and contentypes view.
python manage.py loaddata -e auth -e contenttypes /tmp/nipap_import.json

```

#### Testing

Make sure you have a user with createdb privileges (pytest will automatically setup a test database and delete it afterwards).

Tests can be run with `pytest -s` (`-s` will not eat print statements).

The actual testcases are in each app in the `tests` subfolder.
Pytests autodetection will find new ones.

When interested in getting coverage data run

```bash
coverage run --source './'  -m pytest
coverage report -m
```

Happy testing.

#### IP Functions

- Postgres: <https://www.postgresql.org/docs/11/functions-net.html>
- Netfields: <https://github.com/jimfunk/django-postgresql-netfields>

### Frontend Development

Install `@vue/cli`

- Archlinux
  - yay -S vue-cli
- Others
  - npm install --global @vue/cli

#### Running

For local development `yarn serve` and the development Django server are sufficient.
To make life easier it is recommended to generate a superuser account for login.
This can be achieved.

```shell
# Activate the virtual-env shell
poetry shell
# Create a local superuser
python manage.py createsuperuser
$ Username: sipam_dev
$ Email address: sipam_dev@example.com
$ Password:
$ Password (again):
$ Superuser created successfully.
```

This user can be used for local development.
You can now login with this user from the Frontend or the Backend.
