<script setup lang="ts">
import { TabsRoot, type TabsRootProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface Props extends TabsRootProps {
    class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
    <TabsRoot v-bind="props" :class="cn('w-full', props.class)">
        <slot />
    </TabsRoot>
</template>
