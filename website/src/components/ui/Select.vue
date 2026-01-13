<script setup lang="ts">
import { SelectRoot, type SelectRootProps } from "radix-vue";

const props = defineProps<SelectRootProps>();
</script>

<template>
    <SelectRoot v-bind="props">
        <slot />
    </SelectRoot>
</template>
