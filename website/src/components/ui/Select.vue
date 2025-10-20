<script setup lang="ts">
import { SelectRoot, type SelectRootProps } from "radix-vue";

interface Props extends SelectRootProps {}

const props = defineProps<Props>();
</script>

<template>
    <SelectRoot v-bind="props">
        <slot />
    </SelectRoot>
</template>
