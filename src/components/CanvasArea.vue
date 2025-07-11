<template>
  <div 
    class="flex-1 relative bg-gray-100 overflow-hidden flex items-center justify-center"
    @click="handleMainAreaClick"
  >
    <!-- Object Action Menu (positioned above canvas container) -->
    <div
      v-if="selectedObject"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <ObjectActionMenu
        :selected-object="selectedObject"
        :visible="true"
        @update-property="handleUpdateObjectProperty"
        @bring-to-front="handleBringToFront"
        @send-to-back="handleSendToBack"
      />
    </div>
    
    <!-- Canvas Container -->
    <div
      ref="canvasContainer"
      class="relative"
      @mousedown="handleCanvasMouseDown"
      @mousemove="handleCanvasMouseMove"
      @mouseup="handleCanvasMouseUp"
      @wheel="handleWheel"
    >
      <!-- Canvas Background -->
      <div
        class="canvas-area shadow bg-white relative"
        :style="canvasStyle"
        @click="handleCanvasAreaClick"
      >
        <!-- Grid (optional) -->
        <div v-if="showGrid" class="absolute inset-0 opacity-20">
          <svg
            :width="state.canvas.width"
            :height="state.canvas.height"
            class="absolute inset-0"
          >
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <!-- Design Objects -->
        <CanvasObject
          v-for="object in sortedObjects"
          :key="object.id"
          :object="object"
          :is-selected="object.id === state.selectedId"
          @select="selectObject"
          @update="updateObject"
          @delete="deleteObject"
        />
        
        <!-- Quick Actions for selected object -->
        <QuickActions
          v-if="selectedObject"
          :object="selectedObject"
          :visible="!!selectedObject"
          :canvas-zoom="state.canvas.zoom"
          @lock="toggleLock"
          @duplicate="duplicateSelected"
          @delete="deleteSelected"
        />
      </div>
    </div>

    <!-- Canvas Controls - Bottom Right -->
    <div class="absolute bottom-4 right-4 flex items-center space-x-4">
      <!-- Grid Toggle -->
      <button
        @click="toggleGrid"
        :class="[
          'p-2 rounded-lg transition-colors',
          showGrid 
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
        title="Toggle Grid"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
      
      <div class="h-8 border-l border-gray-300"></div>
      
      <!-- Canvas Info -->
      <div class="text-sm text-gray-600">
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <button
            @click="openCanvasSizeModal"
            class="hover:text-blue-600 cursor-pointer"
            title="Change Canvas Size"
          >
            {{ state.canvas.width }} × {{ state.canvas.height }}px
          </button>
        </div>
      </div>
      
      <div class="h-8 border-l border-gray-300"></div>
      
      <!-- Zoom Controls -->
      <div class="flex items-center space-x-2">
        <button
          @click="zoomOut"
          class="p-1 hover:bg-gray-100 rounded"
          title="Zoom Out"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        
        <button
          @click="resetZoom"
          class="px-2 py-1 text-sm hover:bg-gray-100 rounded min-w-16 text-center"
          title="Reset Zoom"
        >
          {{ Math.round(state.canvas.zoom * 100) }}%
        </button>
        
        <button
          @click="zoomIn"
          class="p-1 hover:bg-gray-100 rounded"
          title="Zoom In"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Canvas Size Modal -->
    <div
      v-if="showCanvasSizeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">Canvas Size</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
            <input
              v-model.number="newCanvasWidth"
              type="number"
              min="200"
              max="4000"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
            <input
              v-model.number="newCanvasHeight"
              type="number"
              min="200"
              max="4000"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="newCanvasWidth = 800; newCanvasHeight = 600"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Default
            </button>
            <button
              @click="newCanvasWidth = 1920; newCanvasHeight = 1080"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              HD
            </button>
            <button
              @click="newCanvasWidth = 1080; newCanvasHeight = 1080"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Square
            </button>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 mt-6">
          <button
            @click="showCanvasSizeModal = false"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="applyCanvasSize"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useDesignStore } from '../store/design';
import CanvasObject from './CanvasObject.vue';
import QuickActions from './QuickActions.vue';
import ObjectActionMenu from './ObjectActionMenu.vue';

const {
  state,
  selectObject,
  updateObject,
  deleteObject,
  moveObjectToFront,
  moveObjectToBack,
  addObject,
  setPan,
  setZoom,
  setCanvasSize,
  getSelectedObject,
} = useDesignStore();

const canvasContainer = ref<HTMLElement>();
const showGrid = ref(true);
const isPanning = ref(false);
const lastPanPoint = ref({ x: 0, y: 0 });
const showCanvasSizeModal = ref(false);
const newCanvasWidth = ref(800);
const newCanvasHeight = ref(600);

// Canvas size functions
const openCanvasSizeModal = () => {
  newCanvasWidth.value = state.canvas.width;
  newCanvasHeight.value = state.canvas.height;
  showCanvasSizeModal.value = true;
};

const applyCanvasSize = () => {
  setCanvasSize(newCanvasWidth.value, newCanvasHeight.value);
  showCanvasSizeModal.value = false;
};

// Zoom functions
const zoomIn = () => {
  setZoom(Math.min(state.canvas.zoom * 1.2, 5)); // Max zoom 500%
};

const zoomOut = () => {
  setZoom(Math.max(state.canvas.zoom / 1.2, 0.1)); // Min zoom 10%
};

const resetZoom = () => {
  setZoom(1);
};

// Computed properties
const sortedObjects = computed(() => {
  return [...state.objects].sort((a, b) => a.zIndex - b.zIndex);
});

const selectedObject = computed(() => getSelectedObject());

const canvasStyle = computed(() => ({
  width: `${state.canvas.width}px`,
  height: `${state.canvas.height}px`,
  backgroundColor: '#ffffff',
  transform: `scale(${state.canvas.zoom})`,
  transformOrigin: 'center',
}));

const colorValue = computed({
  get: () => {
    const obj = selectedObject.value;
    if (!obj) return '#000000';
    return obj.type === 'text' ? obj.props.color : obj.props.fill;
  },
  set: (value: string) => {
    const obj = selectedObject.value;
    if (obj) {
      if (obj.type === 'text') {
        updateObject(obj.id, { props: { ...obj.props, color: value } });
      } else {
        // For shapes, update both fill and stroke to keep consistent colors
        updateObject(obj.id, { props: { ...obj.props, fill: value, stroke: value } });
      }
    }
  }
});

// Canvas interactions
const handleCanvasMouseDown = (event: MouseEvent) => {
  if (event.target === canvasContainer.value || event.target === event.currentTarget) {
    if (event.button === 0 && !event.ctrlKey && !event.metaKey) {
      isPanning.value = true;
      lastPanPoint.value = { x: event.clientX, y: event.clientY };
    }
  }
};

const handleCanvasAreaClick = (event: MouseEvent) => {
  // Only deselect if clicking directly on the canvas area (not on objects)
  if (event.target === event.currentTarget) {
    selectObject(null);
  }
};

const handleCanvasMouseMove = (event: MouseEvent) => {
  if (isPanning.value) {
    const deltaX = event.clientX - lastPanPoint.value.x;
    const deltaY = event.clientY - lastPanPoint.value.y;
    
    setPan(state.canvas.panX + deltaX, state.canvas.panY + deltaY);
    
    lastPanPoint.value = { x: event.clientX, y: event.clientY };
  }
};

const handleCanvasMouseUp = () => {
  isPanning.value = false;
};

const handleWheel = (event: WheelEvent) => {
  // Only zoom when Ctrl key is pressed
  if (!event.ctrlKey) {
    return;
  }
  
  event.preventDefault();
  
  // Get mouse position relative to canvas
  const canvasRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const mouseX = event.clientX - canvasRect.left;
  const mouseY = event.clientY - canvasRect.top;
  
  // Convert to canvas coordinates before zoom
  const canvasMouseX = (mouseX - state.canvas.panX) / state.canvas.zoom;
  const canvasMouseY = (mouseY - state.canvas.panY) / state.canvas.zoom;
  
  const delta = event.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = Math.max(0.1, Math.min(5, state.canvas.zoom * delta));
  
  // Calculate new pan to keep mouse position fixed
  const newPanX = mouseX - canvasMouseX * newZoom;
  const newPanY = mouseY - canvasMouseY * newZoom;
  
  setZoom(newZoom);
  setPan(newPanX, newPanY);
};

// Object operations
const updateSelectedObject = () => {
  const obj = selectedObject.value;
  if (obj) {
    updateObject(obj.id, obj);
  }
};

const updateSelectedObjectColor = () => {
  // This is handled by the computed property setter
};

const moveToFront = () => {
  const obj = selectedObject.value;
  if (obj) {
    moveObjectToFront(obj.id);
  }
};

const moveToBack = () => {
  const obj = selectedObject.value;
  if (obj) {
    moveObjectToBack(obj.id);
  }
};

const duplicateObject = () => {
  const obj = selectedObject.value;
  if (obj) {
    const newObject = {
      type: obj.type,
      props: {
        ...obj.props,
        x: obj.props.x + 20,
        y: obj.props.y + 20,
      },
    };
    addObject(newObject);
  }
};

const deleteSelectedObject = () => {
  const obj = selectedObject.value;
  if (obj) {
    deleteObject(obj.id);
  }
};

// Quick actions
const toggleLock = () => {
  const obj = selectedObject.value;
  if (obj) {
    updateObject(obj.id, {
      props: {
        ...obj.props,
        locked: !obj.props.locked,
      },
    });
  }
};

const duplicateSelected = () => {
  const obj = selectedObject.value;
  if (obj) {
    const newObject = {
      type: obj.type,
      props: {
        ...obj.props,
        x: obj.props.x + 20,
        y: obj.props.y + 20,
      },
    };
    addObject(newObject);
  }
};

const deleteSelected = () => {
  const obj = selectedObject.value;
  if (obj) {
    deleteObject(obj.id);
  }
};

const handleUpdateObjectProperty = (property: string, value: any) => {
  const obj = selectedObject.value;
  if (obj) {
    updateObject(obj.id, {
      props: {
        ...obj.props,
        [property]: value
      }
    });
  }
};

const handleBringToFront = () => {
  const obj = selectedObject.value;
  if (obj) {
    moveObjectToFront(obj.id);
  }
};

const handleSendToBack = () => {
  const obj = selectedObject.value;
  if (obj) {
    moveObjectToBack(obj.id);
  }
};

// Grid toggle
const toggleGrid = () => {
  showGrid.value = !showGrid.value;
};

const handleMainAreaClick = (event: MouseEvent) => {
  // Check if click is outside canvas-area (white canvas)
  const canvasArea = canvasContainer.value?.querySelector('.canvas-area');
  const actionMenu = (event.target as Element)?.closest('[class*="absolute"][class*="top-4"]');
  
  // If clicking outside canvas area and not on action menu, deselect
  if (canvasArea && !canvasArea.contains(event.target as Node) && !actionMenu) {
    selectObject(null);
  }
};
</script>

<script lang="ts">
export default {
  name: 'CanvasArea'
};
</script>
