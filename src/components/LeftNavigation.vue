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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  `
};

const ElementsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
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
