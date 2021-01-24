<template>
  <b-row>
    <b-col cols="10">
      <pool
        v-for="pool in pools"
        :key="pool"
        :poolID="pool"
      />
    </b-col>
    <b-col>
      <b-button
        pill
        size="lg"
        variant="primary"
        v-b-modal.create-pool-modal
        class="bottom-tight"
      >
        <strong>
          <fai icon="plus-circle" />
          POOL
        </strong>
      </b-button>
    </b-col>
    <pool-form :edit="false" />
  </b-row>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import Pool from '@/components/pool/Pool.vue';
import PoolForm from '@/components/pool/modals/PoolForm.vue';

export default {
  components: {
    Pool,
    PoolForm,
  },
  data() {
    return {
      loading: true,
      showCreateForm: false,
    };
  },
  computed: {
    ...mapState('Pool', {
      pools: state => Object.keys(state.pools),
    }),
  },
  methods: {
    ...mapActions({
      fetchPools: 'Pool/FETCH_POOLS',
    }),
  },
  created() {
    this.fetchPools().then(() => {
      this.loading = false;
    });
  },
};
</script>

<style scoped>
.bottom-right {
  right: 0;
  bottom: 0;
  position: absolute;
}
</style>
