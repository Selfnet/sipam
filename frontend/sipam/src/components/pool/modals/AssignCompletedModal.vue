<template>
  <div>
    Successfully assigned
    <ul>
      <li
        v-for="cidr in assignment.assignments"
        :key="cidr.id"
      >{{cidr.cidr}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'assign-complete-modal',
  props: {
    assignment: Object,
  },
};
</script>
