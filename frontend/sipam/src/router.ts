import Vue from 'vue';
import Router from 'vue-router';
import config from '@/config';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import store from '@/store/store';
import OidcCallback from '@/views/oidc/OidcCallback.vue';
import OidcCallbackError from '@/views/oidc/OidcCallbackError.vue';
import OidcCallbackPopup from '@/views/oidc/OidcCallbackPopup.vue';
import OidcLogin from '@/views/oidc/OidcLogin.vue';
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      alias: '/home',
      name: 'Home',
      component: Home,
      meta: {
        isPublic: true,
      },
    },
    {
      path: '/cidrs',
      name: 'CIDR',
      component: () => import(/* webpackChunkName: "cidrs" */ './views/CIDRs.vue'),
    },
    {
      path: '/pools',
      name: 'Pool',
      component: () => import(/* webpackChunkName: "pools" */ './views/Pools.vue'),
    },
    {
      path: '/oidc-callback', // Needs to match redirectUri in you oidcSettings
      name: 'oidcCallback',
      component: OidcCallback,
    },
    {
      path: '/oidc-callback-popup', // Needs to match popupRedirectUri in you oidcSettings
      name: 'oidcCallbackPopup',
      component: OidcCallbackPopup,
    },
    {
      path: '/oidc-callback-error', // Needs to match redirect_uri in you oidcSettings
      name: 'oidcCallbackError',
      component: OidcCallbackError,
      meta: {
        isPublic: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: config.oidc ? OidcLogin : Login,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
if (config.oidc) {
  router.beforeEach(vuexOidcCreateRouterMiddleware(store, 'AuthOIDC'));
} else {
  router.beforeEach((to, from, next) => {
    if (to.fullPath === '/login' || to.meta.isPublic) {
      next();
      return;
    }
    if (!store.getters['Auth/isAuthenticated']) {
      next('/login');
    } else {
      next();
    }
  });
}

export default router;
