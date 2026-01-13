<script setup lang="ts">
import { ComboboxAnchor, type ComboboxAnchorProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ComboboxAnchorProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <ComboboxAnchor v-bind="props" :class="cn('relative', props.class)">
        <slot />
    </ComboboxAnchor>
</template>
