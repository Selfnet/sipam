import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Cidrs from './views/CIDRs.vue';
import Pools from './views/Pools.vue';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/cidrs',
      name: 'CIDR',
      component: Cidrs,
    },
    {
      path: '/pools',
      name: 'Pool',
      component: Pools,
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
