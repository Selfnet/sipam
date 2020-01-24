import axios from 'axios';
import authAPI from '@/services/api/Auth';

export default {
  namespaced: true,

  state: {
    token: {},
    username: 'User',
    loggedIn: false,
  },

  getters: {
    token: state => state.token,
    loggedIn: state => state.loggedIn,
  },

  mutations: {
    UPDATE_LOGGED_IN(state, payload) {
      state.loggedIn = payload;
      if (!payload) {
        state.username = 'User';
      }
    },
    SAVE_USERNAME(state, payload) {
      state.username = payload;
    },
    SAVE_TOKEN(state, payload) {
      state.token = payload;
      axios.defaults.headers.Authorization = `Bearer ${state.token.access}`;
      state.loggedIn = true;
    },
    DELETE_TOKEN(state) {
      state.token = {};
      state.loggedIn = false;
      state.username = 'User';
      axios.defaults.headers.Authorization = undefined;
    },
  },

  actions: {
    async POST_LOGIN({ commit }, { username, password }) {
      const response = await authAPI.login(username, password);
      if (response.status === 200) {
        const verify = await authAPI.verifyAccess(response.data);
        if (verify.status === 200) {
          commit('SAVE_USERNAME', username);
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
    async REFRESH({ commit }, { token, callback }) {
      const response = await authAPI.refresh(token);

      // No refresh token - handle this case first
      if (typeof response === 'undefined') {
        commit('UPDATE_LOGGED_IN', false);
      } else if (response.status === 200) {
        commit('SAVE_TOKEN', response.data);
        commit('UPDATE_LOGGED_IN', true);
      } else if (response.status === 401) {
        commit('UPDATE_LOGGED_IN', false);
      } else {
        console.log(response);
      }
      return callback;
    },
  },
};
