<script setup lang="ts">
import { ComboboxInput, type ComboboxInputProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ComboboxInputProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <ComboboxInput
        v-bind="props"
        :class="
            cn(
                'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
                'placeholder:text-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-bay-of-many-700 focus:border-transparent',
                'disabled:cursor-not-allowed disabled:opacity-50',
                props.class,
            )
        ">
        <slot />
    </ComboboxInput>
</template>
