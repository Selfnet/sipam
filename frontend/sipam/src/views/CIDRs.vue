<template>
  <b-row>
    <b-col cols="10">
      <tree
        v-for="cidr in cidrs"
        v-bind:item="cidr"
        :key="cidr.id"
        :cidr="cidr"
      >
      </tree>
    </b-col>
    <b-col>
      <b-button
        pill
        size="lg"
        variant="primary"
        v-b-modal.create-cidr-modal
        class="bottom-tight"
      >
        <strong>
          <fai icon="plus-circle" />
          CIDR
        </strong>
      </b-button>
    </b-col>
    <cidr-form :edit="false" />
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Tree from '@/components/cidr/Tree.vue';
import CIDRForm from '@/components/cidr/forms/CIDRForm.vue';

export default {
  components: {
    Tree,
    'cidr-form': CIDRForm,
  },
  data() {
    return {
      loading: true,
      cidrs: [],
    };
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
