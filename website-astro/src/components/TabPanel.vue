<script setup lang="ts">
import { ref } from "vue";

interface Tab {
    title: string;
    content: string;
}

defineProps<{
    tabs: Tab[];
}>();

const currentTab = ref(0);
</script>

<template>
    <div>
        <div class="flex justify-center">
            <button
                v-for="(tab, index) in tabs"
                :key="index"
                :class="[
                    'px-4 py-2 rounded-t-lg border border-b-0',
                    currentTab === index
                        ? 'bg-chicago-50 border-gray-300'
                        : 'bg-white hover:bg-chicago-50 border-gray-200',
                ]"
                @click="currentTab = index">
                {{ tab.title }}
            </button>
        </div>
        <div class="bg-chicago-50 rounded-b-lg p-6 border border-gray-300">
            <p class="text-gray-700">{{ tabs[currentTab].content }}</p>
        </div>
    </div>
</template>
