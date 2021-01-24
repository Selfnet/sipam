<template>
  <div>
  </div>
</template>

<script>
import SIPAM from '@/sipam';
import { mapActions } from 'vuex';

export default {
  name: 'OidcCallback',
  methods: {
    ...mapActions('AuthOIDC', ['oidcSignInCallback']),
  },
  created() {
    this.oidcSignInCallback()
      .then((redirectPath) => {
        this.$router.push(redirectPath);
      })
      .catch((err) => {
        this.$router.push('/oidc-callback-error'); // Handle errors any way you want
      });
  },
};
</script>
