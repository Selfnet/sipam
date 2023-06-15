module.exports = {
  devServer: {
    port: 8181,
  },
  pages: {
    app: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      excludeChunks: ['oidc-renew'],
    },
    oidcrenew: {
      entry: 'src/oidcRenew.ts',
      template: 'public/oidc-renew.html',
      filename: 'oidc-renew.html',
      excludeChunks: ['app'],
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
  configureWebpack: {
    devtool: 'source-map',
  },
};
