<template>
  <b-container>
    <b-list-group>
      <b-list-group-item>
        <tree-item
          class="item"
          :item="cidr"
          @make-folder="makeFolder"
          @add-item="addItem"
        />
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import Vue from 'vue';
import TreeItem from './TreeItem.vue';

export default {
  name: 'tree',
  props: {
    cidr: Object,
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
