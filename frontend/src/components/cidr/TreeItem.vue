<template>
  <b-container fluid>
    <b-row :class="{bold: isFolder}">
      <b-col cols="1">
        <fai
          @click="toggle"
          v-if="isFolder"
          :icon="isOpen ? 'minus-circle': 'plus-circle'"
          class="pointer fa-lg"
        />
      </b-col>
      <b-col>
        <cidr
          :cidrID="item.id"
          v-on:cidrClicked="toggle"
        ></cidr>
      </b-col>
    </b-row>
    <b-row v-if="isFolder">
      <b-col cols=12>
        <b-collapse
          id="show-children"
          v-model="isOpen"
        >
          <b-card>
            <tree-item
              class="item"
              v-for="child in children"
              :key="child.id"
              :item="child"
              @add-item="$emit('add-item', $event)"
            ></tree-item>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
  </b-container>
</template>

<script  lang="ts">
import { mapGetters, mapActions } from 'vuex';
import CIDR from '@/components/cidr/CIDR.vue';

export default {
  name: 'tree-item',
  props: {
    item: Object,
  },
  components: {
    cidr: CIDR,
  },
  data() {
    return {
      isOpen: false,
      children: [],
      childIDs: [],
    };
  },
  computed: {
    isFolder() {
      return this.item.children && this.item.children.length;
    },
    ...mapGetters('CIDR', {
      getChildren: 'getChildrenByParentID',
    }),
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (
        mutation.type === 'CIDR/SET_CIDR'
        && mutation.payload.parent === this.item.id
        && !this.childIDs.includes(mutation.payload.id)
      ) {
        this.getSetChildren();
      } else if (mutation.type === 'CIDR/DELETE_CIDR' && this.childIDs.includes(mutation.payload)) {
        this.getSetChildren();
      }
    });
  },
  methods: {
    ...mapActions({
      fetchChildren: 'CIDR/FETCH_CHILDREN',
    }),
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
        if (this.children.length === 0) {
          this.getSetChildren();
        }
      }
    },
    getSetChildren() {
      this.fetchChildren(this.item.id).then(() => {
        this.children = this.getChildren(this.item.id);
        this.childIDs = this.children.map(child => child.id);
      });
    },
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
</script>
