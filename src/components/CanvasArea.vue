<template>
  <div class="flex-1 relative bg-gray-100 overflow-hidden flex items-center justify-center">
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
        class="canvas-area border shadow-lg bg-white"
        :style="canvasStyle"
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
    <div class="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3 flex items-center space-x-4">
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
          <span>{{ state.canvas.width }} × {{ state.canvas.height }}px</span>
        </div>
        <div class="flex items-center space-x-1 mt-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>{{ state.objects.length }} objects</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useDesignStore } from '../store/design';
import CanvasObject from './CanvasObject.vue';
import QuickActions from './QuickActions.vue';

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
  getSelectedObject,
} = useDesignStore();

const canvasContainer = ref<HTMLElement>();
const showGrid = ref(true);
const isPanning = ref(false);
const lastPanPoint = ref({ x: 0, y: 0 });

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
      const prop = obj.type === 'text' ? 'color' : 'fill';
      updateObject(obj.id, { props: { ...obj.props, [prop]: value } });
    }
  }
});

// Canvas interactions
const handleCanvasMouseDown = (event: MouseEvent) => {
  if (event.target === canvasContainer.value || event.target === event.currentTarget) {
    selectObject(null);
    
    if (event.button === 0 && !event.ctrlKey && !event.metaKey) {
      isPanning.value = true;
      lastPanPoint.value = { x: event.clientX, y: event.clientY };
    }
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
  event.preventDefault();
  
  const delta = event.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = state.canvas.zoom * delta;
  setZoom(newZoom);
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

// Grid toggle
const toggleGrid = () => {
  showGrid.value = !showGrid.value;
};
</script>
