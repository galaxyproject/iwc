<script setup lang="ts">
// Every category as a chip above the workflow list. Shown from the md breakpoint up; phones
// use MobileFilterSheet.
import { nextTick, ref, useId, watch } from "vue";
import { ChevronDown, ChevronUp } from "@lucide/vue";
import { useFilterState } from "../composables/useFilterState";
import type { SearchIndexEntry } from "../models/workflow";

const props = defineProps<{
    workflows: SearchIndexEntry[];
    /** One row that scrolls sideways, used while the toolbar is pinned to the top of the window. */
    collapsed: boolean;
    /** Show the toggle that opens the full set while the toolbar is pinned. */
    canExpand: boolean;
}>();

const emit = defineEmits<{
    /** The expand toggle was clicked. */
    toggle: [];
    /** A category was picked or cleared. */
    select: [];
}>();

const { selected, collectionCounts, sortedCollections, handleFilterClick } = useFilterState({
    workflows: props.workflows,
    closeOnSelect: () => emit("select"),
});

const row = ref<HTMLElement | null>(null);
const rowId = useId();

function clearFilter() {
    if (selected.value.length > 0) {
        handleFilterClick(selected.value[0]);
    }
}

// Keep the active chip in sight when the bar folds into a single row.
watch(
    () => props.collapsed,
    async (collapsed) => {
        await nextTick();
        const el = row.value;
        if (!el) return;
        if (!collapsed) {
            el.scrollLeft = 0;
            return;
        }
        const active = el.querySelector<HTMLElement>("[aria-pressed='true']");
        if (active) {
            el.scrollLeft = Math.max(0, active.offsetLeft - 16);
        }
    },
);

const chipBase =
    "inline-flex items-center gap-1.5 shrink-0 rounded-md border px-2.5 py-1 text-sm whitespace-nowrap transition-colors duration-200";
const chipOn = "bg-hokey-pokey-500 border-hokey-pokey-500 text-ebony-clay-950 font-medium";
const chipOff =
    "bg-white border-ebony-clay-100 text-chicago-700 hover:border-hokey-pokey-500 hover:bg-hokey-pokey-500/10";
</script>

<template>
    <div class="hidden md:flex items-start gap-2">
        <div class="relative flex-1 min-w-0">
            <nav
                :id="rowId"
                ref="row"
                aria-label="Categories"
                class="flex gap-2"
                :class="[
                    collapsed ? 'flex-nowrap overflow-x-auto chips-scroll pr-10' : 'flex-wrap',
                    // Opened from the fold: never taller than the window it is pinned to
                    { 'max-h-[50dvh] overflow-y-auto': canExpand && !collapsed },
                ]">
                <button
                    :class="[chipBase, selected.length === 0 ? chipOn : chipOff]"
                    :aria-pressed="selected.length === 0"
                    @click="clearFilter">
                    All
                    <span class="text-xs tabular-nums opacity-70">{{ workflows.length }}</span>
                </button>
                <button
                    v-for="filter in sortedCollections"
                    :key="filter"
                    :class="[chipBase, selected.includes(filter) ? chipOn : chipOff]"
                    :aria-pressed="selected.includes(filter)"
                    @click="handleFilterClick(filter)">
                    {{ filter }}
                    <span class="text-xs tabular-nums opacity-70">{{ collectionCounts[filter] || 0 }}</span>
                </button>
            </nav>
            <div
                v-if="collapsed"
                class="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-chicago-50 to-transparent" />
        </div>

        <button
            v-if="canExpand"
            class="inline-flex items-center gap-1 shrink-0 rounded-md border border-ebony-clay-200 bg-white px-2.5 py-1 text-sm text-ebony-clay-800 hover:bg-ebony-clay-50 transition-colors duration-200"
            :aria-expanded="!collapsed"
            :aria-controls="rowId"
            @click="emit('toggle')">
            <span>All categories</span>
            <component :is="collapsed ? ChevronDown : ChevronUp" :size="14" />
        </button>
    </div>
</template>

<style scoped>
.chips-scroll {
    scrollbar-width: none;
}
.chips-scroll::-webkit-scrollbar {
    display: none;
}
</style>
