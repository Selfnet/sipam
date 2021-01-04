import Vue from 'vue';
import { CIDRState, CIDRGet, RootState } from '@/types/store';
import { CIDR } from '@/types/api';

export default {
  namespaced: true,

  state: {
    cidrs: {},
    root: new Set(),
    search: {},
  } as CIDRState,

  getters: {
    cidrs: (state: CIDRState) => {
      const cidrs: Array<CIDR> = [];
      state.root.forEach((cidrID: string) => cidrs.push(state.cidrs[cidrID]));
      return cidrs;
    },
    getByID: (state: CIDRState) => (nodeID: string) => state.cidrs[nodeID],
    getChildrenByParentID: (
      state: CIDRState, getters: any,
    ) => (parentID: string) => getters.getByID(
      parentID,
    ).children.map(
      (childID: string) => state.cidrs[childID],
    ),
  },

  mutations: {
    SET_CIDRS(state: CIDRState, payload: Array<CIDRGet>) {
      payload.forEach((cidr: CIDRGet) => {
        Vue.set(state.cidrs, cidr.id, cidr);
        if (!cidr.parent) {
          state.root.add(cidr.id);
        }
      });
    },
    SET_CIDR(state: CIDRState, payload: CIDRGet) {
      // Include the cild underneath the parent
      // Otherwise the tree won't be redrawn correctly
      if (payload && payload.parent && state.cidrs[payload.parent].children) {
        // eslint-disable-next-line no-undefined, no-null
        const child = state.cidrs[payload.parent].children;
        if (child) {
          child.push(payload.id);
        }
      }
      Vue.set(state.cidrs, payload.id, payload);
    },
    DELETE_CIDR(state: CIDRState, payload: string) {
      // First delete reference in parent
      const parentID = state.cidrs[payload].parent;

      // Check for null and undefined (even though ts still complains for no reason)
      if (parentID) {
        // eslint-disable-next-line no-undefined, no-null
        const child = state.cidrs[parentID].children;
        if (child) {
          child.splice(child.indexOf(payload), 1);
        }
      }
      // Now delete the actual item
      Vue.delete(state.cidrs, payload);
    },
    OVERRIDE_CIDRS(state: CIDRState, payload: CIDRGet[]) {
      state.root = new Set();
      payload.forEach((cidr: CIDRGet) => {
        Vue.set(state.cidrs, cidr.id, cidr);
        state.root.add(cidr.id);
      });
    },
  },

  actions: {
    async FETCH_CIDRS(context: { commit: any, rootState: RootState }) {
      const response = await context.rootState.api.cidr.cidrList();
      context.commit('OVERRIDE_CIDRS', response.data);
    },
    async UPDATE_CIDR(context: { commit: any, rootState: RootState }, payload: { cidrID: string, formData: CIDR }) {
      const response = await context.rootState.api.cidr.cidrUpdate(payload.cidrID, payload.formData);
      if (response.status === 200) {
        context.commit('SET_CIDR', response.data);
      } else {
        console.log(response);
      }
    },
    async FETCH_CHILDREN(context: { commit: any, rootState: RootState }, parentID: string) {
      const children = await context.rootState.api.cidr.cidrSubcidr(parentID);
      context.commit('SET_CIDRS', children.data);
    },
    async CREATE_CIDR(context: { commit: any, rootState: RootState }, formData: CIDR) {
      const response = await context.rootState.api.cidr.cidrCreate(formData);
      if (response.status === 201) {
        context.commit('SET_CIDR', response.data);
      } else {
        console.log(response);
      }
    },
    async DELETE_CIDR(context: { commit: any, rootState: RootState }, cidrID: string) {
      const response = await context.rootState.api.cidr.cidrDelete(cidrID);
      if (response.status === 204) {
        context.commit('DELETE_CIDR', cidrID);
      } else {
        console.log(response);
      }
    },
    async SEARCH_CIDR(context: { commit: any, rootState: RootState }, searchQuery: string) {
      const response = await context.rootState.api.cidr.cidrList({ search: searchQuery });
      if (response.status === 200) {
        context.commit('OVERRIDE_CIDRS', response.data);
      } else {
        console.log(response);
      }
    },
  },
};
