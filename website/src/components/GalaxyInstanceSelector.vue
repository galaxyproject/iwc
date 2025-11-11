<script setup lang="ts">
/*
 * GalaxyInstanceSelector.vue
 * A component to select a Galaxy instance from a list of default and custom instances.
 * Persisted in local storage are the currently selected instance, and a list of custom added instances.
 */

import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useStorage } from "@vueuse/core";
import { normalizeGalaxyUrl } from "../utils";
import Combobox from "./ui/Combobox.vue";
import ComboboxAnchor from "./ui/ComboboxAnchor.vue";
import ComboboxInput from "./ui/ComboboxInput.vue";
import ComboboxTrigger from "./ui/ComboboxTrigger.vue";
import ComboboxContent from "./ui/ComboboxContent.vue";
import ComboboxItem from "./ui/ComboboxItem.vue";
import ComboboxEmpty from "./ui/ComboboxEmpty.vue";
import { ChevronDown } from "lucide-vue-next";

// Default instance list - never modified
const defaultInstances = [
    "https://usegalaxy.org",
    "https://usegalaxy.eu",
    "https://usegalaxy.org.au",
    "https://usegalaxy.fr",
    "https://test.galaxyproject.org",
    "https://galaxy.cfdeworkspace.org",
];

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Persist custom instances to localStorage
const customInstances = useStorage<Array<string>>("galaxy-custom-instances", []);

// Persist last selected instance URL
const lastSelectedInstance = useStorage<string>("galaxy-selected-instance", defaultInstances[0]);

// Combine default and custom instances for display
const allInstances = computed(() => {
    // Start with all default instances
    const combined = [...defaultInstances]; // Add custom instances that don't overlap with defaults

    if (customInstances.value) {
        customInstances.value.forEach((custom) => {
            if (!combined.some((item) => item === custom)) {
                combined.push(custom);
            }
        });
    }

    return combined;
});

// Check if an instance is custom (not in defaults)
const isCustomInstance = (instance: string) => {
    return !defaultInstances.includes(instance);
};

// Initialize selected instance
const selectedInstance = ref(props.modelValue || lastSelectedInstance.value);

// Delete a custom instance
const deleteCustomInstance = (instance: string) => {
    const index = customInstances.value.indexOf(instance);
    if (index > -1) {
        customInstances.value.splice(index, 1);

        // If the deleted instance was selected, switch to the first default
        if (selectedInstance.value === instance) {
            selectedInstance.value = defaultInstances[0];
        }
    }
};

const searchTerm = ref("");
const open = ref(false);

// Handle opening dropdown - clear search to show all instances
const handleInputFocus = () => {
    if (!open.value) {
        searchTerm.value = "";
    }
};

// Handle ESC key to cancel typing and close dropdown
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open.value) {
        event.preventDefault();
        event.stopPropagation();
        // Force close dropdown - this will trigger our watcher which restores searchTerm
        userIsTyping.value = false;
        open.value = false;
    }
};

// Track if user has started typing
const userIsTyping = ref(false);

// Watch searchTerm to detect user typing
watch(searchTerm, (newVal, oldVal) => {
    // User is typing if searchTerm changes and it's not equal to selected instance
    if (newVal !== selectedInstance.value) {
        userIsTyping.value = true;
    } else {
        userIsTyping.value = false;
    }
});

// Watch for dropdown opening/closing
watch(open, (newVal, oldVal) => {
    if (oldVal === false && newVal === true) {
        // Dropdown just opened - clear search to show all instances
        // But only if user hasn't started typing yet
        if (!userIsTyping.value && searchTerm.value === selectedInstance.value) {
            searchTerm.value = "";
        }
    } else if (oldVal === true && newVal === false) {
        // Dropdown just closed - restore the selected instance value
        searchTerm.value = selectedInstance.value;
        userIsTyping.value = false;
    }
});

// Filter instances based on search term
const filteredInstances = computed(() => {
    if (!searchTerm.value) {
        return allInstances.value;
    }
    const search = searchTerm.value.toLowerCase();
    return allInstances.value.filter((instance) => instance.toLowerCase().includes(search));
});

// Check if search term exactly matches an existing instance
const isExactMatch = computed(() => {
    if (!searchTerm.value) return false;
    return allInstances.value.some((instance) => instance.toLowerCase() === searchTerm.value.toLowerCase());
});

// Add global ESC key handler for closing dropdown
const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open.value) {
        event.preventDefault();
        event.stopPropagation();
        userIsTyping.value = false;
        open.value = false;
    }
};

onMounted(() => {
    if (!props.modelValue) {
        // If no model value provided, use the last selected instance
        selectedInstance.value = lastSelectedInstance.value;
        emit("update:modelValue", selectedInstance.value);
        emit("change", selectedInstance.value);
    }

    document.addEventListener("keydown", handleEscKey, true);
});

onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleEscKey, true);
});

// Watch for changes to modelValue from parent component
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && newVal !== selectedInstance.value) {
            selectedInstance.value = newVal;
        }
    },
);

// Watch for changes to the selected instance.  This is where we emit.
watch(selectedInstance, (newVal, oldVal) => {
    if (newVal) {
        // Handle both string values and objects with value property
        const instanceUrl = typeof newVal === "string" ? newVal : newVal;

        // If the newval isn't in the list of all instances, add it to the custom list
        if (!allInstances.value.some((def) => def === instanceUrl)) {
            if (!customInstances.value.some((custom) => custom === instanceUrl)) {
                customInstances.value.push(instanceUrl);
                searchTerm.value = ""; // Clear the search after creation
            }
        }

        // Update the last selected instance in storage
        lastSelectedInstance.value = instanceUrl;
        // Emit the changes
        emit("update:modelValue", instanceUrl);
        emit("change", instanceUrl);
    }
});

// Custom filter function - must include both instances and the search term
// to prevent radix-vue from filtering them out
const customFilterFunction = (list: any[]) => {
    // If not open, ignore search term and present full list to avoid partial render during close animations
    if (!open.value) {
        return allInstances.value;
    }
    // Build a list of all values that should be visible
    const visibleValues = new Set();

    // Add the normalized search term (for the Create button)
    if (searchTerm.value) {
        const normalized = normalizeGalaxyUrl(searchTerm.value);
        if (normalized) {
            visibleValues.add(normalized);
        }
    }

    // Add all instances from our filtered list
    filteredInstances.value.forEach((instance) => visibleValues.add(instance));

    // Return all values that should be visible
    return Array.from(visibleValues);
};
</script>

<template>
    <div class="galaxy-instance-selector">
        <div class="my-2">
            <p class="text-sm font-medium">
                Select or enter a Galaxy instance URL in the field below to launch this workflow on that instance.
            </p>
        </div>

        <Combobox
            v-model="selectedInstance"
            v-model:searchTerm="searchTerm"
            v-model:open="open"
            :filterFunction="customFilterFunction"
            @keydown.capture="handleKeydown">
            <ComboboxAnchor class="w-full relative">
                <ComboboxInput
                    placeholder="Select or type a Galaxy instance URL"
                    class="w-full pr-10"
                    @focus="handleInputFocus" />
                <ComboboxTrigger
                    class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    aria-label="Toggle dropdown">
                    <ChevronDown :class="{ 'rotate-180': open }" class="h-4 w-4 text-gray-500 transition-transform" />
                </ComboboxTrigger>
            </ComboboxAnchor>

            <ComboboxContent class="max-h-60 overflow-auto">
                <!-- Show "Create" option when searchTerm doesn't exactly match any existing instance -->
                <ComboboxItem
                    v-if="searchTerm && !isExactMatch"
                    :value="normalizeGalaxyUrl(searchTerm) || searchTerm"
                    class="cursor-pointer">
                    <div class="flex items-center">
                        <span class="text-sm"
                            >Create "<strong>{{ normalizeGalaxyUrl(searchTerm) || searchTerm }}</strong
                            >"</span
                        >
                    </div>
                </ComboboxItem>

                <!-- Show filtered instances -->
                <ComboboxItem
                    v-for="instance in filteredInstances"
                    :key="instance"
                    :value="instance"
                    class="cursor-pointer">
                    <div class="flex items-center justify-between w-full">
                        <span>{{ instance }}</span>
                        <button
                            v-if="isCustomInstance(instance)"
                            @click.stop.prevent="deleteCustomInstance(instance)"
                            class="ml-2 text-red-600 hover:text-red-800 text-xs"
                            aria-label="Delete custom instance">
                            ×
                        </button>
                    </div>
                </ComboboxItem>

                <!-- Show empty state only when there are truly no instances at all -->
                <ComboboxEmpty v-if="!searchTerm && allInstances.length === 0">
                    <div class="py-2 px-3">
                        <p class="text-sm text-gray-500">Type to search or enter a custom Galaxy instance URL</p>
                    </div>
                </ComboboxEmpty>
            </ComboboxContent>
        </Combobox>
    </div>
</template>

<style scoped>
.galaxy-instance-selector {
    width: 100%;
}
</style>
