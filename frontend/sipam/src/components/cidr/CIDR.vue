<template>
  <b-container
    fluid
    class="cidr"
  >
    <b-row>
      <b-col>
        <b-badge
          class="flag"
          :class="cidr.flag"
        >{{ flag }}</b-badge>
      </b-col>
      <b-col>
        <span
          class="network pointer"
          @click="$emit('cidrClicked')"
        >{{ cidr.cidr }}</span>
      </b-col>
      <b-col>
        <b-dropdown
          id="editCIDR"
          variant="outline"
        >
          <template v-slot:button-content>
            <fai
              :icon="['fas', 'cog']"
              class="fa-lg"
            />
          </template>
          <b-dropdown-item v-b-modal="modalCIDREditID">
            {{$t('GENERAL.BUTTON.EDIT')}}
          </b-dropdown-item>
          <cidr-form
            :cidr="cidr"
            :edit="true"
          ></cidr-form>

          <b-dropdown-item
            v-b-modal="modalCIDRAddSubID"
            v-if="!isIP"
          >{{$t('GENERAL.SUBNET.ADD')}}</b-dropdown-item>
          <cidr-form
            :cidr="cidr"
            :parentCIDR="cidr.cidr"
            :edit="false"
          ></cidr-form>
          <b-dropdown-item
            variant="danger"
            @click="confirmDelete"
          >{{$t('GENERAL.BUTTON.DELETE')}}</b-dropdown-item>
        </b-dropdown>
      </b-col>
      <b-col>
        <span
          class="fqdn"
          v-show="cidr.fqdn"
        >{{ cidr.fqdn }} </span>
      </b-col>
      <b-col align-self="right">
        <span class="description">{{ cidr.description }}</span>
      </b-col>
    </b-row>
  </b-container>
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
        (cidr.includes(':') && cidr.endsWith('128')) || (!cidr.includes(':') && cidr.endsWith('32'))
      );
    },
    modalCIDREditID() {
      return `edit-cidr-modal-${this.cidr.id}`;
    },
    modalCIDRAddSubID() {
      return `add-cidr-modal-${this.cidr.id}`;
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
          `Please confirm that you want to delete ${this.cidr.cidr} ("${this.cidr.description}")`,
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
/* .cidr {
  border-bottom: 1px solid lightgray;
  display: grid;
  grid-template-columns: 22% 2% 40% 30%;
  grid-gap: 10px;
  margin: 2px;
} */

/* .network {
  align-items: left;
  padding: 0.5em;
  cursor: pointer;
} */

/* .description {
  float: right;
}

.fqdn {
  margin: 1em;
} */

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
