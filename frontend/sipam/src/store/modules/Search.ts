import Vue from 'vue';
import { SearchState } from '@/types/store';

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
    SET_QUERY(state: SearchState, payload: String) {
      Vue.set(state, 'query', payload);
    },
  },

  actions: {
  },
};
