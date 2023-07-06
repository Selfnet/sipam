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
          />
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
        />
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
      >{{$t('GENERAL.BUTTON.CREATE')}}</b-button>
    </b-form>
    <b-modal
      v-model="showAssignCompleteModal"
      title="Assignment Complete"
      @ok="onModalClose"
      @hidden="hideModal"
    >
      <template #modal-footer="{ ok, hide }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button
          size="sm"
          variant="success"
          @click="ok()"
        >
          OK
        </b-button>
        <b-button
          size="sm"
          variant="light"
          @click="hide()"
        >
          OK and assign other
        </b-button>
      </template>
      <assign-completed-modal :assignment="assignment">
      </assign-completed-modal>
    </b-modal>
  </div>
</template>

<script  lang="ts">
import { mapActions } from 'vuex';
import AssignCompletedModal from './AssignCompletedModal.vue';

export default {
  components: { AssignCompletedModal },
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
      assignment: Object,
      showAssignCompleteModal: false,
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
      })
        .then((assigned) => {
          console.log(assigned);
          // Show a modal with the newly assigned prefixes
          this.assignment = assigned;
          this.showAssignCompleteModal = true;
        })
        .catch(() => {
          // Assignment Failed
          console.log('Could not assign');

          // TDOD: Show failed modal
        });
    },
    onModalClose() {
      this.showAssignCompleteModal = false;
      this.$emit('assign-form-close');
    },
    hideModal() {
      this.showAssignCompleteModal = false;
    },
  },
};
</script>
