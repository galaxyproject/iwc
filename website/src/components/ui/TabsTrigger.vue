<script setup lang="ts">
import { TabsTrigger, type TabsTriggerProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends TabsTriggerProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <TabsTrigger
        v-bind="props"
        :class="
            cn(
                'px-4 py-2 font-medium text-sm rounded-md transition-all cursor-pointer',
                'text-chicago-600 hover:text-ebony-clay-900',
                'data-[state=active]:bg-white data-[state=active]:text-ebony-clay-900 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-hokey-pokey-500',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-of-many-700 focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                props.class,
            )
        ">
        <slot />
    </TabsTrigger>
</template>
