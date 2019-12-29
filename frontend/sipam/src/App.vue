<template>
  <div id="app">
    <b-navbar
      toggleable="lg"
      type="light"
      sticky
      variant="light"
    >
      <b-navbar-brand to="/home">
        <img
          src="./assets/imgs/logo.svg"
          alt="Selfnet Logo"
          height="32"
        /> IPAM
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-navbar-nav>
          <b-nav-item to="/home">Home</b-nav-item>
          <b-nav-item to="/pools">Pools</b-nav-item>
          <b-nav-item to="/cidrs">CIDR</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              :placeholder="$t('GENERAL.SEARCH.PLACEHOLDER')"
              v-model=query
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="submit"
            >{{$t("GENERAL.BUTTON.SEARCH")}}</b-button>
          </b-nav-form>
          <language-picker />
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{ user }}</em>
            </template>
            <b-dropdown-item to="/">{{$t("GENERAL.LOGIN.LABEL")}}</b-dropdown-item>
            <b-dropdown-item to="/logout">{{$t("GENERAL.LOGOUT.LABEL")}}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container id="content">
      <router-view />
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import LanguagePicker from './components/LanguagePicker.vue';

export default {
  components: {
    LanguagePicker,
  },
  data() {
    return {
      user: 'User',
    };
  },
  computed: {
    ...mapGetters('Search', {
      getQuery: 'query',
    }),
    query: {
      get() {
        return this.getQuery;
      },
      set(value) {
        if (value.length >= 3 || value.length === 0) {
          this.$store.commit('Search/SET_QUERY', value);
        }
      },
    },
  },
};
</script>


<style lang="scss">
@import "~bootstrap";
@import "~bootstrap-vue";
.btn-primary {
  color: #000000;
  background-color: #ffffff;
  border-color: #ff5a17 !important;
  float: right;
}
.btn-primary:hover {
  color: #000000;
  background-color: #fefefe;
  box-shadow: 0 0 5px #ff5a17 !important;
}

.form-control {
  border-color: #aaaaaa;
}

.form-control:focus,
.form-control:active {
  border-color: #ff5a17;
  outline: 0;
  box-shadow: 0 0 5px #ff5a17 !important;
}
#site-container {
  margin-top: 90px;
  background-color: rgba(
    239,
    239,
    239,
    0.9
  ); /*Background of the main containers*/

  border-radius: 10px;
  border-style: solid;
  border-width: 1px;

  margin-bottom: 50px;

  padding-left: 40px;
  padding-right: 50px;
  padding-bottom: 20px;
  font-size: medium;
}

#main_image {
  width: 60%;
  padding-bottom: 40px;
  padding-top: 50px;
  margin-left: auto;
  margin-right: auto;
}

.midrule {
  width: 50%;
}

hr {
  border-color: black;
}

.heading {
  padding-top: 30px;
  padding-bottom: 40px;
}

.heading h2 {
  font-size: 60px;
}

.row a,
.row a:hover {
  color: black;
}

.bigbutton img {
  height: 100px;
  margin-top: 40px;
  margin-bottom: 30px;
}

.bigbutton {
  font-size: x-large;
  min-height: 240px;
}

.bigbutton:hover {
  box-shadow: 0 0 5px #ff5a17 !important;
  border-color: #ff5a17 !important;
}

.introduction {
  padding-bottom: 50px;
}

footer {
  text-align: center;
  height: 70px;
  color: white;
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 30px;
  font-size: 16px;
  text-shadow: 0 0 8px black;
  width: 100%;
}

footer a,
footer a:visited,
footer a:active,
footer a:focus {
  color: white;
}

footer a:hover {
  color: #ff5a17 !important;
  text-shadow: none;
}

a,
a:visited {
  color: #ff5a17;
  text-decoration: none !important;
}

a:hover,
a:active {
  color: orange !important;
}

a:hover .bigbutton,
a:active .bigbutton,
a:visited .bigbutton,
a:focus .bigbutton {
  color: black !important;
}

/* navbar */

@font-face {
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 400;
  src: local("Source Sans Pro"), local("SourceSansPro-Regular"),
    url(./assets/fonts/source-sans-pro.ttf) format("truetype");
}

@font-face {
  font-family: "Pompiere";
  font-style: normal;
  font-weight: 400;
  src: local("Pompiere "), local("Pompiere-Regular"),
    url(./assets/fonts/pompiere.ttf) format("truetype");
}

li.dropdown {
  list-style: none;
}

.navbar-static-top {
  margin-bottom: -20px;
  color: #ff0000;
}

#nav_head {
  font-family: "Pompiere", cursive;
  font-variant: small-caps;
  font-size: 23px !important;
}

#nav_bar {
  background-color: #efefef;
  box-shadow: 0px 0px 20px #4d4d4d;
  font-family: "Source Sans Pro", sans-serif;

  z-index: 9000;
}

#selfnet_fahne {
  position: absolute;
  top: -12px;
  z-index: 9001;
}

#selfnet_fahne_wrapper {
  width: 77px;
}

.breadcrumbs {
  padding-top: 20px;
}
textarea {
  width: 100%;
  resize: none;
}
textarea:focus {
  border-color: #ff5a17;
  outline: 0;
  box-shadow: 0 0 5px #ff5a17 !important;
}
</style>
