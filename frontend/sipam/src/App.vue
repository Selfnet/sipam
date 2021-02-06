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
        <b-navbar-nav v-if="hasAccess">
          <b-nav-item to="/home">Home</b-nav-item>
          <b-nav-item to="/pools">Pools</b-nav-item>
          <b-nav-item to="/cidrs">CIDR</b-nav-item>
          <b-nav-item to="/tokens">Tokens</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item to="/profile">Profile</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!--
            This onsubmit return false; prevents from accepting submit and enter functions.
            This currently bricks the frontend
          -->
          <b-nav-form
            onsubmit="return false;"
          >
            <b-form-input
              size="sm"
              class="mr-sm-2"
              :placeholder="$t('GENERAL.SEARCH.PLACEHOLDER')"
              v-model=query
            ></b-form-input>
            <b-button
              size="sm"
              v-show="false"
              class="my-2 my-sm-0"
              type="submit"
            >{{$t("GENERAL.BUTTON.SEARCH")}}</b-button>
          </b-nav-form>
          <language-picker />
          <b-nav-item-dropdown v-if="hasAccess" right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{ userDisplay }}</em>
            </template>
            <b-dropdown-item
              @click=logout
            >{{$t("GENERAL.LOGOUT.LABEL")}}</b-dropdown-item>
            <b-dropdown-item
              to="/profile"
            >{{$t("GENERAL.PROFILE.LABEL")}}</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-button v-else to="/login">{{$t("GENERAL.LOGIN.LABEL")}}</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid id="site-container">
      <router-view />
    </b-container>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import GenericAuth from '@/store/modules/GenericAuth';
import LanguagePicker from './components/LanguagePicker.vue';
import sipam from './sipam';

export default {
  components: {
    LanguagePicker,
  },
  computed: {
    ...mapGetters(
      'AuthOIDC', {
        user: 'oidcUser',
      },
    ),
    ...mapGetters(
      'Search', {
        getQuery: 'query',
      },
    ),
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
    ...mapGetters('AuthOIDC', [
      'oidcIsAuthenticated',
    ]),
    userDisplay() {
      if (this.user && this.user.preferred_username) {
        return this.user.preferred_username;
      }
      return GenericAuth.emptyState.username;
    },
    hasAccess() {
      return this.oidcIsAuthenticated || this.getLoggedIn();
    },
  },
  methods: {
    ...mapGetters('Auth', {
      getLoggedIn: 'isAuthenticated',
    }),
    ...mapActions({
      authLogout: 'Auth/LOGOUT',
      removeOidcUser: 'AuthOIDC/removeOidcUser',
      authenticateOidcPopup: 'AuthOIDC/authenticateOidcPopup',
    }),
    userLoaded(user) {
      console.log('I am listening to the user loaded event in vuex-oidc', e.detail);
    },
    oidcError(e) {
      console.log('I am listening to the oidc oidcError event in vuex-oidc', e.detail);
    },
    automaticSilentRenewError(e) {
      console.log('I am listening to the automaticSilentRenewError event in vuex-oidc', e.detail);
    },
    signOut() {
      this.removeOidcUser().then(() => {
        this.$router.push('/');
      });
    },
    logout() {
      if (this.config.oidc) {
        this.oidcLogout();
      } else {
        this.authLogout();
      }
    },
    oidcLogout() {
      this.removeOidcUser().then(() => {
        this.$router.push('/');
      });
    },
  },
  mounted() {
    window.addEventListener('vuexoidc:oidcError', this.oidcError);
    window.addEventListener('vuexoidc:automaticSilentRenewError', this.automaticSilentRenewError);
  },
  destroyed() {
    window.removeEventListener('vuexoidc:oidcError', this.oidcError);
    window.removeEventListener('vuexoidc:automaticSilentRenewError', this.automaticSilentRenewError);
  },
};
</script>


<style lang="scss">
@import "@/assets/styles/custom.scss";

#site-container {
  margin-top: 10px;
  margin-bottom: 50px;
  padding-top: 10px;
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
  border-color: $black;
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
  color: $black;
}

.img {
  height: 100px;
  margin-top: 40px;
  margin-bottom: 30px;
}

.introduction {
  padding-bottom: 50px;
}

footer {
  text-align: center;
  height: 70px;
  color: $white;
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 30px;
  font-size: 16px;
  text-shadow: 0 0 8px $black;
  width: 100%;
}

footer a,
footer a:visited,
footer a:active,
footer a:focus {
  color: $white;
}


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

.bold {
  font-weight: bold;
}
.pointer {
  cursor: pointer;
}

</style>
