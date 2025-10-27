<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { type ButtonVariantProps, buttonVariants } from "./button-variants";
import { cn } from "@/lib/utils";

interface Props extends /* @vue-ignore */ HTMLAttributes {
    variant?: ButtonVariantProps["variant"];
    size?: ButtonVariantProps["size"];
    as?: string;
}

const props = withDefaults(defineProps<Props>(), {
    as: "button",
    variant: "default",
    size: "default",
});

const delegatedProps = computed(() => {
    const { class: _, variant, size, ...delegated } = props;
    return delegated;
});
</script>

<template>
    <component :is="as" :class="cn(buttonVariants({ variant, size }), props.class)" v-bind="delegatedProps">
        <slot />
    </component>
</template>
