<template>
      <div>
        <tree
          v-for="cidr in cidrs"
          v-bind:item="cidr"
          :key="cidr.id"
          :cidr="cidr">
        </tree>
      </div>
</template>
<script>
import Tree from '@/components/Tree.vue'
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  components: {
    Tree,
  },
  data() {
    return {
      loading: true,
      cidrs: [],
    }
  },
  computed: {
  },
  methods: {
    ...mapGetters('CIDR', {
      getCIDRs: 'cidrs',
    }),
    ...mapActions({
      fetchCIDRs: 'CIDR/FETCH_CIDRS',
      searchCIDR: 'CIDR/SEARCH_CIDR',
    })
  },
  created() {
    this.fetchCIDRs().then(() => {
      this.cidrs = this.getCIDRs()
    })
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'Search/SET_QUERY' && mutation.payload.length > 0) {
        this.searchCIDR(mutation.payload).then(() => {
          this.cidrs = this.getCIDRs()
        })
      } else if (mutation.type === 'Search/SET_QUERY' && mutation.payload.length === 0) {
        this.fetchCIDRs().then(() => {
          this.cidrs = this.getCIDRs()
        })
      }
    });
  }
};
</script>
