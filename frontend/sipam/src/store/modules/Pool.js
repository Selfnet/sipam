import Vue from 'vue';
import poolAPI from '@/services/api/Pool';

export default {
  namespaced: true,

  state: {
    pools: {},
  },

  getters: {
    pools: state => Object.keys(state.pools),
    poolList: state => Object.values(state.pools),
  },

  mutations: {
    SET_POOLS(state, payload) {
      payload.forEach((pool) => {
        Vue.set(state.pools, pool.id, pool);
      });
    },
    SET_POOL(state, payload) {
      Vue.set(state.pools, payload.id, payload);
    },
    DELETE_POOL(state, payload) {
      delete state.pools[payload];
    },
  },

  actions: {
    async FETCH_POOLS({ commit }) {
      const response = await poolAPI.getPools();
      if (response.status === 200) {
        commit('SET_POOLS', response.data);
      }
    },
    async UPDATE_POOL({ commit }, { poolID, formData }) {
      const response = await poolAPI.updatePool(poolID, formData);
      if (response.status === 200) {
        commit('SET_POOL', response.data);
      } else {
        console.log(response);
      }
    },
    async CREATE_POOL({ commit }, formData) {
      const response = await poolAPI.createPool(formData);
      if (response.status === 201) {
        commit('SET_POOL', response.data);
      } else {
        console.log(response);
      }
    },
    async DELETE_POOL({ commit }, poolID) {
      const response = await poolAPI.deletePool(poolID);
      if (response.status === 204) {
        commit('DELETE_POOL', poolID);
      } else {
        console.log(response);
      }
    },
  },
};
