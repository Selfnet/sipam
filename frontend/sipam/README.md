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

### Create .env.development.local file

```.env
VUE_APP_OIDC_ISSUER_URL=${PATH_TO_TOKEN_ISSUER/auth/realms/realm-name}
VUE_APP_OIDC="true" # enables OIDC support
```
