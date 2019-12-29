<template>
  <div>
    <pool
      v-for="pool in pools"
      :key="pool"
      :poolID="pool"
    ></pool>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Pool from '@/components/Pool.vue';

export default {
  components: {
    Pool,
  },
  data() {
    return {
      loading: true,
      pools: [],
    };
  },
  computed: {},
  methods: {
    ...mapActions({
      fetchPools: 'Pool/FETCH_POOLS',
    }),
    ...mapGetters('Pool', {
      getPools: 'pools',
    }),
  },

  created() {
    this.fetchPools().then(() => {
      this.pools = this.getPools();
      this.loading = false;
    });
  },
};
</script>
