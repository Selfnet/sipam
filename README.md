# SIPAM

[![pipeline status](https://git.selfnet.de/marcelf/sipam/badges/master/pipeline.svg)](https://git.selfnet.de/marcelf/sipam/commits/master)
[![coverage report](https://git.selfnet.de/marcelf/sipam/badges/master/coverage.svg)](https://git.selfnet.de/marcelf/sipam/commits/master)

## Developer Initialization

### Docker Postgres

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

### Manual Postgres

* Install `postgresql` on your local System
* Checkout the postgres user via and run the predefined commands

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
    * this is not the case in the manual setup.
1. Please note if you want the database and the management listen on localhost addresses you must
edit the `docker-compose.yml` file.

* This project uses [pipenv](https://github.com/pypa/pipenv) for dependency management.
  * Setup is as easy as running `pipenv install`
  * New packages can be added with `pipenv install <package>`
  * If the package is only required for development purposes use `pipenv install --dev <package>`
* create a file `sipam/secret.py` add the variable `PASSWORD="<password>` and `HOST="<hostname>"`
* If you have a local redis instance set the `REDIS_HOSTNAME` accordingly in `sipam/secret.py`. If you set it to `None` a dummy cache (aka. none) will be used.

### Initialize the project

```bash
pipenv shell
python manage.py migrate  # this triggers all migrations for django
python manage.py migrate sipam # this triggers all migrations for the database of sipam.
python manage.py runserver # runs the server
```

## Backend Development

### Base developer Dataset

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

### Read Fixture Data into dev server

This is an import of the existing nipap database.
The fixture can be found in a well-known place (just ask)

```bash
# exclude auth and contentypes view.
python manage.py loaddata -e auth -e contenttypes /tmp/nipap_import.json

```

### Testing

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

### IP Functions

- Postgres: https://www.postgresql.org/docs/11/functions-net.html
- Netfields: https://github.com/jimfunk/django-postgresql-netfields


## Frontend Development

Install `@vue/cli`
* Archlinux
  * yay -S vue-cli
* Others
  * npm install --global @vue/cli

### Running

For local development `npm run serve` and the development Django server are sufficient.
To make life easier it is recommended to generate a superuser account for login.
This can be achieved.

```shell
# Activate the virtual-env shell
pipenv shell
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
