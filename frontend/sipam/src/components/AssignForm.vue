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
        <b-input-group :append="form.useDefaultDomain ? defaultDomain: ''">
          <b-form-input
          id="input-hostname"
          v-model="form.hostname"
          required
          placeholder="hostname"
        ></b-form-input>
        </b-input-group>
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
      }).then((assigned) => {
        console.log(assigned);
        // TODO: Show a modal with the newly assigned prefixes

        // TODO: Refactor this
        this.$emit('assign-form-close');
      }).catch(() => {
        // Assignment Failed
        console.log('Could not assign');

        // TDOD: Show failed modal
        this.$emit('assign-form-close');
      });
    },
  },
};
</script>
