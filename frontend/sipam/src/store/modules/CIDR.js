import Vue from 'vue';
import cidrAPI from '@/services/api/CIDR'

export default {
  namespaced: true,

  state: {
    cidrs: {},
    _root: new Set(),
    search: {},
  },

  getters: {
    cidrs: (state) => {
      let cidrs = []
      state._root.forEach(cidrID => cidrs.push(state.cidrs[cidrID]))
      return cidrs
    },
    getByID: (state) => {
      return nodeID => {
        return state.cidrs[nodeID]
      }
    },
    getChildrenByParentID: (state, getters) => {
      return parentID => {
        return getters.getByID(parentID).children.map(childID => {
          return state.cidrs[childID]
        })
      }
    },
  },

  mutations: {
    SET_CIDRS(state, payload) {
      payload.forEach(cidr => {
         Vue.set(state.cidrs, cidr.id, cidr)
         if (!cidr.parent) {
           state._root.add(cidr.id)
         }
      });
    },
    SET_CIDR(state, payload) {
      // Include the cild underneath the parent
      // Otherwise the tree won't be redrawn correctly
      if (payload.parent) {
        state.cidrs[payload.parent].children.push(payload.id)
      }
      Vue.set(state.cidrs, payload.id, payload)
    },
    DELETE_CIDR(state, payload) {
      // First delete reference in parent
      const parentID = state.cidrs[payload].parent
      state.cidrs[parentID].children.splice(
        state.cidrs[parentID].children.indexOf(payload),
        1
      )
      // Now delete the actual item
      delete state.cidrs[payload]
    },
    OVERRIDE_CIDRS(state, payload) {
      state._root = new Set()
      payload.forEach(cidr => {
         Vue.set(state.cidrs, cidr.id, cidr)
         state._root.add(cidr.id)
      });
    }
  },

  actions: {
    async FETCH_CIDRS({ commit }) {
      const cidrs = await cidrAPI.getCIDRs()
      commit('OVERRIDE_CIDRS', cidrs)
    },
    async UPDATE_CIDR({ commit }, { cidrID, formData }) {
      const response =  await cidrAPI.updateCIDR(cidrID, formData)
      if (response.status == 200) {
        commit('SET_CIDR', response.data)
      } else {
        console.log(response)
      }
    },
    async FETCH_CHILDREN({ commit }, parentID) {
      const children = await cidrAPI.getChildren(parentID)
      commit('SET_CIDRS', children)
    },
    async CREATE_CIDR({ commit }, formData) {
      const response =  await cidrAPI.createCIDR(formData)
      if (response.status == 201) {
        commit('SET_CIDR', response.data)
      } else {
        console.log(response)
      }
    },
    async DELETE_CIDR({ commit }, cidrID) {
      const response = await cidrAPI.deleteCIDR(cidrID)
      if (response.status == 204) {
        commit('DELETE_CIDR', cidrID)
      } else {
        console.log(response)
      }
    },
    async SEARCH_CIDR({ commit }, searchQuery) {
      const response = await cidrAPI.searchCIDR(searchQuery)
      if (response.status == 200) {
        commit('OVERRIDE_CIDRS', response.data)
      } else {
        console.log(response)
      }
    },
  },
}
