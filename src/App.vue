<template>
  <div id="app" class="h-screen bg-gray-50 flex flex-col overflow-hidden">
    <!-- Header Toolbar -->
    <HeaderToolbar />
    
    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Navigation Sidebar (icons only) -->
      <LeftNavigation 
        :active-tab="activeTab" 
        @tab-change="handleTabChange"
      />
      
      <!-- Content Sidebar (expandable menu) -->
      <ContentSidebar 
        :active-tab="activeTab"
        :is-expanded="isSidebarExpanded"
        @close="isSidebarExpanded = false"
      />
      
      <!-- Properties Panel (for selected objects) -->
      <PropertiesPanel 
        v-if="showPropertiesPanel && selectedObject"
        :selected-object="selectedObject"
        @close="showPropertiesPanel = false"
      />
      
      <!-- Canvas Area -->
      <div class="flex-1 relative flex">
        <CanvasArea 
          @object-selected="handleObjectSelected"
          @show-properties="handleShowProperties"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDesignStore } from './store/design';
import HeaderToolbar from './components/HeaderToolbar.vue';
import LeftNavigation from './components/LeftNavigation.vue';
import ContentSidebar from './components/ContentSidebar.vue';
import PropertiesPanel from './components/PropertiesPanel.vue';
import CanvasArea from './components/CanvasArea.vue';

const {
  getSelectedObject,
} = useDesignStore();

const activeTab = ref('elements');
const isSidebarExpanded = ref(true);
const showPropertiesPanel = ref(false);
const activePropertiesType = ref<string>('');

const selectedObject = computed(() => getSelectedObject());

const handleTabChange = (tab: string) => {
  activeTab.value = tab;
  isSidebarExpanded.value = true;
  // Force sidebar to stay open
  setTimeout(() => {
    isSidebarExpanded.value = true;
  }, 100);
};

const handleObjectSelected = (object: any) => {
  // Object selected in canvas
};

const handleShowProperties = (type: string) => {
  activePropertiesType.value = type;
  showPropertiesPanel.value = true;
};
</script>
