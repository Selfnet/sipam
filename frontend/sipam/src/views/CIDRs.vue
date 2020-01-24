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
import { mapGetters, mapActions } from 'vuex';
import Tree from '@/components/Tree.vue';

export default {
  components: {
    Tree,
  },
  data() {
    return {
      loading: true,
      cidrs: [],
    };
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
    }),
  },
  created() {
    this.fetchCIDRs().then(() => {
      this.cidrs = this.getCIDRs();
    });
    // eslint-disable-next-line no-unused-vars
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'Search/SET_QUERY' && mutation.payload.length > 0) {
        this.searchCIDR(mutation.payload).then(() => {
          this.cidrs = this.getCIDRs();
        });
      } else if (mutation.type === 'Search/SET_QUERY' && mutation.payload.length === 0) {
        this.fetchCIDRs().then(() => {
          this.cidrs = this.getCIDRs();
        });
      }
    });
  },
};
</script>
