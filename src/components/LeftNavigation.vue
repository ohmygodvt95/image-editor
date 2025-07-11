<template>
  <div class="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
    <!-- Navigation Items -->
    <button
      v-for="tab in navigationTabs"
      :key="tab.id"
      @click="$emit('tab-change', tab.id)"
      :class="[
        'w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200',
        activeTab === tab.id
          ? 'bg-purple-100 text-purple-600 shadow-md'
          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
      ]"
      :title="tab.name"
    >
      <component :is="tab.icon" class="w-6 h-6 mb-0.5" />
      <span class="text-xs font-medium">{{ tab.shortName }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeTab: string;
}

interface Emits {
  (e: 'tab-change', tab: string): void;
}

defineProps<Props>();
defineEmits<Emits>();

// Icons as inline SVG components
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  `
};

const TextIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
};

const UploadIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  `
};

const navigationTabs = [
  { 
    id: 'templates', 
    name: 'Templates', 
    shortName: 'Design',
    icon: TemplateIcon 
  },
  { 
    id: 'elements', 
    name: 'Elements', 
    shortName: 'Elements',
    icon: ElementsIcon 
  },
  { 
    id: 'text', 
    name: 'Text', 
    shortName: 'Text',
    icon: TextIcon 
  },
  { 
    id: 'upload', 
    name: 'Upload', 
    shortName: 'Uploads',
    icon: UploadIcon 
  },
];
</script>

<script lang="ts">
export default {
  name: 'LeftNavigation'
};
</script>
