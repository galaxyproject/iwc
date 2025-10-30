<script setup lang="ts">
import { ref } from "vue";
import { Copy, Check } from "lucide-vue-next";

const props = defineProps<{
    code: string;
    language?: string;
}>();

const copied = ref(false);

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(props.code);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch (err) {
        console.error("Failed to copy text: ", err);
    }
}
</script>

<template>
    <div class="relative group max-w-full">
        <button
            @click="copyToClipboard"
            class="absolute right-2 top-2 z-10 flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-white border border-gray-500 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
            :aria-label="copied ? 'Copied' : 'Copy to clipboard'">
            <Copy v-if="!copied" :size="14" />
            <Check v-else :size="14" />
            <span v-if="!copied">Copy</span>
            <span v-else>Copied!</span>
        </button>
        <pre
            class="p-3 pr-16 lg:pr-20 rounded overflow-x-auto bg-gray-800 text-gray-100 text-sm shadow-inner"><code>{{ code }}</code></pre>
    </div>
</template>
