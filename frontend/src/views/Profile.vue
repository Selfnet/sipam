<template>
  <div v-if="oidcIsAuthenticated">
    <p>
      You are signed in as:
    </p>
    <div
      style="width:100%;max-width:640px;height: 200px;margin: 0 auto;font-family: monospace;"
      v-html="userDisplay"
    >
    </div>
    <p>
      Id token
    </p>
    <p>
      expires {{ new Date(oidcIdTokenExp).toISOString() }}
    </p>
    <textarea
      readonly
      style="width:100%;max-width:640px;height: 200px;margin: 0 auto;font-family: monospace;"
      v-model="oidcIdToken"
    >
    <textarea
      readonly
      style="width:100%;max-width:640px;height: 200px;margin: 0 auto;font-family: monospace;"
      v-model="oidcAccessToken"
    >
    </textarea>

    <p>
      <button type="button" @click="reauthenticate">Reauthenticate silently</button>
    </p>

  </div>
  <p v-else-if="oidcAuthenticationIsChecked">You are not signed in</p>
  <p v-else>Silent renew is in progress...</p>
</template>

<script  lang="ts">
import { mapGetters, mapActions } from 'vuex';
import jsonMarkup from 'json-markup';

export default {
  name: 'ProfileView',
  computed: {
    ...mapGetters('AuthOIDC', [
      'oidcIsAuthenticated',
      'oidcAccessToken',
      'oidcAuthenticationIsChecked',
      'oidcUser',
      'oidcIdToken',
      'oidcIdTokenExp',
    ]),
    userDisplay() {
      return jsonMarkup(this.oidcUser);
    },
  },
  methods: {
    ...mapActions('AuthOIDC', ['authenticateOidcSilent', 'removeOidcUser']),
    reauthenticate() {
      this.authenticateOidcSilent().catch(() => this.removeOidcUser());
    },
  },
};
</script>

<style>
.json-markup {
  color: transparent;
}
.json-markup span {
  color: black;
  float: left;
}
.json-markup .json-markup-key {
  clear: left;
}
</style>
