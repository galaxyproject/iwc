<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { type BadgeVariantProps, badgeVariants } from "./badge-variants";
import { cn } from "@/lib/utils";

interface Props extends /* @vue-ignore */ HTMLAttributes {
    variant?: BadgeVariantProps["variant"];
}

const props = withDefaults(defineProps<Props>(), {
    variant: "default",
});
</script>

<template>
    <div :class="cn(badgeVariants({ variant }), props.class)">
        <slot />
    </div>
</template>
