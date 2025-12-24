<script setup lang="ts">
import { ComboboxRoot, type ComboboxRootProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ComboboxRootProps {
    class?: HTMLAttributes["class"];
    filterFunction?: (items: any[], searchTerm: string) => any[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <ComboboxRoot
        :model-value="props.modelValue"
        :class="cn('w-full', props.class)"
        :filter-function="props.filterFunction"
        :display-value="(item) => item"
        v-bind="$attrs"
        @update:model-value="emit('update:modelValue', $event)">
        <slot />
    </ComboboxRoot>
</template>
