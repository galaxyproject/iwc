<script setup lang="ts">
/*
 * GalaxyInstanceSelector.vue
 * A component to select a Galaxy instance from a list of default and custom instances.
 * Persisted in local storage are the currently selected instance, and a list of custom added instances.
 */

import { ref, computed, onMounted, watch } from "vue";
import { useStorage } from "@vueuse/core";

// Default instance list - never modified
const defaultInstances = [
    "https://usegalaxy.org",
    "https://usegalaxy.eu",
    "https://usegalaxy.org.au",
    "https://test.galaxyproject.org",
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

// Initialize selected instance
const selectedInstance = ref(props.modelValue || lastSelectedInstance.value);
const internalQuery = ref("");

onMounted(() => {
    // Check if the current model value exists in our instances
    const instanceExists = allInstances.value.some((instance) => instance === props.modelValue);

    if (props.modelValue && !instanceExists) {
        // If model value is provided but not in our lists, try to add it as custom
        try {
            const url = new URL(props.modelValue);
            onCreateInstance(props.modelValue);
        } catch (e) {
            // If not a valid URL, select the last known instance
            selectedInstance.value = lastSelectedInstance.value;
        }
    } else if (!props.modelValue) {
        // If no model value provided, use the last selected instance
        selectedInstance.value = lastSelectedInstance.value;
    }
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
                internalQuery.value = ""; // Clear the query after creation.
            }
        }
        // Update the last selected instance in storage
        lastSelectedInstance.value = instanceUrl;

        // Emit the changes
        emit("update:modelValue", instanceUrl);
        emit("change", instanceUrl);
    }
});

const filteredOptions = computed(() => {
    if (!internalQuery.value) {
        return allInstances.value;
    }
    const query = internalQuery.value.toLowerCase();
    return allInstances.value.filter((instance) => instance.toLowerCase().includes(query));
});

const showCreateOption = computed(() => {
    return internalQuery.value && !filteredOptions.value.some((item) => item === internalQuery.value);
});
</script>

<template>
    <div class="galaxy-instance-selector">
        <div class="my-2">
            <p class="text-sm font-medium">
                Select or enter a Galaxy instance URL in the field below to launch this workflow on that instance.
            </p>
        </div>
        <USelectMenu
            v-model="selectedInstance"
            :options="allInstances"
            :searchable="true"
            v-model:query="internalQuery"
            searchable-placeholder="Select or enter a custom Galaxy instance URL"
            show-create-option-when="always"
            by="value"
            creatable>
            <template #option-create="{ option }">
                <span>Create "{{ internalQuery }}"</span>
            </template>
        </USelectMenu>
    </div>
</template>

<style scoped>
.galaxy-instance-selector {
    width: 100%;
}
</style>
