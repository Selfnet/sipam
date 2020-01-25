<template>
  <div>
    <b-form
      @submit="onSubmit"
      @reset="onReset"
      v-if="show"
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

      <b-form-group id="input-group-3" label="Default Assignment Type" label-for="input-pool-type">
        <b-form-select
          id="input-pool-type"
          v-model="form.poolType"
          :options="poolTypes"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-4"
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

      <b-button
        type="submit"
        variant="primary"
      >Save</b-button>
      <b-button
        type="reset"
        variant="danger"
        v-if="!edit"
      >Reset</b-button>
    </b-form>
  </div>
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
      },
      show: true,
      poolTypes: ['Host Linknet', 'VM Linknet', 'Arbitrary'],
    };
  },
  created() {
    if (this.pool) {
      this.form.id = this.pool.id;
      this.form.label = this.pool.label;
      this.form.description = this.pool.description;
      this.form.poolType = this.pool.poolType;
    }
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
      this.$emit('pool-form-close');
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.id = '';
      this.form.label = '';
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
