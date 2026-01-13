<script setup lang="ts">
import { computed } from "vue";

interface Author {
    name: string;
    orcid?: string;
}

const props = defineProps<{
    author: Author;
}>();

const authorUrl = computed(() => (props.author.orcid ? `https://orcid.org/${props.author.orcid}` : "#"));
</script>

<template>
    <span class="author">
        <a v-if="authorUrl !== '#'" :href="authorUrl" target="_blank" rel="noopener noreferrer" class="author-link">
            {{ author.name }}
        </a>
        <span v-else>{{ author.name }}</span>
    </span>
</template>

<style scoped>
.author-link {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted currentColor;
}

.author-link:hover {
    border-bottom-style: solid;
}
</style>
