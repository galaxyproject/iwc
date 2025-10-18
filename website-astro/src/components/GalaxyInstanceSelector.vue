<script setup lang="ts">
/*
 * GalaxyInstanceSelector.vue
 * A component to select a Galaxy instance from a list of default and custom instances.
 * Persisted in local storage are the currently selected instance, and a list of custom added instances.
 */

import { ref, computed, onMounted, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import Select from './ui/Select.vue';
import SelectTrigger from './ui/SelectTrigger.vue';
import SelectValue from './ui/SelectValue.vue';
import SelectContent from './ui/SelectContent.vue';
import SelectItem from './ui/SelectItem.vue';

// Default instance list - never modified
const defaultInstances = [
    'https://usegalaxy.org',
    'https://usegalaxy.eu',
    'https://usegalaxy.org.au',
    'https://usegalaxy.fr',
    'https://test.galaxyproject.org',
];

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'change']);

// Persist custom instances to localStorage
const customInstances = useStorage<Array<string>>('galaxy-custom-instances', []);

// Persist last selected instance URL
const lastSelectedInstance = useStorage<string>('galaxy-selected-instance', defaultInstances[0]);

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
const showCustomInput = ref(false);
const customInstanceInput = ref('');

onMounted(() => {
    if (!props.modelValue) {
        // If no model value provided, use the last selected instance
        selectedInstance.value = lastSelectedInstance.value;
        emit('update:modelValue', selectedInstance.value);
        emit('change', selectedInstance.value);
    }
});

// Watch for changes to modelValue from parent component
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && newVal !== selectedInstance.value) {
            selectedInstance.value = newVal;
        }
    }
);

// Watch for changes to the selected instance.  This is where we emit.
watch(selectedInstance, (newVal, oldVal) => {
    if (newVal) {
        // Handle both string values and objects with value property
        const instanceUrl = typeof newVal === 'string' ? newVal : newVal;

        // Update the last selected instance in storage
        lastSelectedInstance.value = instanceUrl;
        // Emit the changes
        emit('update:modelValue', instanceUrl);
        emit('change', instanceUrl);
    }
});

function addCustomInstance() {
    const url = customInstanceInput.value.trim();
    if (url && !allInstances.value.includes(url)) {
        customInstances.value.push(url);
        selectedInstance.value = url;
        customInstanceInput.value = '';
        showCustomInput.value = false;
    }
}
</script>

<template>
    <div class="galaxy-instance-selector">
        <div class="my-2">
            <p class="text-sm font-medium">
                Select or enter a Galaxy instance URL in the field below to launch this workflow on that instance.
            </p>
        </div>

        <Select v-model="selectedInstance">
            <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a Galaxy instance" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem v-for="instance in allInstances" :key="instance" :value="instance">
                    {{ instance }}
                </SelectItem>
            </SelectContent>
        </Select>

        <div class="mt-2 flex gap-2">
            <button
                v-if="!showCustomInput"
                @click="showCustomInput = true"
                class="text-sm text-blue-600 hover:text-blue-800"
            >
                + Add custom instance
            </button>

            <div v-if="showCustomInput" class="flex gap-2 w-full">
                <input
                    v-model="customInstanceInput"
                    type="url"
                    placeholder="https://your-galaxy-instance.org"
                    class="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                    @keyup.enter="addCustomInstance"
                />
                <button
                    @click="addCustomInstance"
                    class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                    Add
                </button>
                <button
                    @click="showCustomInput = false; customInstanceInput = ''"
                    class="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </div>

        <div v-if="customInstances.length > 0" class="mt-2">
            <p class="text-xs text-gray-600 mb-1">Custom instances:</p>
            <div class="flex flex-wrap gap-1">
                <span
                    v-for="instance in customInstances"
                    :key="instance"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                >
                    {{ instance }}
                    <button
                        @click="deleteCustomInstance(instance)"
                        class="text-red-600 hover:text-red-800 font-bold"
                        aria-label="Delete custom instance"
                    >
                        ×
                    </button>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.galaxy-instance-selector {
    width: 100%;
}
</style>
