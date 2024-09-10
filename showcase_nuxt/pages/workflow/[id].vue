<script setup lang="ts">
import { useRoute } from 'vue-router'

const workflow = ref(null);
const route = useRoute();
const { data:workflows} = await useFetch('/workflows.json');
workflow.value = workflows.find(w => w.id === route.params.id);

</script>
<template>
    <div v-if="workflow">
      <h1>{{ workflow.title }}</h1>
      <p>{{ workflow.description }}</p>
    </div>
  </template>