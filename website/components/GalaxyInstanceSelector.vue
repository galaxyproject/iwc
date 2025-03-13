<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  instances: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const selectedInstance = ref(props.modelValue);
const customMode = ref(false);
const customInstanceUrl = ref('');

onMounted(() => {
  // Check if current value is a predefined instance or custom
  customMode.value = !props.instances.some(instance => instance.value === props.modelValue);
  if (customMode.value) {
    customInstanceUrl.value = props.modelValue;
  }
});

function selectInstance(instance) {
  selectedInstance.value = instance;
  emit('update:modelValue', instance);
  emit('change', instance);
}

function toggleCustomMode() {
  customMode.value = !customMode.value;
  if (!customMode.value) {
    // When switching back to predefined, select the first instance
    selectInstance(props.instances[0].value);
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
        :options="instances"
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
