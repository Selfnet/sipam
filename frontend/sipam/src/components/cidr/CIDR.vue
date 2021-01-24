<template>
  <div class="cidr">
    <div>
      <span
        class="network"
        @click="$emit('cidrClicked')"
      >{{ cidr.cidr }}</span>
      <b-dropdown
        id="editCIDR"
        variant="outline"
      >
        <b-dropdown-item
          @click="showEditForm = !showEditForm"
        >Edit</b-dropdown-item>
        <cidr-form
          v-model="showEditForm"
          :cidr="cidr"
          :edit=true
        ></cidr-form>

        <b-dropdown-item
          @click="showCreateForm = !showCreateForm"
          v-if="!isIP"
        >Add Subnet</b-dropdown-item>
        <cidr-form
          v-model="showCreateForm"
          :parentCIDR=cidr.cidr
          :edit=false
        ></cidr-form>
        <b-dropdown-item
          variant="danger"
          @click="confirmDelete"
        >Delete</b-dropdown-item>
      </b-dropdown>
    </div>
    <div>
      <b-badge
        class="flag"
        :class="cidr.flag"
      >{{ flag }}</b-badge>
    </div>
    <div>
      <span
        class="fqdn"
        v-if="cidr.fqdn"
      >{{ cidr.fqdn }} </span>
    </div>
    <div>
      <span class="description">{{ cidr.description }} </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CIDRForm from './forms/CIDRForm.vue';

export default {
  name: 'cidr',
  props: {
    cidrID: String,
  },
  components: {
    'cidr-form': CIDRForm,
  },
  data() {
    return {
      showEditForm: false,
      showCreateForm: false,
    };
  },
  computed: {
    ...mapState('CIDR', {
      cidr(state) {
        return state.cidrs[this.cidrID];
      },
    }),
    isIP() {
      const { cidr } = this.cidr;
      // Check if is ipv6 and prefix is /128 or is not ipv6 and prefix is /32
      return (
        (cidr.includes(':') && cidr.endsWith('128'))
        || (!cidr.includes(':') && cidr.endsWith('32'))
      );
    },
  },
  created() {
    this.flag = this.cidr.flag.charAt(0).toUpperCase();
  },
  methods: {
    ...mapActions({
      deleteCIDR: 'CIDR/DELETE_CIDR',
    }),
    confirmDelete() {
      this.$bvModal
        .msgBoxConfirm(
          `Please confirm that you want to delete ${this.cidr.cidr} ("${
            this.cidr.description
          }")`,
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
            this.deleteCIDR(this.cidrID);
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
.cidr {
  border-bottom: 1px solid lightgray;
  display: grid;
  grid-template-columns: 22% 2% 40% 30%;
  grid-gap: 10px;
  margin: 2px;
}

.network {
  align-items: left;
  padding: 0.5em;
  cursor: pointer;
}

.description {
  float: right;
}

.fqdn {
  margin: 1em;
}

.reservation {
  background-color: #28a745;
}

.assignment {
  background-color: #ffc107;
}

.host {
  background-color: #ff743c;
}
</style>
