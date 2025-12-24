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
        :model-value="props.modelValue"
        :default-value="props.defaultValue"
        :class="cn('w-full', props.class)"
        @update:model-value="emit('update:modelValue', $event)">
        <slot />
    </TabsRoot>
</template>
