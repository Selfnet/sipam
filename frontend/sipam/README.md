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

### Create .env.development.local file

```.env
VUE_APP_OIDC_ISSUER_URL=${PATH_TO_TOKEN_ISSUER/auth/realms/realm-name}
VUE_APP_OIDC="true" # enables OIDC support
```
