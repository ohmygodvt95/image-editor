<template>
  <div 
    v-if="visible && selectedObject"
    class="bg-white rounded-lg shadow p-2 flex items-center space-x-1"
  >
    <!-- Font Family (for text objects) -->
    <div v-if="selectedObject.type === 'text'" class="flex items-center space-x-2">
      <select
        :value="selectedObject.props.fontFamily || 'Arial'"
        @change="handleFontFamilyChange"
        class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
        <option value="Courier New">Courier New</option>
      </select>
      
      <input
        :value="selectedObject.props.fontSize || 16"
        @input="handleFontSizeChange"
        type="number"
        min="8"
        max="200"
        class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      
      <div class="h-6 border-l border-gray-300"></div>
    </div>

    <!-- Bold/Italic buttons for text -->
    <div v-if="selectedObject.type === 'text'" class="flex items-center space-x-1">
      <button
        @click="toggleBold"
        :class="[
          'p-2 rounded transition-colors',
          selectedObject.props.fontWeight === 'bold' 
            ? 'bg-blue-100 text-blue-600' 
            : 'hover:bg-gray-100'
        ]"
        title="Bold"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3v14h5.5c2.485 0 4.5-2.015 4.5-4.5 0-1.485-.726-2.8-1.837-3.607C14.272 8.1 15 6.785 15 5.25 15 2.679 12.821.5 10.25.5H5V3zm4.5 5.5h-2v-4h2c1.38 0 2.5 1.12 2.5 2.5S10.88 8.5 9.5 8.5zm1 2.5h-3v4h3c1.933 0 3.5-1.567 3.5-3.5S12.433 11 11.5 11z"/>
        </svg>
      </button>
      
      <button
        @click="toggleItalic"
        :class="[
          'p-2 rounded transition-colors',
          selectedObject.props.fontStyle === 'italic' 
            ? 'bg-blue-100 text-blue-600' 
            : 'hover:bg-gray-100'
        ]"
        title="Italic"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 1h8v2h-2.5l-3 12H13v2H5v-2h2.5l3-12H8V1z"/>
        </svg>
      </button>
      
      <div class="h-6 border-l border-gray-300"></div>
    </div>

    <!-- Alignment buttons for text -->
    <div v-if="selectedObject.type === 'text'" class="flex items-center space-x-1">
      <button
        v-for="align in ['left', 'center', 'right']"
        :key="align"
        @click="updateProperty('textAlign', align)"
        :class="[
          'p-2 rounded transition-colors',
          selectedObject.props.textAlign === align 
            ? 'bg-blue-100 text-blue-600' 
            : 'hover:bg-gray-100'
        ]"
        :title="`Align ${align}`"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="align === 'left'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8M4 18h16" />
          <path v-if="align === 'center'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M6 18h12" />
          <path v-if="align === 'right'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M12 12h8M4 18h16" />
        </svg>
      </button>
      
      <div class="h-6 border-l border-gray-300"></div>
    </div>

    <!-- Color picker -->
    <div class="relative">
      <button
        @click="showColorPicker = !showColorPicker"
        class="p-2 rounded hover:bg-gray-100 transition-colors flex items-center space-x-1"
        title="Color"
      >
        <div class="w-4 h-4 rounded border-2 border-gray-300" :style="{ backgroundColor: getCurrentColor() }"></div>
        <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <!-- Enhanced Color picker dropdown -->
      <div v-if="showColorPicker" class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border p-4 z-50 min-w-64">
        <!-- Recent/Common colors -->
        <div class="mb-3">
          <label class="text-xs font-medium text-gray-700 mb-2 block">Quick Colors</label>
          <div class="grid grid-cols-8 gap-1">
            <button
              v-for="color in enhancedColorPalette"
              :key="color"
              @click="updateColor(color); showColorPicker = false"
              class="w-6 h-6 rounded border hover:scale-110 transition-transform shadow-sm"
              :style="{ backgroundColor: color }"
              :title="color"
            ></button>
          </div>
        </div>
        
        <!-- Custom color picker -->
        <div class="mb-3">
          <label class="text-xs font-medium text-gray-700 mb-2 block">Custom Color</label>
          <input
            type="color"
            :value="getCurrentColor()"
            @input="handleColorChange"
            class="w-full h-10 rounded border cursor-pointer"
          />
        </div>
        
        <!-- Hex input -->
        <div>
          <label class="text-xs font-medium text-gray-700 mb-1 block">Hex Value</label>
          <input
            type="text"
            :value="getCurrentColor()"
            @input="handleHexInput"
            @keyup.enter="showColorPicker = false"
            placeholder="#000000"
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <!-- Close button -->
        <button
          @click="showColorPicker = false"
          class="mt-3 w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Done
        </button>
      </div>
    </div>

    <div class="h-6 border-l border-gray-300"></div>

    <!-- Position controls -->
    <div class="flex items-center space-x-1">
      <button
        @click="$emit('bring-to-front')"
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Bring to Front"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      </button>
      
      <button
        @click="$emit('send-to-back')"
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Send to Back"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      </button>
    </div>

    <div class="h-6 border-l border-gray-300"></div>

    <!-- Animation placeholder -->
    <button
      class="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors"
      title="Animate (Coming soon)"
    >
      Animate
    </button>

    <!-- Effects placeholder -->
    <button
      class="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors"
      title="Effects (Coming soon)"
    >
      Effects
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DesignObject } from '../types';

interface Props {
  selectedObject: DesignObject | null;
  visible: boolean;
}

interface Emits {
  (e: 'update-property', property: string, value: any): void;
  (e: 'bring-to-front'): void;
  (e: 'send-to-back'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showColorPicker = ref(false);

const colorPalette = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
  '#808080', '#C0C0C0', '#800000', '#008000', '#000080', '#808000'
];

const enhancedColorPalette = [
  // Grayscale
  '#000000', '#404040', '#808080', '#c0c0c0', '#ffffff',
  // Primary colors
  '#ff0000', '#00ff00', '#0000ff',
  // Secondary colors  
  '#ffff00', '#ff00ff', '#00ffff',
  // Common colors
  '#ffa500', '#800080', '#008000', '#000080', '#ff69b4', '#ffd700',
  // Pastels
  '#ffb3ba', '#bae1ff', '#baffc9', '#ffffba', '#ffdfba',
  // Dark variants
  '#8b0000', '#006400', '#000080', '#4b0082', '#b8860b'
];

const updateProperty = (property: string, value: any) => {
  emit('update-property', property, value);
};

const updateColor = (color: string) => {
  if (props.selectedObject?.type === 'text') {
    updateProperty('color', color);
  } else {
    // For shapes, update both fill and stroke to keep consistent colors
    updateProperty('fill', color);
    updateProperty('stroke', color);
  }
};

const getCurrentColor = () => {
  if (!props.selectedObject) return '#000000';
  
  if (props.selectedObject.type === 'text') {
    return props.selectedObject.props.color || '#000000';
  }
  
  return props.selectedObject.props.fill || '#000000';
};

const toggleBold = () => {
  const currentWeight = props.selectedObject?.props.fontWeight || 'normal';
  updateProperty('fontWeight', currentWeight === 'bold' ? 'normal' : 'bold');
};

const toggleItalic = () => {
  const currentStyle = props.selectedObject?.props.fontStyle || 'normal';
  updateProperty('fontStyle', currentStyle === 'italic' ? 'normal' : 'italic');
};

const handleFontFamilyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  updateProperty('fontFamily', target.value);
};

const handleFontSizeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateProperty('fontSize', parseInt(target.value));
};

const handleColorChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  updateColor(target.value);
};

const handleHexInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value.trim();
  
  // Add # if missing
  if (value && !value.startsWith('#')) {
    value = '#' + value;
  }
  
  // Validate hex color format
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    updateColor(value);
  }
};
</script>

<script lang="ts">
export default {
  name: 'ObjectActionMenu'
};
</script>
