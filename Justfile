set dotenv-load

export DOCKER_HOST := "unix://" + env_var("XDG_RUNTIME_DIR") + "/podman/podman.sock"
db_data_dir := env_var_or_default('DATA_DIR', './data') + "/db"

# use override file if it exists
compose_override_file := "compose.dev-override.yml"
compose_override_flag := if path_exists(compose_override_file) == "true" { "-f " + compose_override_file } else { "" }

# construct base compose command
compose_cli := env_var_or_default('COMPOSE_CLI', 'docker-compose')
compose := compose_cli + " -f compose.dev.yml " + " " + compose_override_flag
run := compose + " run --rm"

# alias for just targets
alias f := frontend
alias b := backend
alias s := shell

# print a list of available commands
@help:
    just --list

# create postgres database directory
@_db_data_dir:
    mkdir -p {{ db_data_dir }}

# check .env file exists
@_check_dotenv_file:
    if [ ! -f ".env" ]; then echo "Config file '.env' does not exist"; exit 1; fi

# pass all arguments to docker-compose
@compose *ARGS: _check_dotenv_file _db_data_dir
    {{ compose }} {{ ARGS }}

# open shell in a running container
@shell CONTAINER:
    just compose exec {{ CONTAINER }} sh -c 'for s in bash dash ash sh; do if command -v $s; then $s; break; fi; done'

# open psql shell in the postgres container
@psql:
    just compose exec db sh -c 'psql $$POSTGRES_USER $$POSTGRES_DB'

# create django database migrations
@makemigrations:
    {{ run }} backend makemigrations

# run mising database migrations
@migrate:
    {{ run }} backend migrate

# load test fixtures in django for development
@loaddata:
    {{ run }} backend loaddata sample_pool_nets.json

# create a django superuser
@createsuperuser:
    {{ run }} backend createsuperuser

# prepare the database for development (migrate, loaddata, createsuperuser)
@init-setup: migrate loaddata createsuperuser

# show the live logs (of a specified container)
@logs CONTAINER="":
    just compose logs -f {{ CONTAINER }}

# run a django manage.py command
@manage *COMMAND:
    {{ run }} backend {{ COMMAND }}

# expose frontend scripts
@frontend *ARGS:
    {{ run }} --entrypoint "npm run" frontend {{ ARGS }}

# expose backend scripts
@backend *ARGS:
    {{ run }} --entrypoint "poetry run poe" backend {{ ARGS }}

# docker-compose up [*flags]
@up *FLAGS:
    just compose up {{ FLAGS }}

# docker-compose down [*flags]
@down *FLAGS:
    just compose down {{ FLAGS }}

# docker-compose build [*flags]
@build *FLAGS:
    just compose build {{ FLAGS }}

# docker-compose ps [*flags]
@ps *FLAGS:
    just compose ps {{ FLAGS }}
