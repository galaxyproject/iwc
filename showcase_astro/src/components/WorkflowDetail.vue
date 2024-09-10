<template>
    <div>
      <h1>{{ workflow.workflows[0].name }}</h1>
      <p><strong>Version:</strong> {{ workflow.version }}</p>
      <div v-html="workflow.readme"></div>
      <h2>Authors</h2>
      <ul>
        <li v-for="author in workflow.workflows[0].authors" :key="author.name">
          <a :href="author.orcid ? `https://orcid.org/${author.orcid}` : author.url">{{ author.name }}</a>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      workflow: Object
    }
  }
  </script>
  