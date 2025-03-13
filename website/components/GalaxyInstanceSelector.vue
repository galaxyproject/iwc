<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStorage } from '@vueuse/core';

// Default instance list
const defaultInstances = [
  { value: "https://usegalaxy.org", label: "usegalaxy.org" },
  { value: "https://usegalaxy.eu", label: "usegalaxy.eu" },
  { value: "https://usegalaxy.org.au", label: "usegalaxy.org.au" },
  { value: "https://test.galaxyproject.org", label: "test.galaxyproject.org" },
];

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

// Store available instances in local storage, starting with defaults
const availableInstances = useStorage('galaxy-available-instances', defaultInstances);
const selectedInstance = ref(props.modelValue);

// Watch for changes to modelValue from parent component
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== selectedInstance.value) {
      selectedInstance.value = newVal;
    }
  }
);

// Watch for changes to the selected instance
watch(selectedInstance, (newVal) => {
  emit('update:modelValue', newVal);
  emit('change', newVal);
});

// Function to create a new instance
function onCreateInstance(url: string) {
  try {
    // Basic validation
    const parsedUrl = new URL(url);
    
    // Create a label from the URL
    const label = parsedUrl.hostname;
    
    // Check if this URL already exists
    if (!availableInstances.value.some(instance => instance.value === url)) {
      // Add to available instances
      availableInstances.value.push({ value: url, label });
    }
    
    // Set as selected
    selectedInstance.value = url;
  } catch (e) {
    console.error("Invalid URL provided:", e);
    // You could add visual feedback here
  }
}
</script>

<template>
  <div class="galaxy-instance-selector">
    <div class="mb-2">
      <span class="text-sm font-medium">Galaxy Instance</span>
    </div>
    
    <USelectMenu
      v-model="selectedInstance"
      create-item
      create-text="Use custom Galaxy instance:"
      :items="availableInstances"
      placeholder="Select or enter a Galaxy instance URL"
      by="value"
      option-attribute="label"
      class="w-full"
      @create="onCreateInstance"
    />
  </div>
</template>

<style scoped>
.galaxy-instance-selector {
  width: 100%;
}
</style>
