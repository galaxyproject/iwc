<template>
  <h2>Workflows</h2>
  <div class="grid-container">
    <div class="grid-item" v-for="workflow in workflows" :key="workflow.path">
      <a :href="`/workflow/${workflow.path}`">{{ workflow.workflows[0].name }}</a>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
</style>

<script>
export default {
  props: {
    workflows: Array
  },
  mounted() {
    console.debug("hello");
    console.debug(this.workflows);
  }
}
</script>