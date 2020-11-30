import Vue from 'vue';
import axios from 'axios';
import authAPI from '@/services/api/Auth';
import { AuthState, BasicToken } from '@/types/store';
import GenericAuth from './GenericAuth';

const HEADER_PREFIX = 'Bearer';

export default {
  namespaced: true,
  prefix: HEADER_PREFIX,
  state: {
    token: GenericAuth.emptyState.token,
    loggedIn: GenericAuth.emptyState.loggedIn,
    username: GenericAuth.emptyState.username,
    authHeader: GenericAuth.emptyState.authHeader,
  } as AuthState,

  getters: {
    header: (state: AuthState) => state.authHeader,
    token: (state: AuthState) => state.token,
    loggedIn: (state: AuthState) => state.loggedIn,
  },

  mutations: {
    UPDATE_LOGGED_IN(state: AuthState, loggedIn: boolean) {
      Vue.set(state, 'loggedIn', loggedIn);
      if (!state.loggedIn) {
        this.DELETE_TOKEN(state);
      }
    },
    SAVE_USERNAME(state: AuthState, username: String) {
      Vue.set(state, 'username', username);
    },
    SAVE_TOKEN(state: AuthState, newToken: BasicToken) {
      Vue.set(state, 'token', Object.assign({}, state.token, newToken));
      Vue.set(state, 'authHeader', `${HEADER_PREFIX} ${state.token.access}`);
      Vue.set(axios.defaults.headers, 'Authorization', state.authHeader);
      Vue.set(state, 'loggedIn', true);
    },
    DELETE_TOKEN(state: AuthState) {
      Vue.set(state, 'token', GenericAuth.emptyState.token);
      Vue.set(state, 'loggedIn', GenericAuth.emptyState.loggedIn);
      Vue.set(state, 'username', GenericAuth.emptyState.username);
      Vue.set(state, 'authHeader', GenericAuth.emptyState.authHeader);
      Vue.set(axios.defaults.headers, 'Authorization', state.authHeader);
    },
  },

  actions: {
    async POST_LOGIN(context: { commit: any }, payload: { username: string, password: string }) {
      const response = await authAPI.login(payload.username, payload.password);
      if (response.status === 200) {
        const verify = await authAPI.verifyAccess(response.data);
        if (verify && verify.status === 200) {
          context.commit('SAVE_USERNAME', payload.username);
          context.commit('SAVE_TOKEN', response.data);
        }
      } else {
        console.log('Cannot Login.');
      }
    },
    async LOGOUT(context: { commit: any }) {
      context.commit('DELETE_TOKEN');
    },
    async VERIFY_ACCESS(context: { commit: any }, payload: { token: BasicToken }) {
      const response = await authAPI.verifyAccess(payload.token);
      if (response && response.status === 200) {
        context.commit('UPDATE_LOGGED_IN', true);
      } else if (response && response.status === 401) {
        context.commit('UPDATE_LOGGED_IN', false);
      } else {
        console.log(response);
      }
    },
    async REFRESH(context: { commit: any }, payload: { token: BasicToken, callback: any }) {
      const response = await authAPI.refresh(payload.token);

      // No refresh token - handle this case first
      if (typeof response === 'undefined') {
        context.commit('UPDATE_LOGGED_IN', false);
      } else if (response.status === 200) {
        context.commit('SAVE_TOKEN', response.data);
        context.commit('UPDATE_LOGGED_IN', true);
      } else if (response.status === 401) {
        console.log('Refresh unauthorized');
        context.commit('UPDATE_LOGGED_IN', false);
      } else {
        console.log(response);
      }
      return payload.callback;
    },
  },
};
