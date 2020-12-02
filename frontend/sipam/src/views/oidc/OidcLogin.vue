<template>
  <div>
  </div>
</template>

<script>
import SIPAM from '@/sipam';

export default {
  name: 'OidcLogin',
  methods: {
  },
  created() {
    SIPAM.api.setSecurityData(this.$store.getters['AuthOIDC/oidcIdToken']);
    this.$router.push('/home');
  },
};
</script>
