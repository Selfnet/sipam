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
        <b-form-input
          id="input-hostname"
          v-model="form.id"
          required
          placeholder="hostname"
        ></b-form-input>
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
      >Create</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'pool-form',
  props: {
    pool: Object,
  },
  data() {
    return {
      form: {
        hostname: '',
        description: '',
      },
      show: true,
    };
  },
  methods: {
    ...mapActions({
      assign: 'Pool/ASSIGN',
    }),
    onSubmit(evt) {
      evt.preventDefault();
      this.assign(this.form);
      // TODO: Refactor this
      this.$emit('assign-form-close');
    },
  },
};
</script>
