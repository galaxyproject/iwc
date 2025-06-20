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
    "https://usegalaxy.fr",
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

// Check if an instance is custom (not in defaults)
const isCustomInstance = (instance: string) => {
    return !defaultInstances.includes(instance);
};

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

// Initialize selected instance
const selectedInstance = ref(props.modelValue || lastSelectedInstance.value);
const internalQuery = ref("");

onMounted(() => {
    if (!props.modelValue) {
        // If no model value provided, use the last selected instance
        selectedInstance.value = lastSelectedInstance.value;
        // TODO -- the watch should do this but is not?  Is it because of the string handling?
        // No harm in kicking it out here, though.
        emit("update:modelValue", selectedInstance.value);
        emit("change", selectedInstance.value);
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
            v-model:query="internalQuery"
            :options="allInstances"
            :searchable="true"
            searchable-placeholder="Select or enter a custom Galaxy instance URL"
            show-create-option-when="always"
            creatable>
            <template #option="{ option }">
                <div class="flex items-center justify-between w-full">
                    <span class="truncate">{{ option }}</span>
                    <UButton
                        v-if="isCustomInstance(option)"
                        icon="i-heroicons-trash-20-solid"
                        size="2xs"
                        color="gray"
                        variant="ghost"
                        :padded="false"
                        class="ml-2"
                        @click.stop.prevent="deleteCustomInstance(option)"
                        @mousedown.stop.prevent="deleteCustomInstance(option)"
                        aria-label="Delete custom instance" />
                </div>
            </template>
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
