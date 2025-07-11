<template>
  <div class="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800">Properties</h2>
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
    <div v-if="selectedObject" class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- Position Section -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-700 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Position
        </h3>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">X</label>
            <input
              v-model.number="localProps.x"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              @input="updateObject"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Y</label>
            <input
              v-model.number="localProps.y"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              @input="updateObject"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Width</label>
            <input
              v-model.number="localProps.width"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              @input="updateObject"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Height</label>
            <input
              v-model.number="localProps.height"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              @input="updateObject"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Rotation</label>
          <input
            v-model.number="localProps.rotation"
            type="range"
            min="0"
            max="360"
            class="w-full"
            @input="updateObject"
          />
          <div class="text-xs text-gray-500 text-center">{{ localProps.rotation || 0 }}°</div>
        </div>
      </div>

      <!-- Type-specific properties -->
      <!-- Text Properties -->
      <div v-if="selectedObject.type === 'text'" class="space-y-4">
        <!-- Text Content -->
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Text Content</label>
          <textarea
            v-model="localProps.textContent"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows="3"
            @input="updateObject"
          ></textarea>
        </div>

        <!-- Font Settings -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-700">Font</h4>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
            <select
              v-model="localProps.fontFamily"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              @change="updateObject"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Size</label>
              <input
                v-model.number="localProps.fontSize"
                type="number"
                min="8"
                max="72"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                @input="updateObject"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Weight</label>
              <select
                v-model="localProps.fontWeight"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                @change="updateObject"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Light</option>
              </select>
            </div>
          </div>

          <!-- Alignment -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-2">Text Align</label>
            <div class="flex space-x-1">
              <button
                v-for="align in ['left', 'center', 'right']"
                :key="align"
                @click="localProps.textAlign = align; updateObject()"
                :class="[
                  'flex-1 py-2 px-3 text-xs border rounded-md transition-colors',
                  localProps.textAlign === align
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                ]"
              >
                {{ align.charAt(0).toUpperCase() + align.slice(1) }}
              </button>
            </div>
          </div>

          <!-- Colors -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
              <input
                v-model="localProps.color"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                @input="updateObject"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Background</label>
              <input
                v-model="localProps.backgroundColor"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                @input="updateObject"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Shape Properties -->
      <div v-if="selectedObject.type === 'shape'" class="space-y-4">
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-700">Appearance</h4>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Fill Color</label>
              <input
                v-model="localProps.fill"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                @input="updateObject"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Stroke Color</label>
              <input
                v-model="localProps.stroke"
                type="color"
                class="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                @input="updateObject"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Stroke Width</label>
              <input
                v-model.number="localProps.strokeWidth"
                type="number"
                min="0"
                max="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                @input="updateObject"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Border Radius</label>
              <input
                v-model.number="localProps.borderRadius"
                type="number"
                min="0"
                max="50"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                @input="updateObject"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Image Properties -->
      <div v-if="selectedObject.type === 'image'" class="space-y-4">
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-700">Image</h4>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
            <input
              v-model="localProps.src"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              @input="updateObject"
            />
          </div>

          <div class="flex space-x-2">
            <button
              @click="flipImage('horizontal')"
              class="flex-1 py-2 px-3 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md"
            >
              Flip H
            </button>
            <button
              @click="flipImage('vertical')"
              class="flex-1 py-2 px-3 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md"
            >
              Flip V
            </button>
          </div>
        </div>
      </div>

      <!-- Layer Actions -->
      <div class="space-y-3 pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-700">Layer</h4>
        
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="moveToFront"
            class="py-2 px-3 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md"
          >
            Bring Forward
          </button>
          <button
            @click="moveToBack"
            class="py-2 px-3 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md"
          >
            Send Backward
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="duplicateObject"
            class="py-2 px-3 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-md"
          >
            Duplicate
          </button>
          <button
            @click="deleteObject"
            class="py-2 px-3 text-xs bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- No Selection State -->
    <div v-else class="flex-1 flex items-center justify-center text-gray-500">
      <div class="text-center">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <p class="text-sm">Select an object to edit properties</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useDesignStore } from '../store/design';
import type { DesignObject } from '../types';

interface Props {
  selectedObject: DesignObject | null;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const { 
  updateObject: storeUpdateObject, 
  moveObjectToFront, 
  moveObjectToBack,
  addObject,
  deleteObject: storeDeleteObject
} = useDesignStore();

const localProps = ref<any>({});

// Watch for selected object changes and update local props
watch(
  () => props.selectedObject,
  (newObj) => {
    if (newObj) {
      localProps.value = { ...newObj.props };
    }
  },
  { immediate: true, deep: true }
);

const updateObject = () => {
  if (props.selectedObject) {
    storeUpdateObject(props.selectedObject.id, {
      props: { ...localProps.value }
    });
  }
};

const moveToFront = () => {
  if (props.selectedObject) {
    moveObjectToFront(props.selectedObject.id);
  }
};

const moveToBack = () => {
  if (props.selectedObject) {
    moveObjectToBack(props.selectedObject.id);
  }
};

const duplicateObject = () => {
  if (props.selectedObject) {
    const newObject = {
      type: props.selectedObject.type,
      props: {
        ...props.selectedObject.props,
        x: props.selectedObject.props.x + 20,
        y: props.selectedObject.props.y + 20,
      },
    };
    addObject(newObject);
  }
};

const deleteObject = () => {
  if (props.selectedObject) {
    storeDeleteObject(props.selectedObject.id);
  }
};

const flipImage = (direction: 'horizontal' | 'vertical') => {
  // TODO: Implement image flipping
  console.log(`Flip image ${direction}`);
};
</script>

<script lang="ts">
export default {
  name: 'PropertiesPanel'
};
</script>
