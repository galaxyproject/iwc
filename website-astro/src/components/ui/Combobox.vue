<script setup lang="ts">
import { ComboboxRoot, type ComboboxRootProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface Props extends ComboboxRootProps {
    class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <ComboboxRoot
        :modelValue="props.modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
        :class="cn('w-full', props.class)"
        v-bind="$attrs"
    >
        <slot />
    </ComboboxRoot>
</template>
