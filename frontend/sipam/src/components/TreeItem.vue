<template>
  <div>
    <div :class="{bold: isFolder}">
      <fai
        @click="toggle"
        v-if="isFolder"
        :icon="isOpen ? 'minus-circle': 'plus-circle'"
        class="pointer"
      />
      <cidr
        :cidrID="item.id"
        v-on:cidrClicked="toggle"
      ></cidr>
    </div>
    <b-list-group-item
      class="nested"
      v-show="isOpen"
      v-if="isFolder"
    >
      <tree-item
        class="item"
        v-for="child in children"
        :key="child.id"
        :item="child"
        @add-item="$emit('add-item', $event)"
      ></tree-item>
    </b-list-group-item>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import CIDR from '@/components/CIDR.vue';

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
    this.$store.subscribe((mutation) => {
      if (
        mutation.type === 'CIDR/SET_CIDR'
        && mutation.payload.parent === this.item.id
        && !this.childIDs.includes(mutation.payload.id)
      ) {
        this.getSetChildren();
      } else if (
        mutation.type === 'CIDR/DELETE_CIDR'
        && this.childIDs.includes(mutation.payload)
      ) {
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
};
</script>
<style lang="scss" scoped>
.bold {
  font-weight: bold;
}
.pointer {
  cursor: pointer;
}
</style>
