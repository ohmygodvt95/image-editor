<template>
  <aside class="flex flex-col h-full">
    <!-- Tab navigation -->
    <div class="border-b border-gray-200">
      <nav class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5 mx-auto mb-1" />
          <span class="block text-xs">{{ tab.name }}</span>
        </button>
      </nav>
    </div>

    <!-- Tab content -->
    <div class="flex-1 overflow-y-auto">
      <component :is="activeTabComponent" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TemplateMenu from './sidebar/TemplateMenu.vue';
import ElementsMenu from './sidebar/ElementsMenu.vue';
import TextMenu from './sidebar/TextMenu.vue';
import UploadMenu from './sidebar/UploadMenu.vue';

// Icons as simple SVG components
const TemplateIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  `
};

const ElementsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  `
};

const TextIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  `
};

const UploadIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  `
};

const tabs = [
  { id: 'templates', name: 'Templates', icon: TemplateIcon, component: TemplateMenu },
  { id: 'elements', name: 'Elements', icon: ElementsIcon, component: ElementsMenu },
  { id: 'text', name: 'Text', icon: TextIcon, component: TextMenu },
  { id: 'upload', name: 'Upload', icon: UploadIcon, component: UploadMenu },
];

const activeTab = ref('elements');

const activeTabComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value);
  return tab ? tab.component : ElementsMenu;
});
</script>
