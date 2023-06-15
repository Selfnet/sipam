<template>
  <b-row class="token">
    <b-col>
      <span>{{ token.user }}</span>
    </b-col>
    <b-col>
      <span>
        <strong>Permission:</strong>
        {{ permission }}
      </span>
    </b-col>
    <b-col>
      <b-input-group>
        <b-form-input
          disabled
          :type="passwordType"
          :value="token.key"
        ></b-form-input>
        <b-input-group-append>
          <b-button
            text="Button"
            variant="primary"
            @click="showPassword = !showPassword"
          >
            <fai
              :icon="eyeType"
            />
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-col>
    <b-col>
      <b-dropdown
        id="editToken"
        variant="outline"
      >
        <template v-slot:button-content>
          <fai
            :icon="['fas', 'cog']"
            class="fa-lg"
          />
        </template>
        <b-dropdown-item v-b-modal="modalTokenId">Edit</b-dropdown-item>
        <token-form
          :token="token"
          :edit="true"
        >
        </token-form>
        <b-dropdown-item
          variant="danger"
          @click="confirmDelete"
        >Delete</b-dropdown-item>
      </b-dropdown>
    </b-col>
    <b-col>
      <span class="description">{{ token.description }}</span>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TokenForm from './modals/TokenForm.vue';

export default {
  name: 'token',
  props: {
    tokenKey: String,
  },
  components: {
    'token-form': TokenForm,
  },
  data() {
    return {
      showPassword: false,
      showEditForm: false,
      showCreateForm: false,
    };
  },
  computed: {
    ...mapState('Token', {
      token(state) {
        return state.tokens[this.tokenKey];
      },
    }),
    passwordType() {
      return !this.showPassword ? 'password' : 'text';
    },
    eyeType() {
      return !this.showPassword ? 'eye' : 'eye-slash';
    },
    permission() {
      return this.token.write ? 'WRITE' : 'READ';
    },
    modalTokenId() {
      return `edit-token-modal-${this.tokenKey}`;
    },
  },
  methods: {
    ...mapActions({
      deleteToken: 'Token/DELETE_TOKEN',
    }),
    confirmDelete() {
      this.$bvModal
        .msgBoxConfirm(
          `Please confirm that you want to delete ${this.token.user} write: ${this.token.write} ("${this.token.description}")`,
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
            this.deleteToken(this.tokenKey);
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
.token {
  border-bottom: 1px solid lightgray;
  /* display: grid;
  grid-template-columns: 20% 40% 20%;
  grid-gap: 10px; */
  margin: 2px;
  padding: 5px;
}
/*
.label {
  display: grid;
  grid-template-columns: 15% 50% 10%;
} */
</style>
