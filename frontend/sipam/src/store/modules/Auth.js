import axios from 'axios';
import authAPI from '@/services/api/Auth';

export default {
  namespaced: true,

  state: {
    token: {},
    loggedIn: false,
  },

  getters: {
    token: state => state.token,
    loggedIn: state => state.loggedIn,
  },

  mutations: {
    UPDATE_LOGGED_IN(state, payload) {
      state.loggedIn = payload;
    },
    SAVE_TOKEN(state, payload) {
      state.token = payload;
      axios.defaults.headers.Authorization = `Bearer ${state.token.access}`;
      state.loggedIn = true;
    },
    DELETE_TOKEN(state) {
      state.token = {};
      state.loggedIn = false;
      axios.defaults.headers.Authorization = undefined;
    },
  },

  actions: {
    async POST_LOGIN({ commit }, { username, password }) {
      const response = await authAPI.login(username, password);
      if (response.status === 200) {
        const verify = await authAPI.verifyAccess(response.data);
        if (verify.status === 200) {
          commit('SAVE_TOKEN', response.data);
        }
      } else {
        console.log('Cannot Login.');
      }
    },
    async LOGOUT({ commit }) {
      commit('DELETE_TOKEN');
    },
    async VERIFY_ACCESS({ commit }, { token }) {
      const response = await authAPI.verifyAccess(token);
      if (response.status === 200) {
        commit('UPDATE_LOGGED_IN', true);
      } else if (response.status === 401) {
        commit('UPDATE_LOGGED_IN', false);
      } else {
        console.log(response);
      }
    },
    async REFRESH({ commit }, { token }) {
      const response = await authAPI.refresh(token);
      if (response.status === 200) {
        commit('SAVE_TOKEN', response.data);
      } else if (response.status === 401) {
        commit('UPDATE_LOGGED_IN', false);
      } else {
        console.log(response);
      }
    },
  },
};
