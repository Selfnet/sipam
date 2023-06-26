set dotenv-load := true

export DOCKER_HOST := "unix://" + env_var("XDG_RUNTIME_DIR") + "/podman/podman.sock"

# use override file if it exists

compose_override_file := "compose.dev-override.yml"
compose_override_flag := if path_exists(compose_override_file) == "true" { "-f " + compose_override_file } else { "" }

# construct base compose command

compose_cli := env_var_or_default('COMPOSE_CLI', 'docker-compose')
compose := compose_cli + " -f compose.dev.yml " + " " + compose_override_flag
run := compose + " run --rm"
postgres_data_dir := "data/db"

# print a list of available commands
@help:
    just --list

# create postgres database directory
@_postgres_data_dir:
    mkdir -p {{ postgres_data_dir }}

# check .env file exists
@_check_dotenv_file:
    if [ ! -f ".env" ]; then echo "Config file '.env' does not exist"; exit 1; fi

# open shell in a running container
@shell CONTAINER:
    {{ compose }} exec {{ CONTAINER }} bash 2>/dev/null || \
    {{ compose }} exec {{ CONTAINER }} ash 2>/dev/null || \
    {{ compose }} exec {{ CONTAINER }} sh 2>/dev/null || \
    echo "Error: Cannot open shell for service {{ CONTAINER }}"

# open psql shell in the postgres container
@psql:
    {{ compose }} exec db sh -c 'psql $$POSTGRES_USER $$POSTGRES_DB'

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
    {{ compose }} logs -f {{ CONTAINER }}

# run a django manage.py command
@manage *COMMAND:
    {{ run }} backend {{ COMMAND }}

# run the linter locally
@lint:
    {{ run }} --entrypoint flake8 backend

# expose frontend scripts
@frontend *ARGS:
    {{ run }} --entrypoint "npm run" frontend {{ ARGS }}

# pass all arguments to docker-compose
@compose *ARGS: _check_dotenv_file _postgres_data_dir
    {{ compose }} {{ ARGS }}

# docker-compose up [*flags]
@up *ARGS:
    just compose up {{ ARGS }}

# docker-compose down [*flags]
@down *ARGS:
    just compose down {{ ARGS }}

# docker-compose build [*flags]
@build *ARGS:
    just compose build {{ ARGS }}

# docker-compose ps [*flags]
@ps *ARGS:
    just compose ps {{ ARGS }}
