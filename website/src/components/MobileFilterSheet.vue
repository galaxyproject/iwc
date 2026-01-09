<script setup lang="ts">
import { ref, computed } from "vue";
import {
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "radix-vue";
import { Filter, X } from "lucide-vue-next";
import { useFilterState } from "../composables/useFilterState";
import type { SearchIndexEntry } from "../models/workflow";

const props = defineProps<{
    workflows: SearchIndexEntry[];
}>();

const isOpen = ref(false);

const { selected, collectionCounts, sortedCollections, handleFilterClick } = useFilterState({
    workflows: props.workflows,
    closeOnSelect: () => {
        isOpen.value = false;
    },
});

const buttonLabel = computed(() => selected.value[0] ?? "Filter by category");
</script>

<template>
    <div class="block md:hidden mb-4">
        <DialogRoot v-model:open="isOpen">
            <DialogTrigger as-child>
                <button
                    class="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
                    :class="{
                        'bg-hokey-pokey-500/10 text-hokey-pokey-600 border-hokey-pokey-500': selected.length > 0,
                        'bg-white text-chicago-600 border-chicago-300 hover:bg-chicago-50': selected.length === 0,
                    }">
                    <Filter class="w-4 h-4" />
                    <span>{{ buttonLabel }}</span>
                </button>
            </DialogTrigger>

            <DialogPortal>
                <DialogOverlay
                    class="fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DialogContent
                    class="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[70vh] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
                    <!-- Handle bar -->
                    <div class="flex justify-center pt-3 pb-1">
                        <div class="w-10 h-1 bg-chicago-300 rounded-full"></div>
                    </div>

                    <!-- Header -->
                    <div class="flex items-center justify-between px-4 py-2 border-b border-chicago-200">
                        <DialogTitle class="text-lg font-semibold text-chicago-800">Categories</DialogTitle>
                        <DialogClose as-child>
                            <button
                                class="p-2 rounded-full hover:bg-chicago-100 text-chicago-500 transition-colors"
                                aria-label="Close">
                                <X class="w-5 h-5" />
                            </button>
                        </DialogClose>
                    </div>

                    <!-- Category list -->
                    <div class="overflow-y-auto max-h-[calc(70vh-100px)] p-4">
                        <nav class="flex flex-col gap-1">
                            <button
                                v-for="filter in sortedCollections"
                                :key="filter"
                                class="group flex items-center justify-between px-3 py-3 rounded-lg text-sm text-left transition-all duration-150 border-l-4 w-full"
                                :class="{
                                    'bg-hokey-pokey-500/10 text-hokey-pokey-600 border-hokey-pokey-500':
                                        selected.includes(filter),
                                    'text-chicago-600 hover:bg-chicago-100 hover:text-chicago-800 border-transparent':
                                        !selected.includes(filter),
                                }"
                                @click="handleFilterClick(filter)">
                                <span>{{ filter }}</span>
                                <span
                                    class="text-xs tabular-nums transition-colors ml-2 shrink-0"
                                    :class="{
                                        'text-hokey-pokey-500': selected.includes(filter),
                                        'text-chicago-400 group-hover:text-chicago-500': !selected.includes(filter),
                                    }">
                                    {{ collectionCounts[filter] || 0 }}
                                </span>
                            </button>
                        </nav>
                    </div>
                </DialogContent>
            </DialogPortal>
        </DialogRoot>
    </div>
</template>
