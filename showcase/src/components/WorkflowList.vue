<template>
  <div class="grid-container">
    <template v-for="repo in repositories" :key="repo.path">
      <div v-for="workflow in repo.workflows" class="grid-item">
          <a :href="`/workflow/${repo.path}`">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{ workflow.definition.name}}
                </h5> 
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ workflow.definition.annotation }}</p>
          <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Read more
              <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
          </a>
      </div>

    </template>
  </div>
</template>

<style scoped>

.grid-container {
  @apply grid grid-cols-3 gap-4;
}

.grid-item {
  @apply p-6 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700
}
</style>

<script>


// Define getStaticPaths to generate paths for each workflow
function getStaticPaths(repos){
  const paths = repos.map((workflow) => {
    // Extract the slug from the workflow path
    const slug = workflow.path.replace('./workflows/', '');
    return { params: { slug: slug } };
  });
  return paths;
};

export default {
  props: {
    repositories: Array
  },
  mounted() {
    console.debug("List loaded: ", this.repositories);
    console.debug(getStaticPaths(this.repositories));
  }
}
</script>