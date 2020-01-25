<template>
  <div>
    <pool
      v-for="pool in pools"
      :key="pool"
      :poolID="pool"
    ></pool>
  <div>
      <b-button pill variant="primary"
        @click="showCreateForm = !showCreateForm"
        class="bottom-tight">Add New</b-button>
       <b-modal
          v-model="showCreateForm"
          title="Create Pool"
        >
          <template v-slot:modal-footer="{ cancel }">
            <b-button
              size="sm"
              variant="outline-danger"
              @click="cancel()"
            >Cancel</b-button>
          </template>
          <pool-form
            :edit="false"
            v-on:pool-form-close="showCreateForm = !showCreateForm"
          >
          </pool-form>
        </b-modal>
  </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Pool from '@/components/Pool.vue';
import PoolForm from '@/components/PoolForm.vue';


export default {
  components: {
    Pool,
    PoolForm,
  },
  data() {
    return {
      loading: true,
      pools: [],
      showCreateForm: false,
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

<style scoped>
.bottom-right {
  right: 0;
  bottom: 0;
  position: absolute;
}
</style>
