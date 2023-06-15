import Vue from 'vue';
import SIPAM from '@/sipam';
import { AuthState, BasicToken, RootState } from '@/types/store';
import { TokenObtainPair, TokenRefresh, TokenVerify } from '@/types/api';
import GenericAuth from './GenericAuth';

export default {
  namespaced: true,
  state: {
    token: GenericAuth.emptyState.token,
    loggedIn: GenericAuth.emptyState.loggedIn,
    username: GenericAuth.emptyState.username,
  } as AuthState,

  getters: {
    oidcToken: (state: AuthState) => state.token.access,
    token: (state: AuthState) => state.token,
    isAuthenticated: (state: AuthState) => state.loggedIn,
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
      Vue.set(state, 'loggedIn', true);
    },
    DELETE_TOKEN(state: AuthState) {
      Vue.set(state, 'token', GenericAuth.emptyState.token);
      Vue.set(state, 'loggedIn', GenericAuth.emptyState.loggedIn);
      Vue.set(state, 'username', GenericAuth.emptyState.username);
    },
  },
  actions: {
    async POST_LOGIN(
      context: { commit: any; rootState: RootState },
      payload: { username: string; password: string },
    ) {
      const tokenObtainPair = {
        username: payload.username,
        password: payload.password,
      } as TokenObtainPair;
      const response = await context.rootState.api.jwt.jwtCreate(tokenObtainPair);
      const token = response.data as BasicToken;
      const tokenVerify = {
        token: token.access,
      } as TokenVerify;
      const verifyResponse = await context.rootState.api.jwt.jwtVerifyCreate(tokenVerify);
      if (verifyResponse.data) {
        context.rootState.api.setSecurityData(token.access);
        context.commit('SAVE_USERNAME', payload.username);
        context.commit('SAVE_TOKEN', token);
      } else {
        console.log('Cannot Verify Token.');
      }
    },
    async LOGOUT(context: { commit: any; rootState: RootState }) {
      context.commit('DELETE_TOKEN');
    },
    async VERIFY_ACCESS(
      context: { commit: any; rootState: RootState },
      payload: { token: BasicToken },
    ) {
      const verify = await context.rootState.api.jwt.jwtVerifyCreate({
        token: payload.token.access,
      } as TokenVerify);
      if (verify.data) {
        context.commit('UPDATE_LOGGED_IN', true);
      } else {
        context.commit('UPDATE_LOGGED_IN', false);
      }
      console.log(verify);
    },
  },
  async REFRESH(
    context: { commit: any; rootState: RootState },
    payload: { token: BasicToken; callback: any },
  ) {
    const response = await context.rootState.api.jwt.jwtRefreshCreate({
      refresh: payload.token.refresh,
    } as TokenRefresh);
    if (response && response.data) {
      context.rootState.api.setSecurityData(response.data.access);
      context.commit('SAVE_TOKEN', response.data);
      context.commit('UPDATE_LOGGED_IN', true);
    } else {
      console.log('Refresh unauthorized');
      context.commit('UPDATE_LOGGED_IN', false);
      console.log(response);
    }
    return payload.callback;
  },
};
