import Vue from 'vue';
import { SearchState } from '@/types/store.ts';

export default {
  namespaced: true,

  state: {
    query: '',
    search: {},
  } as SearchState,

  getters: {
    query: (state: SearchState) => state.query,
  },

  mutations: {
    SET_QUERY(state: SearchState, payload: string) {
      Vue.set(state, 'query', payload);
    },
  },

  actions: {
  },
};
