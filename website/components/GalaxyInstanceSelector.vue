<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useStorage } from "@vueuse/core";

// Default instance list - never modified
const defaultInstances = [
    { value: "https://usegalaxy.org", label: "usegalaxy.org" },
    { value: "https://usegalaxy.eu", label: "usegalaxy.eu" },
    { value: "https://usegalaxy.org.au", label: "usegalaxy.org.au" },
    { value: "https://test.galaxyproject.org", label: "test.galaxyproject.org" },
];

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["update:modelValue", "change"]);

// Persist custom instances to localStorage
const customInstances = useStorage<Array<{ value: string; label: string }>>("galaxy-custom-instances", []);

// Persist last selected instance URL
const lastSelectedInstance = useStorage<string>("galaxy-selected-instance", defaultInstances[0].value);

// Combine default and custom instances for display
const allInstances = computed(() => {
    // Start with all default instances
    const combined = [...defaultInstances];

    // Add custom instances that don't overlap with defaults
    if (customInstances.value) {
        customInstances.value.forEach((custom) => {
            if (!combined.some((item) => item.value === custom.value)) {
                combined.push(custom);
            }
        });
    }

    return combined;
});

// Initialize selected instance
const selectedInstance = ref(props.modelValue || lastSelectedInstance.value);

onMounted(() => {
    // Check if the current model value exists in our instances
    const instanceExists = allInstances.value.some((instance) => instance.value === props.modelValue);

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

// Watch for changes to the selected instance
watch(selectedInstance, (newVal) => {
    if (newVal) {
        // Update the last selected instance in storage
        lastSelectedInstance.value = newVal;
        // Emit the changes
        emit("update:modelValue", newVal);
        emit("change", newVal);
    }
});

// Function to create a new instance
function onCreateInstance(url: string) {
    try {
        // Basic validation
        const parsedUrl = new URL(url);

        // Create a label from the URL
        const label = parsedUrl.hostname;

        const newInstance = { value: url, label };

        // Only add to custom instances if it's not already there and not a default
        const isDefault = defaultInstances.some((def) => def.value === url);
        const isExistingCustom = customInstances.value.some((custom) => custom.value === url);

        if (!isDefault && !isExistingCustom) {
            customInstances.value.push(newInstance);
        }

        // Set as selected
        selectedInstance.value = url;
    } catch (e) {
        console.error("Invalid URL provided:", e);
    }
}
</script>

<template>
    <div class="galaxy-instance-selector">
        <div class="mb-2">
            <span class="text-sm font-medium">Run this workflow at a Galaxy Instance</span>
        </div>

        <USelectMenu
            create-item
            create-text="Use custom Galaxy instance:"
            :items="allInstances"
            placeholder="Select or enter a Galaxy instance URL"
            by="value"
            option-attribute="label"
            class="w-full"
            @create="onCreateInstance" />
    </div>
</template>

<style scoped>
.galaxy-instance-selector {
    width: 100%;
}
</style>
