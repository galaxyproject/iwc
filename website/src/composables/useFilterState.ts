import { computed, onMounted, ref } from "vue";
import { useStore } from "@nanostores/vue";
import { selectedFilters, toggleFilter, collectionToSlug, setFilterFromUrl } from "../stores/workflowStore";
import type { SearchIndexEntry } from "../models/workflow";

export interface FilterStateOptions {
    workflows: SearchIndexEntry[];
    closeOnSelect?: () => void;
}

export function useFilterState(options: FilterStateOptions) {
    const { workflows, closeOnSelect } = options;

    const storeSelected = useStore(selectedFilters);

    // Use local ref to avoid hydration mismatch - starts empty like SSR
    const selected = ref<string[]>([]);
    const isHydrated = ref(false);

    // Compute collections from workflows
    const collections = computed(() => {
        const collectionSet = new Set<string>();
        for (const w of workflows) {
            for (const c of w.collections) {
                collectionSet.add(c);
            }
        }
        return Array.from(collectionSet).sort();
    });

    // Count workflows per collection
    const collectionCounts = computed(() => {
        const counts: Record<string, number> = {};
        for (const w of workflows) {
            for (const c of w.collections) {
                counts[c] = (counts[c] || 0) + 1;
            }
        }
        return counts;
    });

    // Sort collections by workflow count (descending)
    const sortedCollections = computed(() => {
        return [...collections.value].sort((a, b) => {
            return (collectionCounts.value[b] || 0) - (collectionCounts.value[a] || 0);
        });
    });

    onMounted(() => {
        setFilterFromUrl();
        selected.value = [...storeSelected.value];
        isHydrated.value = true;
    });

    // Keep local ref in sync with store changes (only after hydration)
    selectedFilters.subscribe((value) => {
        if (isHydrated.value) {
            selected.value = [...value];
        }
    });

    function handleFilterClick(filter: string): void {
        const currentPath = window.location.pathname;

        if (currentPath === "/") {
            const wasSelected = selected.value.includes(filter);
            toggleFilter(filter);

            const params = new URLSearchParams(window.location.search);
            if (wasSelected) {
                params.delete("filter");
            } else {
                params.set("filter", filter);
            }

            const newUrl = params.toString() ? `?${params.toString()}` : "/";
            window.history.pushState({}, "", newUrl);
        } else {
            window.location.href = `/collection/${collectionToSlug(filter)}`;
        }

        closeOnSelect?.();
    }

    return {
        selected,
        collections,
        collectionCounts,
        sortedCollections,
        handleFilterClick,
    };
}
