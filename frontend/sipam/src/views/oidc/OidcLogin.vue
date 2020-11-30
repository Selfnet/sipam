<template>
  <div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OidcLogin',
  methods: {
  },
  created() {
    axios.defaults.headers.Authorization = `OPENID ${this.$store.getters['AuthOIDC/oidcIdToken']}`;
    this.$router.push('/home');
  },
};
</script>
