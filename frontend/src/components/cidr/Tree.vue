<template>
  <b-row>
    <b-col cols=12>
      <b-list-group>
        <b-list-group-item>
        <tree-item
          class="item"
          :item="cidr"
          :pools="pools"
          @make-folder="makeFolder"
          @add-item="addItem"
        />
        </b-list-group-item>
      </b-list-group>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue';
import TreeItem from './TreeItem.vue';

export default {
  name: 'TreeComponent',
  props: {
    cidr: Object,
    pools: Array
  },
  components: {
    TreeItem,
  },
  methods: {
    makeFolder(item) {
      Vue.set(item, 'children', []);
      this.addItem(item);
    },
    addItem(item) {
      item.children.push({
        name: 'new stuff',
      });
    },
  },
};
</script>

<style lang="scss">
</style>
