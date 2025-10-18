<script setup lang="ts">
import { TabsTrigger, type TabsTriggerProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface Props extends TabsTriggerProps {
    class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
    <TabsTrigger
        v-bind="props"
        :class="
            cn(
                'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'data-[state=active]:border-bay-of-many-700 data-[state=active]:text-bay-of-many-700',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-of-many-700 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                props.class
            )
        "
    >
        <slot />
    </TabsTrigger>
</template>
