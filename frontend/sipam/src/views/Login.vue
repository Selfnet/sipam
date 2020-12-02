<template>
  <b-form
    class="rounded form-signin"
    @submit.prevent="login"
  >
    <h2 class="form-signin-heading">{{$t("GENERAL.LOGIN.DESCRIPTION")}}</h2>
    <b-form-group
      id="labelEmail"
      :description="$t('GENERAL.UID.DESCRIPTION')"
      label-for="inputEmail"
    >
      <label
        for="inputEmail"
        class="sr-only"
      >Email address</label>
      <b-form-input
        v-model="username"
        type="text"
        id="inputEmail"
        :placeholder="$t('GENERAL.UID.PLACEHOLDER')"
        required
        autofocus
      />
    </b-form-group>
    <b-form-group
      id="labelPassword"
      :description="$t('GENERAL.PASSWORD.DESCRIPTION')"
      label-for="inputPassword"
    >
      <b-form-input
        v-model="password"
        type="password"
        id="inputPassword"
        :placeholder="$t('GENERAL.PASSWORD.PLACEHOLDER')"
        required
      />
    </b-form-group>
    <b-button
      class="btn btn-lg btn-primary btn-block"
      type="submit"
    >{{$t("GENERAL.LOGIN.LABEL")}}</b-button>
  </b-form>
</template>

<script>
import {
  mapGetters, mapActions,
} from 'vuex';
import SIPAM from '@/sipam';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    ...mapGetters('Auth', {
      getLoggedIn: 'loggedIn',
    }),
    ...mapActions({
      postLogin: 'Auth/POST_LOGIN',
    }),
    loginFailed(data) {
      console.log(data);
      console.log('Login Failed.');
    },
    loginSuccessfull() {
      if (this.getLoggedIn()) {
        this.$router.push({ path: 'home' });
      } else {
        this.$router.push({ path: 'login' });
      }
    },
    login() {
      this.postLogin({ username: this.username, password: this.password })
        .then(() => {
          SIPAM.api.setSecurityData(this.$store.getters['AuthOIDC/oidcIdToken']);
          this.loginSuccessfull();
        })
        .catch(data => this.loginFailed(data));
    },
  },
};
</script>
<style lang="css" scoped>
.form-signin {
  background-color: #efefef;
  margin: 30px auto;
  padding: 30px 30px 80px 30px;
  max-width: 450px;
}
</style>
