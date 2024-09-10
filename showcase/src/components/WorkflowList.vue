<template>
  <div class="grid-container">
    <template v-for="repo in repositories" :key="repo.path">
      <div v-for="workflow in repo.workflows" class="grid-item">
        <a :href="`/workflow/${repo.path}`">{{ workflow.definition.name}}</a>
        <p>{{ workflow.definition.annotation }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.grid-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>

<script>
export default {
  props: {
    repositories: Array
  },
  mounted() {
    console.debug("List loaded: ", this.repositories);
  }
}
</script>