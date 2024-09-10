<template>
    <ul>
      <li v-for="workflow in workflows" :key="workflow.path">
        <a :href="`/workflow/${workflow.path}`">{{ workflow.workflows[0].name }}</a>
      </li>
    </ul>
  </template>
  
  <script>
  export default {
    props: {
      workflows: Array
    }
  }
  </script>