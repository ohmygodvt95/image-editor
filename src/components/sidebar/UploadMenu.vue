<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">Upload</h3>
    
    <!-- Upload Area -->
    <div class="mb-6">
      <div
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        :class="{ 'border-blue-400 bg-blue-50': isDragging }"
      >
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p class="text-sm text-gray-600 mb-2">
          <span class="font-medium">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-500">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
      
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
    </div>

    <!-- Uploaded Images -->
    <div v-if="uploadedImages.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-600 mb-3">Your Images</h4>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="image in uploadedImages"
          :key="image.id"
          class="relative group cursor-pointer"
          @click="addImageToCanvas(image)"
        >
          <img
            :src="image.thumbnail"
            :alt="image.name"
            class="w-full h-20 object-cover rounded-lg border border-gray-200 group-hover:border-blue-400 transition-colors"
          />
          
          <!-- Delete button -->
          <button
            @click.stop="removeImage(image.id)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Image info -->
          <div class="mt-1">
            <p class="text-xs text-gray-600 truncate">{{ image.name }}</p>
            <p class="text-xs text-gray-400">{{ formatFileSize(image.size) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sample Images -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-600 mb-3">Sample Images</h4>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="sample in sampleImages"
          :key="sample.id"
          class="cursor-pointer group"
          @click="addSampleImageToCanvas(sample)"
        >
          <div class="w-full h-20 rounded-lg border border-gray-200 group-hover:border-blue-400 transition-colors flex items-center justify-center bg-gradient-to-br"
               :class="sample.gradient">
            <span class="text-white font-medium text-sm">{{ sample.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- URL Input -->
    <div>
      <h4 class="text-sm font-medium text-gray-600 mb-3">Add from URL</h4>
      <div class="flex space-x-2">
        <input
          v-model="imageUrl"
          type="url"
          placeholder="Enter image URL..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          @click="addImageFromUrl"
          :disabled="!imageUrl.trim()"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useDesignStore } from '../../store/design';
import type { DesignObject } from '../../types';

const { addObject } = useDesignStore();

const fileInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const imageUrl = ref('');

interface UploadedImage {
  id: string;
  name: string;
  size: number;
  src: string;
  thumbnail: string;
}

const uploadedImages = reactive<UploadedImage[]>([]);

// Sample images (placeholders)
const sampleImages = [
  { id: 'sample1', name: 'Nature', gradient: 'from-green-400 to-blue-500' },
  { id: 'sample2', name: 'City', gradient: 'from-gray-400 to-gray-600' },
  { id: 'sample3', name: 'Ocean', gradient: 'from-blue-400 to-cyan-500' },
  { id: 'sample4', name: 'Sunset', gradient: 'from-orange-400 to-red-500' },
  { id: 'sample5', name: 'Forest', gradient: 'from-green-500 to-green-700' },
  { id: 'sample6', name: 'Mountain', gradient: 'from-purple-400 to-indigo-600' },
];

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Handle file selection
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (files) {
    handleFiles(Array.from(files));
  }
};

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files) {
    handleFiles(Array.from(files));
  }
};

// Process uploaded files
const handleFiles = (files: File[]) => {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const uploadedImage: UploadedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          src,
          thumbnail: src, // In real app, you might want to create a smaller thumbnail
        };
        
        uploadedImages.push(uploadedImage);
      };
      
      reader.readAsDataURL(file);
    }
  });
};

// Add uploaded image to canvas
const addImageToCanvas = (image: UploadedImage) => {
  // Create a temporary image to get dimensions
  const img = new Image();
  img.onload = () => {
    const maxWidth = 300;
    const maxHeight = 300;
    let { width, height } = img;
    
    // Scale down if too large
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }
    
    const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
      type: 'image',
      props: {
        x: 150,
        y: 150,
        width,
        height,
        src: image.src,
      },
    };
    
    addObject(newObject);
  };
  img.src = image.src;
};

// Add sample image to canvas
const addSampleImageToCanvas = (sample: typeof sampleImages[0]) => {
  // Create a colored rectangle as placeholder for sample image
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'shape',
    props: {
      x: 150,
      y: 150,
      width: 200,
      height: 150,
      fill: getSampleImageColor(sample.gradient),
      stroke: 'transparent',
      strokeWidth: 0,
      shapeType: 'rectangle',
      borderRadius: 8,
    },
  };
  
  addObject(newObject);
};

// Get color from gradient class
const getSampleImageColor = (gradient: string): string => {
  const colorMap: Record<string, string> = {
    'from-green-400 to-blue-500': '#10B981',
    'from-gray-400 to-gray-600': '#6B7280',
    'from-blue-400 to-cyan-500': '#3B82F6',
    'from-orange-400 to-red-500': '#F97316',
    'from-green-500 to-green-700': '#10B981',
    'from-purple-400 to-indigo-600': '#8B5CF6',
  };
  return colorMap[gradient] || '#6B7280';
};

// Add image from URL
const addImageFromUrl = () => {
  if (!imageUrl.value.trim()) return;
  
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  img.onload = () => {
    const maxWidth = 300;
    const maxHeight = 300;
    let { width, height } = img;
    
    // Scale down if too large
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }
    
    const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
      type: 'image',
      props: {
        x: 150,
        y: 150,
        width,
        height,
        src: imageUrl.value,
      },
    };
    
    addObject(newObject);
    imageUrl.value = '';
  };
  
  img.onerror = () => {
    alert('Could not load image from URL. Please check the URL and try again.');
  };
  
  img.src = imageUrl.value;
};

// Remove uploaded image
const removeImage = (id: string) => {
  const index = uploadedImages.findIndex(img => img.id === id);
  if (index !== -1) {
    uploadedImages.splice(index, 1);
  }
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Drag events
const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};
</script>
