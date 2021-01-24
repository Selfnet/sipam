<template>
  <div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'OidcCallbackPopup',
  methods: {
    ...mapActions('AuthOIDC', ['oidcSignInPopupCallback']),
  },
  created() {
    this.oidcSignInPopupCallback().catch((err) => {
      console.error(err); // Handle errors any way you want
    });
  },
};
</script>
