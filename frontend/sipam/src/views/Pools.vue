<template>
  <div>
    <pool
      v-for="pool in pools"
      :key="pool"
      :poolID="pool"
    ></pool>
  <div>
    <b-button pill variant="primary"
      v-b-modal.create-pool-modal
      class="bottom-tight">
      <div>
        <fai icon="plus-circle"/>
        POOL
      </div>
    </b-button>
    <pool-form
      :edit="false"
    />
  </div>
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
