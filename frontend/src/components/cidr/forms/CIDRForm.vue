<template>
  <b-modal
    :id="id()"
    @ok="onSubmit"
    ref="modal"
    button-size="lg"
    :title="edit ? $t('GENERAL.CIDR.EDIT'): $t('GENERAL.CIDR.CREATE')"
    no-stacking
  >
    <form
      ref="form"
      @submit.stop.prevent="onSubmit"
    >
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

      <b-form-group
        id="input-group-3"
        label="Flag:"
        label-for="input-flag"
      >
        <b-form-select
          id="input-flag"
          v-model="form.flag"
          :options="flags"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-4"
        label="Pool:"
        label-for="input-pool"
      >
        <b-form-select
          id="input-pool"
          v-model="form.pool"
          :options="pools"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-5"
        label="Description:"
        label-for="input-desc"
      >
        <b-form-textarea
          id="input-desc"
          v-model="form.description"
          placeholder="Description..."
          rows="2"
          max-rows="3"
        ></b-form-textarea>
      </b-form-group>
    </form>
    <template #modal-footer="{ cancel, ok }">
      <b-button
        type="reset"
        v-if="!edit"
        variant="danger"
        @click="onReset()"
      >
        {{$t("GENERAL.BUTTON.RESET")}}
      </b-button>
      <b-button
        variant="secondary"
        class="ml-auto"
        @click="cancel()"
      >
        {{$t("GENERAL.BUTTON.CANCEL")}}
      </b-button>
      <!-- Emulate built in modal footer ok and cancel button actions -->
      <b-button
        variant="primary"
        @click="ok()"
      >
        {{$t("GENERAL.BUTTON.OK")}}
      </b-button>
    </template>
  </b-modal>
</template>

<script  lang="ts">
import { mapActions } from 'vuex';

export default {
  name: 'cidr-form',
  props: {
    cidr: Object,
    edit: Boolean,
    parentCIDR: String,
    pools: Array,
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
  },
  methods: {
    ...mapActions({
      updateCIDR: 'CIDR/UPDATE_CIDR',
      createCIDR: 'CIDR/CREATE_CIDR',
    }),
    id() {
      if (this.parentCIDR !== undefined) {
        return `add-cidr-modal-${this.cidr.id}`;
      }
      return this.edit ? `edit-cidr-modal-${this.cidr.id}` : 'create-cidr-modal';
    },
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
      this.$nextTick(() => {
        this.$bvModal.hide(this.id());
      });
    },
    setDefault() {
      // Reset our form values
      this.form.cidr = '';
      this.form.fqdn = '';
      this.form.flag = 'reservation';
      this.form.description = '';
    },
    onReset() {
      this.setDefault();
      // Trick to reset/clear native browser form validation state
      this.$bvModal.hide(this.id());
      this.$nextTick(() => {
        this.$bvModal.show(this.id());
      });
    },
  },
};
</script>
