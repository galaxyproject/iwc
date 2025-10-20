<script setup lang="ts">
import { TabsRoot, type TabsRootProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends TabsRootProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <TabsRoot
        :modelValue="props.modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
        :defaultValue="props.defaultValue"
        :class="cn('w-full', props.class)">
        <slot />
    </TabsRoot>
</template>
