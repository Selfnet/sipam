import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    query: '',
    search: {},
  },

  getters: {
    query: (state) => {
        return state.query
      }
  },

  mutations: {
    SET_QUERY(state, payload) {
      Vue.set(state, 'query', payload)
    },
  },

  actions: {
  },
}
