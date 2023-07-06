import Vue from 'vue';
import { TokenState, RootState } from '@/types/store.ts';
import { Token } from '@/types/api.ts';

export default {
  namespaced: true,
  state: {
    tokens: {},
  } as TokenState,

  getters: {
    tokenList: (state: TokenState) => Object.values(state.tokens),
  },

  mutations: {
    SET_TOKENS(state: TokenState, tokens: Token[]) {
      tokens.forEach((token) => {
        if (token.key) {
          Vue.set(state.tokens, token.key, token);
        }
      });
    },
    SET_TOKEN(state: TokenState, token: Token) {
      if (token.key) {
        Vue.set(state.tokens, token.key, token);
      }
    },
    DELETE_TOKEN(state: TokenState, key: string) {
      Vue.delete(state.tokens, key);
    },
  },
  actions: {
    async FETCH_TOKENS(context: { commit: any; rootState: RootState }) {
      const response = await context.rootState.api.token.tokenList();
      if (response.data && response.status === 200) {
        context.commit('SET_TOKENS', response.data);
      } else {
        console.log(response);
      }
    },
    async UPDATE_TOKEN(
      context: { commit: any; rootState: RootState },
      payload: { tokenKey: string; formData: Token },
    ) {
      const response = await context.rootState.api.token.tokenUpdate(
        payload.tokenKey,
        payload.formData,
      );
      if (response.status === 200) {
        context.commit('SET_TOKEN', response.data);
      } else {
        console.log(response);
      }
    },
    async CREATE_TOKEN(context: { commit: any; rootState: RootState }, formData: Token) {
      const response = await context.rootState.api.token.tokenCreate(formData);
      if (response.status === 201) {
        context.commit('SET_TOKEN', response.data);
      } else {
        console.log(response);
      }
    },
    async DELETE_TOKEN(context: { commit: any; rootState: RootState }, tokenKey: string) {
      const response = await context.rootState.api.token.tokenDelete(tokenKey);
      if (response.status === 204) {
        context.commit('DELETE_TOKEN', tokenKey);
      } else {
        console.log(response);
      }
    },
  },
};
