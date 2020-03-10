<template>
  <div>
    <b-form
      @submit="onSubmit"
      v-if="show"
    >
      <b-form-group
        id="input-group-1"
        label="Hostname:"
        label-for="input-hostname"
      >
        <div class="customFormAlign">
        <b-form-input
          id="input-hostname"
          v-model="form.hostname"
          required
          placeholder="hostname"
        ></b-form-input>
        <b-form-input v-if="form.useDefaultDomain"
          id="input-domain"
          v-model="defaultDomain"
          readonly
        ></b-form-input>
        </div>
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
          required
          rows="2"
          max-rows="3"
        ></b-form-textarea>
      </b-form-group>

      <b-form-checkbox
        id="useDefaultDomain"
        v-model="form.useDefaultDomain"
        name="useDefaultDomain"
    >
      Use default domain
    </b-form-checkbox>

      <b-button
        type="submit"
        variant="primary"
      >Create</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'assign-form',
  props: {
    pool: Object,
  },
  data() {
    return {
      form: {
        hostname: '',
        description: '',
        useDefaultDomain: true,
      },
      // Prepend a dot for visual effect
      defaultDomain: `.${this.pool.defaultDomain}`,
      show: true,
    };
  },
  methods: {
    ...mapActions({
      assign: 'Pool/ASSIGN',
    }),
    onSubmit(evt) {
      evt.preventDefault();
      this.assign({
        poolID: this.pool.id,
        assignmentData: this.form,
      });
      // TODO: Refactor this
      this.$emit('assign-form-close');
    },
  },
};
</script>

<style scoped>
.customFormAlign {
  display: grid;
  grid-template-columns: 60% 40%;
}
</style>
