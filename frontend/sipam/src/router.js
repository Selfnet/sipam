import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import store from './store/store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
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
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '*',
      redirect: '/login',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/login') {
    next();
    return;
  }
  if (!store.getters['Auth/loggedIn']) next('/login');
  else next();
});

export default router;
