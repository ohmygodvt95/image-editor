<template>
  <div 
    v-if="isExpanded"
    class="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800">
        {{ getTabTitle(activeTab) }}
      </h2>
      <button
        @click="$emit('close')"
        class="p-1 hover:bg-gray-100 rounded-md"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <component :is="getTabComponent(activeTab)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TemplateMenu from './sidebar/TemplateMenu.vue';
import ElementsMenu from './sidebar/ElementsMenu.vue';
import TextMenu from './sidebar/TextMenu.vue';
import UploadMenu from './sidebar/UploadMenu.vue';

interface Props {
  activeTab: string;
  isExpanded: boolean;
}

interface Emits {
  (e: 'close'): void;
}

defineProps<Props>();
defineEmits<Emits>();

const tabComponents = {
  templates: TemplateMenu,
  elements: ElementsMenu,
  text: TextMenu,
  upload: UploadMenu,
};

const tabTitles = {
  templates: 'Templates',
  elements: 'Elements',
  text: 'Text',
  upload: 'Uploads',
};

const getTabComponent = (tab: string) => {
  return tabComponents[tab as keyof typeof tabComponents] || ElementsMenu;
};

const getTabTitle = (tab: string) => {
  return tabTitles[tab as keyof typeof tabTitles] || 'Elements';
};
</script>
