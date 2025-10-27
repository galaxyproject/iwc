<script setup lang="ts">
import { SelectContent, SelectPortal, SelectViewport, type SelectContentProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends SelectContentProps {
    class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
    position: "popper",
});
</script>

<template>
    <SelectPortal>
        <SelectContent
            v-bind="props"
            :class="
                cn(
                    'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-md',
                    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    position === 'popper' &&
                        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                    props.class,
                )
            ">
            <SelectViewport
                :class="
                    cn(
                        'p-1',
                        position === 'popper' &&
                            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
                    )
                ">
                <slot />
            </SelectViewport>
        </SelectContent>
    </SelectPortal>
</template>
