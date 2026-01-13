<script setup lang="ts">
import { ComboboxTrigger, type ComboboxTriggerProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ComboboxTriggerProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <ComboboxTrigger v-bind="props" :class="cn('cursor-pointer', props.class)">
        <slot />
    </ComboboxTrigger>
</template>
