<script setup lang="ts">
import { SelectItem, SelectItemIndicator, SelectItemText, type SelectItemProps } from "radix-vue";
import { Check } from "lucide-vue-next";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends SelectItemProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <SelectItem
        v-bind="props"
        :class="
            cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
                'focus:bg-gray-100 focus:text-gray-900',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                props.class,
            )
        ">
        <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <SelectItemIndicator>
                <Check class="h-4 w-4" />
            </SelectItemIndicator>
        </span>
        <SelectItemText>
            <slot />
        </SelectItemText>
    </SelectItem>
</template>
