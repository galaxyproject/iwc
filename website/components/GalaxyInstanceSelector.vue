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

// Use useStorage to persist the selected instance
const selectedInstance = ref('');
const selectedInstanceStorage = useStorage('galaxy-instance-preference', selectedInstance);
const customMode = ref(false);
const customInstanceUrl = ref('');

// Watch for changes to modelValue from parent component.
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== selectedInstance.value) {
      selectedInstance.value = newVal;
    }
  }
);

// Watch for changes to the selected instance.
watch(selectedInstance, (newVal) => {
  selectedInstanceStorage.value = newVal;
  emit('update:modelValue', newVal);
  emit('change', newVal);
});

onMounted(() => {
  // Check if current value is a predefined instance or custom
  customMode.value = !defaultInstances.some(instance => instance.value === selectedInstance.value);
  if (customMode.value) {
    customInstanceUrl.value = selectedInstance.value;
  }
});

function selectInstance(instance) {
  selectedInstance.value = instance;
}

function toggleCustomMode() {
  customMode.value = !customMode.value;
  if (!customMode.value) {
    // When switching back to predefined, select the first instance
    selectInstance(defaultInstances[0].value);
  } else {
    // When switching to custom, pre-fill with current selection
    customInstanceUrl.value = selectedInstance.value;
  }
}

function applyCustomUrl() {
  try {
    // Basic validation
    new URL(customInstanceUrl.value);
    selectInstance(customInstanceUrl.value);
  } catch (e) {
    console.error("Invalid URL provided");
    // You could add visual feedback here
  }
}

function handleCustomInputBlur() {
  if (customInstanceUrl.value) {
    applyCustomUrl();
  }
}
</script>

<template>
  <div class="galaxy-instance-selector">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium">Galaxy Instance</span>
      <UButton
        size="xs"
        :color="customMode ? 'primary' : 'gray'"
        :variant="customMode ? 'solid' : 'ghost'"
        @click="toggleCustomMode"
      >
        {{ customMode ? 'Use Predefined' : 'Use Custom' }}
      </UButton>
    </div>

    <div v-if="!customMode">
      <USelect
        v-model="selectedInstance"
        :options="defaultInstances"
        @change="selectInstance"
        placeholder="Select a Galaxy instance"
        class="w-full"
      />
    </div>

    <div v-else class="custom-url-input">
      <UInput
        v-model="customInstanceUrl"
        placeholder="Enter Galaxy Instance URL"
        @blur="handleCustomInputBlur"
        @keyup.enter="applyCustomUrl"
        class="w-full"
      >
        <template #trailing>
          <UButton
            icon="i-heroicons-check"
            color="primary"
            variant="ghost"
            size="xs"
            @click="applyCustomUrl"
          />
        </template>
      </UInput>
    </div>
  </div>
</template>

<style scoped>
.galaxy-instance-selector {
  width: 100%;
}
</style>
