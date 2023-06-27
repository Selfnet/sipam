# SIPAM

[![pipeline status](https://git.selfnet.de/marcelf/sipam/badges/master/pipeline.svg)](https://git.selfnet.de/marcelf/sipam/commits/master)
[![coverage report](https://git.selfnet.de/marcelf/sipam/badges/master/coverage.svg)](https://git.selfnet.de/marcelf/sipam/commits/master)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Selfnet_sipam&metric=ncloc)](https://sonarcloud.io/dashboard?id=Selfnet_sipam)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Selfnet_sipam&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=Selfnet_sipam)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Selfnet_sipam&metric=alert_status)](https://sonarcloud.io/dashboard?id=Selfnet_sipam)

## Getting Started

> This project utilizes **[poetry](https://python-poetry.org/)**, **[podman](https://podman.io/)**, **[docker-compose](https://github.com/docker/compose)**, and **[just](https://github.com/casey/just)** for managing scripts, containers, and dependencies.

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
    - This step will also fill the database with some sample data. If you need more data **just ask**.

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

## Other

**IP Functions:**

- Postgres: <https://www.postgresql.org/docs/11/functions-net.html>
- Netfields: <https://github.com/jimfunk/django-postgresql-netfields>

## Deprecated

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

- This project uses [poetry](https://python-poetry.org/) for dependency management.
  - Setup is as easy as running `poetry install`
  - New packages can be added with `poetry add <package>`
  - If the package is only required for development purposes use `poetry add --dev <package>`
- create a file `sipam/secret.py` add the variable `PASSWORD="<password>` and `HOST="<hostname>"`
- If you have a local redis instance set the `REDIS_HOSTNAME` accordingly in `sipam/secret.py`. If you set it to `None` a dummy cache (aka. none) will be used.

### Running

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
