<template>
  <div>
    <b-row>
      <b-col align-self="left">
        <h1><span class="h1">Tokens</span></h1>
      </b-col>
    </b-row>
    <b-row class="text-center fixed-bottom">
      <b-col
        offset-xl="10"
        offset-lg="9"
        offset-md="9"
        offset-sm="8"
        offset="7"
      >
        <b-button
          pill
          size="lg"
          variant="primary"
          v-b-modal.create-token-modal
          align-self="end"
          class="create-button"
        >
          <strong>
            <fai icon="plus-circle" />
            TOKEN
          </strong>
        </b-button>
      </b-col>
    </b-row>
    <token
      v-for="token in tokens"
      :key="token"
      :tokenKey="token"
    />
    <token-form :edit="false" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import Token from '@/components/token/Token.vue';
import TokenForm from '@/components/token/modals/TokenForm.vue';

export default {
  components: {
    Token,
    TokenForm,
  },
  data() {
    return {
      loading: true,
      showCreateForm: false,
    };
  },
  computed: {
    ...mapState('Token', {
      tokens: state => Object.keys(state.tokens),
    }),
  },
  methods: {
    ...mapActions({
      fetchTokens: 'Token/FETCH_TOKENS',
    }),
  },
  created() {
    this.fetchTokens().then(() => {
      this.loading = false;
    });
  },
};
</script>

<style scoped>

.bottom-right {
  right: 0;
  bottom: 0;
  position: absolute;
}
</style>
