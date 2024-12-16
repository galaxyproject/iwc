<script setup lang="ts">
import { computed, useSlots } from "vue";

const slots = useSlots();

const hasLeftSidebar = computed(() => {
    return !!slots.leftSidebar;
});
const hasRightSidebar = computed(() => {
    return !!slots.rightSidebar;
});
</script>
<template>
    <div class="flex w-full">
        <!-- Left sidebar -->
        <div v-if="hasLeftSidebar" class="w-1/4 p-4 overflow-y-auto">
            <slot name="leftSidebar"></slot>
        </div>
        <!-- Left side content -->
        <div class="flex-1 p-4 overflow-y-auto">
            <slot name="content"></slot>
        </div>
        <!-- Right sidebar -->
        <div v-if="hasRightSidebar" class="w-1/4 p-4 overflow-y-auto">
            <slot name="rightSidebar"></slot>
        </div>
    </div>
</template>
