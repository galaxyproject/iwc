<script setup lang="ts">
import { ComboboxContent, type ComboboxContentProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ComboboxContentProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <ComboboxContent
        v-bind="props"
        :class="
            cn(
                'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-md',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                props.class,
            )
        ">
        <slot />
    </ComboboxContent>
</template>
