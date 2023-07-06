<template>
  <b-nav-item-dropdown v-bind:text="$t('GENERAL.LANGUAGE.CHANGE_LANGUAGE')">
    <b-dropdown-item v-on:click="changeLanguage('en')">
      <img
        src="../assets/imgs/flags/en.svg"
        class="flag"
        alt="English Flag"
      />
      {{$t("GENERAL.LANGUAGE.ENGLISH")}}
    </b-dropdown-item>
    <b-dropdown-item
      id="german"
      v-on:click="changeLanguage('de')"
    >
      <img
        src="../assets/imgs/flags/de.svg"
        class="flag"
        alt="German Flag"
      />
      {{$t("GENERAL.LANGUAGE.GERMAN")}}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script  lang="ts">
import Language from '@/utils/Language.ts';

export default {
  name: 'LanguagePicker',
  methods: {
    changeLanguage(locale) {
      Language.changeLocale(locale);
    },
  },
};
</script>

<style scoped lang="scss">
.flag {
  margin-bottom: 3px;
  margin-right: 6px;
  width: 24px;
  height: 24px;
}
</style>
