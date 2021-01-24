<template>
  <div>
    <div class="pool">
      <div class="label">
        <fai
          @click="showPrefixes = !showPrefixes"
          :icon="showPrefixes ? 'minus-circle': 'plus-circle'"
          class="pointer"
        />
        <span
          @click="showPrefixes = !showPrefixes"
          class="bold pointer"
        >{{ pool.label }}</span>
        <b-dropdown
          id="editPool"
          variant="outline"
        >
          <template v-slot:button-content>
            <fai :icon="['fas', 'cog']" />
          </template>
          <b-dropdown-item v-b-modal="modalPoolId">Edit</b-dropdown-item>
          <pool-form
            :pool="pool"
            :edit="true"
          >
          </pool-form>
          <b-dropdown-item
            variant="danger"
            @click="confirmDelete"
          >Delete</b-dropdown-item>
        </b-dropdown>
      </div>
      <div>
        <span class="description">{{ pool.description }}</span>
      </div>
      <div>
        <b-button
          variant="primary"
          @click="showAssignForm = !showAssignForm"
        >Assign</b-button>
        <b-modal
          v-model="showAssignForm"
          title="New Assignment"
        >
          <template v-slot:modal-footer="{ cancel }">
            <b-button
              size="sm"
              variant="outline-danger"
              @click="cancel()"
            >Cancel</b-button>
          </template>
          <assign-form
            :pool="pool"
            v-on:assign-form-close="showAssignForm = !showAssignForm"
          >
          </assign-form>
        </b-modal>
      </div>
    </div>
    <div>
      <b-collapse
        id="show-prefixes"
        v-model="showPrefixes"
      >
        <b-card>
          <div
            v-for="prefix in pool.prefixes"
            :key="prefix.id"
          >
            <cidr :cidrID="prefix.id"></cidr>
          </div>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CIDR from '@/components/cidr/CIDR.vue';
import AssignForm from './modals/AssignForm.vue';
import PoolForm from './modals/PoolForm.vue';

export default {
  name: 'pool',
  props: {
    poolID: String,
  },
  components: {
    'pool-form': PoolForm,
    'assign-form': AssignForm,
    cidr: CIDR,
  },
  data() {
    return {
      showEditForm: false,
      showCreateForm: false,
      showAssignForm: false,
      showPrefixes: false,
    };
  },
  computed: {
    ...mapState('Pool', {
      pool(state) {
        return state.pools[this.poolID];
      },
    }),
    modalPoolId() {
      return `edit-pool-modal-${this.poolID}`;
    },
  },
  methods: {
    ...mapActions({
      deletePool: 'Pool/DELETE_POOL',
    }),
    confirmDelete() {
      this.$bvModal
        .msgBoxConfirm(
          `Please confirm that you want to delete ${this.pool.label} ("${this.pool.description}")`,
          {
            title: 'Please Confirm',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
          },
        )
        .then((value) => {
          if (value) {
            this.deletePool(this.poolID);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.pool {
  border-bottom: 1px solid lightgray;
  display: grid;
  grid-template-columns: 20% 40% 20%;
  grid-gap: 10px;
  margin: 2px;
  padding: 5px;
}

.label {
  display: grid;
  grid-template-columns: 15% 50% 10%;
}
</style>
