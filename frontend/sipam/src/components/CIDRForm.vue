<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="CIDR:"
        label-for="input-cidr"
        description=""
      >
        <b-form-input
          id="input-cidr"
          v-model="form.cidr"
          required
          placeholder="3.141.59.26/32"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="FQDN:"
        label-for="input-fqdn"
        v-if="form.flag === 'host'"
      >
        <b-form-input
          id="input-fqdn"
          v-model="form.fqdn"
          placeholder=""
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Flag:" label-for="input-flag">
        <b-form-select
          id="input-flag"
          v-model="form.flag"
          :options="flags"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-4" label="Pool:" label-for="input-pool">
        <b-form-select
          id="input-pool"
          v-model="form.pool"
          :options="pools"
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-5" label="Description:" label-for="input-desc">
        <b-form-textarea
          id="input-desc"
          v-model="form.description"
          placeholder="Description..."
          rows="2"
          max-rows="3"
      ></b-form-textarea>
      </b-form-group>

      <b-button type="submit" variant="primary">Save</b-button>
      <b-button type="reset" variant="danger" v-if="!edit">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'cidr-form',
  props: {
    cidr: Object,
    edit: Boolean,
    parentCIDR: String,
  },
  data() {
    return {
      form: {
        cidr: '',
        fqdn: '',
        flag: 'reservation',
        pool: null,
        description: '',
      },
      flags: ['assignment', 'host', 'reservation'],
      show: true,
      pools: [],
    };
  },
  created() {
    if (this.parentCIDR) {
      this.form.cidr = this.parentCIDR;
    }
    if (this.cidr) {
      this.form.cidr = this.cidr.cidr;
      this.form.fqdn = this.cidr.fqdn;
      this.form.flag = this.cidr.flag;
      this.form.pool = this.cidr.pool;
      this.form.description = this.cidr.description;
    }
    // Fetch Pools so they can be shown in a dropdown list
    this.fetchPools().then(() => {
      // Generate a list of objects with value/text keys which can be interpreted by the select form
      this.pools = this.getPools().map(pool => ({
        value: pool.id,
        text: `${pool.label} - ${pool.description}`,
      }));
      // Add an "unassigned" option at the front
      this.pools.unshift({
        value: null,
        text: 'No Pool',
      });
    });
  },
  methods: {
    ...mapActions({
      updateCIDR: 'CIDR/UPDATE_CIDR',
      createCIDR: 'CIDR/CREATE_CIDR',
      fetchPools: 'Pool/FETCH_POOLS',
    }),
    ...mapGetters('Pool', {
      getPools: 'poolList',
    }),
    onSubmit(evt) {
      evt.preventDefault();
      if (this.edit) {
        this.updateCIDR({
          cidrID: this.cidr.id,
          formData: this.form,
        });
      } else {
        this.createCIDR(this.form);
      }
      // TODO: Refactor this
      this.$emit('cidr-form-close');
    },

    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.cidr = '';
      this.form.fqdn = '';
      this.form.flag = 'reservation';
      this.form.description = '';
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>
