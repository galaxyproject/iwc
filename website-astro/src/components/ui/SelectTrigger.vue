<script setup lang="ts">
import { SelectTrigger, type SelectTriggerProps } from "radix-vue";
import { ChevronDown } from "lucide-vue-next";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends SelectTriggerProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <SelectTrigger
        v-bind="props"
        :class="
            cn(
                'flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
                'ring-offset-white placeholder:text-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-bay-of-many-700 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'data-[placeholder]:text-gray-500',
                props.class,
            )
        ">
        <slot />
        <ChevronDown class="h-4 w-4 opacity-50" />
    </SelectTrigger>
</template>
