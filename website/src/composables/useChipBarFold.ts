import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useEventListener, useResizeObserver } from "@vueuse/core";

/**
 * Folds the category chip bar into one row while the toolbar it sits in is pinned to the top of
 * the window.
 *
 * At its place in the page the bar shows every chip, wrapped over a few rows. Once the workflow
 * list has scrolled under the pinned toolbar the bar folds, so it doesn't cover the list. The
 * height it gives up is returned as `spacerHeight` for an element below the toolbar, which keeps
 * the list where it was and so stops the fold from moving the page.
 *
 * @param sentinel - Zero-height element right above the toolbar, marking its place in the page.
 * @param chips - Element wrapping the chips. It has no height on small screens, where the bar is
 *   hidden and never folds.
 */
export function useChipBarFold(sentinel: Ref<HTMLElement | null>, chips: Ref<HTMLElement | null>) {
    // How far the toolbar's place in the page has scrolled above the top of the window.
    const depth = ref(0);
    const fullHeight = ref(0);
    const rowHeight = ref(0);
    const expanded = ref(false);

    const foldHeight = computed(() => Math.max(0, fullHeight.value - rowHeight.value));
    // The list only reaches the bar's first row once it has scrolled past the rows that fold away.
    const pastFold = computed(() => foldHeight.value > 0 && depth.value > foldHeight.value);
    const collapsed = computed(() => pastFold.value && !expanded.value);

    function updateDepth() {
        depth.value = sentinel.value ? -sentinel.value.getBoundingClientRect().top : 0;
    }

    useEventListener("scroll", updateDepth, { passive: true });
    useEventListener("resize", updateDepth, { passive: true });
    onMounted(updateDepth);

    useResizeObserver(chips, () => {
        const el = chips.value;
        if (!el) return;
        if (el.offsetHeight === 0) {
            // Hidden, e.g. the window was narrowed below md: there is nothing to fold or make up for.
            fullHeight.value = 0;
            rowHeight.value = 0;
            return;
        }
        rowHeight.value = el.querySelector("button")?.offsetHeight ?? 0;
        // Read the full height only at rest. Folded, the bar is one row high, and opened from the
        // fold it shares its width with the toggle and may wrap onto one more row.
        if (!pastFold.value) {
            fullHeight.value = el.offsetHeight;
        }
    });

    watch(pastFold, (past) => {
        if (!past) {
            expanded.value = false;
        }
    });

    return {
        /** The toolbar has left its place in the page and is held at the top of the window. */
        pinned: computed(() => depth.value > 0),
        /** The list has scrolled far enough for the bar to fold; the expand toggle is offered. */
        pastFold,
        collapsed,
        spacerHeight: computed(() => (collapsed.value ? foldHeight.value : 0)),
        toggle: () => {
            expanded.value = !expanded.value;
        },
    };
}
