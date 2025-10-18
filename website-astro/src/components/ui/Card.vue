<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <div :class="cn('rounded-lg border bg-white text-gray-950 shadow', props.class)">
        <slot />
    </div>
</template>
