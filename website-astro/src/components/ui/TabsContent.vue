<script setup lang="ts">
import { TabsContent, type TabsContentProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface Props extends TabsContentProps {
    class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
    <TabsContent
        v-bind="props"
        :class="
            cn(
                'mt-6',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-of-many-700 focus-visible:ring-offset-2',
                props.class
            )
        "
    >
        <slot />
    </TabsContent>
</template>
