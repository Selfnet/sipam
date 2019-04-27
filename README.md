# SIPAM

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
initdb -D /var/lib/postgres/data  # you can edit this path as you like
exit
systemctl start postgresql
systemctl enable postgresql # this is optional if you want to start it on boot.
sudo -iu postgres
createuser --interactive  # <sipam> say no to everything it will be a dump database user.
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

* create a `virtualenv` under `./env` in the project or under another location (if this differs from `./env` do not forget to add it to `.gitignore`).
  * `virtualenv --system-site-packages env`
  * `source env/bin/activate`
* Install all requirements with
  * `pip install -r requirements.txt`
* create a file `sipam/secret.py` add the variable `PASSWORD="<password>` and `HOST="<hostname>"`

### Initialize the project

```bash
source env/bin/activate
python manage.py migrate  # this triggers all migrations for django
python manage.py migrate sipam # this triggers all migrations for the database of sipam.
python manage.py runserver # runs the server
```

### Add a base developer Database.


Create some Base samples for a database `sipam.pgsql` can be imported for this purpose.
```bash
sudo cp ./sipam.pgsql /var/lib/postgres/data/sipam.pgsql # Ensure this is the right directory on your system
sudo -iu postgres
cd data
psql -U sipam sipam < sipam.pgsql
```

Now the database should be filled with some sample data.