<script setup lang="ts">
import { computed, useSlots, type Slots } from "vue";

const slots: Slots = useSlots();

const hasHero = computed(() => {
    return !!slots.hero;
});

const hasLeftSidebar = computed(() => {
    return !!slots.leftSidebar;
});
const hasRightSidebar = computed(() => {
    return !!slots.rightSidebar;
});
</script>
<template>
    <div class="w-full overflow-y-auto">
        <!-- Hero -->
        <slot name="hero"></slot>
        <div class="flex">
            <!-- Left sidebar -->
            <div v-if="hasLeftSidebar" class="w-1/4 p-4 overflow-y-auto">
                <slot name="leftSidebar"></slot>
            </div>
            <!-- content -->
            <div class="flex-1 p-4 overflow-y-auto">
                <slot name="content"></slot>
            </div>
            <!-- Right sidebar -->
            <div v-if="hasRightSidebar" class="w-1/4 p-4 overflow-y-auto">
                <slot name="rightSidebar"></slot>
            </div>
        </div>
    </div>
</template>
