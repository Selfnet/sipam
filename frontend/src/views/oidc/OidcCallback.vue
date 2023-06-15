<template>
  <div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SIPAM from '@/sipam';

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
