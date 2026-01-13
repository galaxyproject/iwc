<script setup lang="ts">
import { TabsList, type TabsListProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends TabsListProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <TabsList
        :class="cn('inline-flex items-center justify-start w-full gap-1 border-b border-ebony-clay-100', props.class)">
        <slot />
    </TabsList>
</template>
