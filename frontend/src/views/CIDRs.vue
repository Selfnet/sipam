<template>
  <div>
    <b-row>
      <b-col>
        <h1><span class="h1">CIDRs</span></h1>
      </b-col>
    </b-row>
    <b-row class="text-center fixed-bottom">
      <b-col
        offset-xl="10"
        offset-lg="9"
        offset-md="9"
        offset-sm="8"
        offset="7"
      >
        <b-button
          pill
          size="lg"
          variant="primary"
          v-b-modal.create-cidr-modal
          class="create-button"
        >
          <strong>
            <fai icon="plus-circle" />
            CIDR
          </strong>
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols=12>
        <b-list-group>
          <b-list-group-item>
            <b-container fluid>
              <b-row class="bold headline">
                <b-col cols="1">
                </b-col>
                <b-col>
                  <b-container fluid>
                    <b-row>
                      <b-col>
                        <strong>{{$t("GENERAL.CIDR.FLAG")}}</strong>
                      </b-col>
                      <b-col>
                        <strong>{{$t("GENERAL.CIDR.PREFIX")}}</strong>
                      </b-col>
                      <b-col offset="2">
                        <strong>FQDN</strong>
                      </b-col>
                      <b-col>
                        <strong class="description">{{$t("GENERAL.CIDR.DESCRIPTION")}}</strong>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </b-row>
            </b-container>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <tree
      v-for="cidr in cidrs"
      v-bind:item="cidr"
      :key="cidr.id"
      :cidr="cidr"
    >
    </tree>
    <cidr-form :edit="false" />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Tree from '@/components/cidr/Tree.vue';
import CIDRForm from '@/components/cidr/forms/CIDRForm.vue';

export default {
  components: {
    Tree,
    'cidr-form': CIDRForm,
  },
  data() {
    return {
      loading: true,
      cidrs: [],
    };
  },
  methods: {
    ...mapGetters('CIDR', {
      getCIDRs: 'cidrs',
    }),
    ...mapActions({
      fetchCIDRs: 'CIDR/FETCH_CIDRS',
      searchCIDR: 'CIDR/SEARCH_CIDR',
    }),
  },
  created() {
    this.fetchCIDRs().then(() => {
      this.cidrs = this.getCIDRs();
    });
    // eslint-disable-next-line no-unused-vars
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'Search/SET_QUERY' && mutation.payload.length > 0) {
        this.searchCIDR(mutation.payload).then(() => {
          this.cidrs = this.getCIDRs();
        });
      } else if (mutation.type === 'Search/SET_QUERY' && mutation.payload.length === 0) {
        this.fetchCIDRs().then(() => {
          this.cidrs = this.getCIDRs();
        });
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.description {
  float: right;
}
.headline {
  margin-bottom: 10px;
  padding-bottom: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
