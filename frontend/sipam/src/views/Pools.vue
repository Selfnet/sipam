<template>
  <div>
    <b-row>
      <b-col align-self="left">
        <h1><span class="h1">Pools</span></h1>
      </b-col>
    </b-row>
    <b-row class="text-center fixed-bottom">
      <b-col
        offset-xl="10"
        offset-lg="9"
        offset-md="9"
        offset-sm="8"
        offset="7"
      >
        <b-button
          pill
          size="lg"
          variant="primary"
          v-b-modal.create-pool-modal
          align-self="end"
          class="create-button"
        >
          <strong>
            <fai icon="plus-circle" />
            POOL
          </strong>
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <pool
          v-for="pool in pools"
          :key="pool"
          :poolID="pool"
        />
      </b-col>
      <pool-form :edit="false" />
    </b-row>
  </div>
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
