<template>
  <div class="pool">
    <div>
      <span>{{ pool.label }}</span>
      <b-dropdown
        id="editPool"
        variant="outline"
      >
        <template v-slot:button-content>
          <fai :icon="['fas', 'cog']" />
        </template>
        <b-dropdown-item @click="showEditForm = !showEditForm">Edit</b-dropdown-item>
        <b-modal
          v-model="showEditForm"
          title="Pool"
        >
          <template v-slot:modal-footer="{ cancel }">
            <b-button
              size="sm"
              variant="outline-danger"
              @click="cancel()"
            >Cancel</b-button>
          </template>
          <pool-form
            :pool="pool"
            :edit="true"
            v-on:pool-form-close="showEditForm = !showEditForm"
          >
          </pool-form>
        </b-modal>
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
      <b-button variant="primary">Assign</b-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import PoolForm from "@/components/PoolForm.vue";

export default {
  name: "pool",
  props: {
    poolID: String
  },
  components: {
    "pool-form": PoolForm
  },
  data() {
    return {
      showEditForm: false,
      showCreateForm: false
    };
  },
  computed: {
    ...mapState("Pool", {
      pool(state) {
        return state.pools[this.poolID];
      }
    })
  },
  methods: {
    ...mapActions({
      deletePool: "Pool/DELETE_POOL"
    }),
    confirmDelete() {
      this.$bvModal
        .msgBoxConfirm(
          `Please confirm that you want to delete ${this.pool.label} ("${
            this.pool.description
          }")`,
          {
            title: "Please Confirm",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "YES",
            cancelTitle: "NO",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true
          }
        )
        .then(value => {
          if (value) {
            this.deletePool(this.poolID);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.pool {
  border-bottom: 1px solid lightgray;
  display: grid;
  grid-template-columns: 20% 5% 40% 20%;
  grid-gap: 10px;
  margin: 2px;
}
</style>
