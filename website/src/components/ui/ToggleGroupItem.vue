<script setup lang="ts">
import { ToggleGroupItem, type ToggleGroupItemProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends ToggleGroupItemProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <ToggleGroupItem
        :value="props.value"
        :class="
            cn(
                'inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                'hover:bg-gray-100 hover:text-gray-900',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950',
                'disabled:pointer-events-none disabled:opacity-50',
                'data-[state=on]:bg-hokey-pokey-600 data-[state=on]:text-white data-[state=on]:shadow',
                props.class,
            )
        ">
        <slot />
    </ToggleGroupItem>
</template>
