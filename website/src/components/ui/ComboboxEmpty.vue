<script setup lang="ts">
import { ComboboxEmpty, type ComboboxEmptyProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ComboboxEmptyProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <ComboboxEmpty v-bind="props" :class="cn('py-6 text-center text-sm text-gray-500', props.class)">
        <slot />
    </ComboboxEmpty>
</template>
