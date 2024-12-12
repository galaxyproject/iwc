<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { marked } from "marked";
import mermaid from "mermaid";

// Props
const props = defineProps({
    markdownContent: {
        type: String,
        required: true,
    },
});

// Refs
const renderedHtml = ref<string>("");

// Initialize Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
});

// Watch Markdown Content for Changes
watch(
    () => props.markdownContent,
    (newContent) => {
        renderMarkdown(newContent);
    },
    { immediate: true },
);

// Render Markdown Function
async function renderMarkdown(content: string) {
    renderedHtml.value = await marked(content);
    await nextTick();
    renderMermaidDiagrams();
}

// Render Mermaid Diagrams
function renderMermaidDiagrams() {
    const mermaidElements = document.querySelectorAll(".language-mermaid");
    mermaidElements.forEach((element) => {
        const parent = element.parentElement;
        const code = element.textContent || "";
        if (parent) {
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                mermaid.render(id, code).then((value) => (parent.innerHTML = value.svg));
                parent.classList.add("not-prose");
            } catch (e) {
                console.error("Mermaid rendering error:", e);
            }
        }
    });
}
</script>

<template>
    <div v-html="renderedHtml"></div>
</template>
