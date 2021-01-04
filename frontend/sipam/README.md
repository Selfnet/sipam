# sipam

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Generate the API Stubs

Before you need to install the dev packages and npx.

```console
$ npx swagger-typescript-api -p http://localhost:8000/swagger.json -o ./src/types -n api.ts  -r --union-enums
> ✨ try to get swagger by url "http://localhost:8000/swagger.json"
> ✨ try to read templates from directory "./sipam/frontend/sipam/node_modules/swagger-typescript-api/src/templates/defaults"
> ☄️  start generating your typescript api
> ✔️  your typescript api file created in "./sipam/frontend/sipam/src/types"
```

### Create `public/config.json` file

```json
{
  "API_URL": "http://localhost:8000/api/v1",
  "APP_URL": "http://localhost:8181",
  "DEBUG": true,
  "OIDC": {
    "enabled": true,
    "client_id": "sipam-dev",
    "issuer_url": "https://example.com/auth/realms/master/"
  }
}

```
