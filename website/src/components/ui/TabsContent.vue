<script setup lang="ts">
import { TabsContent, type TabsContentProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props extends TabsContentProps {
    class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
    <TabsContent
        v-bind="props"
        :class="
            cn(
                'mt-6 tab-content-transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-of-many-700 focus-visible:ring-offset-2',
                props.class,
            )
        ">
        <slot />
    </TabsContent>
</template>

<style scoped>
.tab-content-transition[data-state="active"] {
    animation: fade-in 150ms ease-out;
}

.tab-content-transition[data-state="inactive"] {
    animation: fade-out 100ms ease-in;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fade-out {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
