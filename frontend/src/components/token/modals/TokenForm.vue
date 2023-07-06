<template>
  <b-modal
    :id="id"
    @ok="onSubmit"
    ref="modal"
    button-size="lg"
    :title="edit ? $t('GENERAL.TOKEN.EDIT'): $t('GENERAL.TOKEN.CREATE')"
    no-stacking
  >
    <form
      ref="form"
      @submit.stop.prevent="onSubmit"
    >
      <b-form-group
        id="input-group-1"
        :label="$t('GENERAL.TOKEN.PERMISSION')"
        label-for="input-permission"
        description
      >
        <b-form-checkbox
          id="input-permission"
          v-model="form.write"
          value="true"
          unchecked-value="false"
        ></b-form-checkbox>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        :label="$t('GENERAL.TOKEN.DESCRIPTION')"
        label-for="input-description"
      >
        <b-form-textarea
          id="input-description"
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
  name: 'token-form',
  props: {
    token: Object,
    edit: Boolean,
  },
  data() {
    return {
      form: {
        key: '',
        write: false,
        user: '',
        description: '',
      },
    };
  },
  created() {
    if (this.token) {
      this.form.key = this.token.key;
      this.form.write = this.token.write;
      this.form.user = this.token.user;
      this.form.description = this.token.description;
    }
  },
  computed: {
    id() {
      return this.edit ? `edit-token-modal-${this.token.key}` : 'create-token-modal';
    },
  },
  methods: {
    ...mapActions({
      updateToken: 'Token/UPDATE_TOKEN',
      createToken: 'Token/CREATE_TOKEN',
    }),
    onSubmit(evt) {
      evt.preventDefault();
      if (this.edit) {
        this.updateToken({
          tokenKey: this.token.key,
          formData: this.form,
        });
      } else {
        this.createToken(this.form);
      }
      // TODO: Refactor this
      this.$nextTick(() => {
        this.$bvModal.hide(this.id);
      });
    },
    setDefault() {
      this.form.key = '';
      this.form.write = false;
      this.form.user = '';
      this.form.description = '';
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
