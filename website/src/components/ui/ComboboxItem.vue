<script setup lang="ts">
import { ComboboxItem, type ComboboxItemProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ComboboxItemProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <ComboboxItem
        v-bind="props"
        :class="
            cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none',
                'hover:bg-gray-100 hover:text-gray-900',
                'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                props.class,
            )
        ">
        <slot />
    </ComboboxItem>
</template>
