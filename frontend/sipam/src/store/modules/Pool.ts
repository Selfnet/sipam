import Vue from 'vue';
import poolAPI from '@/services/api/Pool';
import { PoolState } from '@/types/store';
import { Pool } from '@/types/api';

export default {
  namespaced: true,

  state: {
    pools: {},
  },

  getters: {
    poolList: (state: PoolState) => Object.values(state.pools),
  },

  mutations: {
    SET_POOLS(state: PoolState, pools: Pool[]) {
      pools.forEach((pool) => {
        Vue.set(state.pools, pool.id, pool);
      });
    },
    SET_POOL(state: PoolState, pool: Pool) {
      Vue.set(state.pools, pool.id, pool);
    },
    DELETE_POOL(state: PoolState, id: string) {
      Vue.delete(state.pools, id);
    },
  },

  actions: {
    async FETCH_POOLS(context: { commit: any }) {
      const response = await poolAPI.getPools();
      if (response.status === 200) {
        context.commit('SET_POOLS', response.data);
        response.data.forEach((pool) => {
          context.commit('CIDR/SET_CIDRS', pool.prefixes, { root: true });
        });
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
    async ASSIGN({ commit }, { poolID, assignmentData }) {
      const response = await poolAPI.assign(poolID, assignmentData);
      if (response.status === 201) {
        commit('CIDR/SET_CIDRS', response.data, { root: true });
      } else {
        console.log(response);
      }
    },
  },
};
