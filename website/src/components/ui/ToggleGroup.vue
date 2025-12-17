<script setup lang="ts">
import { ToggleGroupRoot, type ToggleGroupRootProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ToggleGroupRootProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <ToggleGroupRoot
        :modelValue="props.modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
        :type="props.type"
        :class="cn('inline-flex rounded-lg border border-gray-300 bg-white p-1', props.class)">
        <slot />
    </ToggleGroupRoot>
</template>
