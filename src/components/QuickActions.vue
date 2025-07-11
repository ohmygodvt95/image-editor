<template>
  <div 
    v-if="visible"
    class="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center space-x-1"
    :style="menuStyle"
  >
    <!-- Lock Position -->
    <button
      @click="$emit('lock')"
      :class="[
        'p-2 rounded-lg transition-colors',
        object.props.locked 
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      ]"
      :title="object.props.locked ? 'Unlock Position' : 'Lock Position'"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          v-if="!object.props.locked"
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
        />
        <path 
          v-else
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
        />
      </svg>
    </button>

    <!-- Duplicate -->
    <button
      @click="$emit('duplicate')"
      class="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
      title="Duplicate"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </button>

    <!-- Delete -->
    <button
      @click="$emit('delete')"
      class="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
      title="Delete"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DesignObject } from '../types';

interface Props {
  object: DesignObject;
  visible: boolean;
  canvasZoom: number;
}

interface Emits {
  (e: 'lock'): void;
  (e: 'duplicate'): void;
  (e: 'delete'): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const menuStyle = computed(() => {
  const scale = props.canvasZoom;
  const objectX = props.object.props.x;
  const objectY = props.object.props.y;
  const objectWidth = props.object.props.width || 100;
  const objectHeight = props.object.props.height || 100;
  const rotation = props.object.props.rotation || 0;
  
  // Calculate center position of object (in canvas coordinates)
  const centerX = objectX + (objectWidth / 2);
  const centerY = objectY + (objectHeight / 2);
  
  // Distance from center to top of menu (increased to avoid rotation handle)
  // Rotation handle is at -35px from object top, so we need more distance
  const distance = Math.max(objectHeight / 2 + 60, 120); // Minimum 120px distance
  
  // Calculate position above the object
  const menuX = centerX;
  const menuY = centerY - distance;
  
  return {
    left: `${menuX}px`,
    top: `${menuY}px`,
    transform: `translate(-50%, -100%)`, // Center horizontally, position above
    transformOrigin: 'center bottom',
    zIndex: 45, // Lower than action menu but higher than objects
  };
});
</script>

<script lang="ts">
export default {
  name: 'QuickActions'
};
</script>
