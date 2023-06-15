<template>
  <b-modal
    :id="id"
    @ok="onSubmit"
    ref="modal"
    button-size="lg"
    :title="edit ? $t('GENERAL.POOL.EDIT'): $t('GENERAL.POOL.CREATE')"
    no-stacking
  >
    <form
      ref="form"
      @submit.stop.prevent="onSubmit"
    >
      <b-form-group
        id="input-group-1"
        label="Pool:"
        label-for="input-pool"
        description
        v-if="!edit"
      >
        <b-form-input
          id="input-pool"
          v-model="form.id"
          required
          placeholder="Pool Key"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Display Label"
        label-for="input-label"
      >
        <b-form-input
          id="input-label"
          v-model="form.label"
          placeholder="A useful pool"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Default Assignment Type"
        label-for="input-pool-type"
      >
        <b-form-select
          id="input-pool-type"
          v-model="form.poolType"
          :options="poolTypes"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-4"
        label="Default Domain Name"
        label-for="input-domain"
      >
        <b-form-input
          id="input-domain"
          v-model="form.defaultDomain"
          placeholder="server.selfnet.de"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-5"
        label="Description"
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

<script>
import { mapActions } from 'vuex';

export default {
  name: 'pool-form',
  props: {
    pool: Object,
    edit: Boolean,
  },
  data() {
    return {
      form: {
        id: '',
        label: '',
        description: '',
        poolType: 'Arbitrary',
        defaultDomain: '',
      },
      poolTypes: ['Host Linknet', 'VM Linknet', 'Arbitrary'],
    };
  },
  created() {
    if (this.pool) {
      this.form.id = this.pool.id;
      this.form.label = this.pool.label;
      this.form.description = this.pool.description;
      this.form.poolType = this.pool.poolType;
      this.form.defaultDomain = this.pool.defaultDomain;
    }
  },
  computed: {
    id() {
      return this.edit ? `edit-pool-modal-${this.pool.id}` : 'create-pool-modal';
    },
  },
  methods: {
    ...mapActions({
      updatePool: 'Pool/UPDATE_POOL',
      createPool: 'Pool/CREATE_POOL',
    }),
    onSubmit(evt) {
      evt.preventDefault();
      if (this.edit) {
        this.updatePool({
          poolID: this.pool.id,
          formData: this.form,
        });
      } else {
        this.createPool(this.form);
      }
      // TODO: Refactor this
      this.$nextTick(() => {
        this.$bvModal.hide(this.id);
      });
    },
    setDefault() {
      this.form.id = '';
      this.form.label = '';
      this.form.description = '';
      this.form.defaultDomain = '';
    },
    onHide(evt) {
      evt.preventDefault();
      // Reset our form values
      this.setDefault();
      // Trick to reset/clear native browser form validation state
      this.$bvModal.hide(this.id);
    },
    onReset() {
      // Reset our form values
      this.setDefault();
      // Trick to reset/clear native browser form validation state
      this.$bvModal.hide(this.id);
      this.$nextTick(() => {
        this.$bvModal.show(this.id);
      });
    },
  },
};
</script>
