import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import OidcCallback from '@/views/oidc/OidcCallback.vue';
import OidcCallbackError from '@/views/oidc/OidcCallbackError.vue';
import OidcCallbackPopup from '@/views/oidc/OidcCallbackPopup.vue';
import OidcLogin from '@/views/oidc/OidcLogin.vue';
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';
import { SIPAMConfiguration } from '@/types/config';
import { Store } from 'vuex';
import { RootState } from './types/store';


export default function routerFactory(config: SIPAMConfiguration, store: Store<RootState>) {
  Vue.use(Router);
  const router = new Router({
    base: `${config.appURL}`,
    mode: 'history',
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
        path: '/profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "cidrs" */ './views/Profile.vue'),
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
  return router;
}
