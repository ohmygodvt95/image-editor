<template>
  <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <!-- Left section -->
    <div class="flex items-center space-x-4">
      <h1 class="text-xl font-bold text-gray-800">Canva Editor</h1>
      
      <!-- Undo/Redo buttons -->
      <div class="flex items-center space-x-2">
        <button
          @click="undo"
          :disabled="!canUndo()"
          class="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Hoàn tác (Ctrl+Z)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        
        <button
          @click="redo"
          :disabled="!canRedo()"
          class="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Làm lại (Ctrl+Y)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Center section - Canvas info -->
    <div class="flex items-center space-x-4 text-sm text-gray-600">
      <span>{{ state.objects.length }} objects</span>
    </div>

    <!-- Right section -->
    <div class="flex items-center space-x-3">
      <!-- File operations -->
      <div class="flex items-center space-x-2">
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          @change="handleImport"
          class="hidden"
        />
        
        <button
          @click="fileInput?.click()"
          class="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          title="Import design"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <span>Import</span>
        </button>
        
        <button
          @click="() => exportDesign()"
          class="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          title="Export design"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>JSON</span>
        </button>
        
        <button
          @click="exportToImage"
          class="flex items-center space-x-2 px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          title="Export to Image"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Image</span>
        </button>
        
        <button
          @click="saveDesign"
          class="flex items-center space-x-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          title="Lưu design"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Save</span>
        </button>
        
        <button
          @click="clearDesign"
          class="flex items-center space-x-2 px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          title="Xóa tất cả"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Clear</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDesignStore } from '../store/design';
import { ExportService } from '../services/exportService';

const { 
  state, 
  undo, 
  redo, 
  canUndo, 
  canRedo, 
  setZoom, 
  save, 
  clear, 
  exportDesign, 
  importDesign 
} = useDesignStore();

const fileInput = ref<HTMLInputElement>();

// Zoom operations
const zoomIn = () => {
  setZoom(state.canvas.zoom * 1.2);
};

const zoomOut = () => {
  setZoom(state.canvas.zoom / 1.2);
};

const resetZoom = () => {
  setZoom(1);
};

// File operations
const saveDesign = () => {
  save();
  // TODO: Hiển thị thông báo thành công
  console.log('Design đã được lưu!');
};

const clearDesign = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả?')) {
    clear();
  }
};

const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    try {
      await importDesign(file);
      console.log('Import thành công!');
    } catch (error) {
      console.error('Import thất bại:', error);
      alert('Không thể import file. Vui lòng kiểm tra định dạng file.');
    }
    
    // Reset input
    input.value = '';
  }
};

// Export to image
const exportToImage = async () => {
  try {
    // Find canvas area element
    const canvasElement = document.querySelector('.canvas-area') as HTMLElement;
    if (!canvasElement) {
      alert('Không tìm thấy canvas để export!');
      return;
    }

    // Show loading state
    console.log('Đang export image...');
    
    // Export to PNG
    await ExportService.exportToImage(canvasElement, 'canva-design', 'png');
    
    console.log('Export image thành công!');
  } catch (error) {
    console.error('Export image thất bại:', error);
    alert('Không thể export image. Vui lòng thử lại.');
  }
};

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'z':
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        break;
      case 'y':
        event.preventDefault();
        redo();
        break;
      case 's':
        event.preventDefault();
        saveDesign();
        break;
    }
  }
};

// Add keyboard event listeners
document.addEventListener('keydown', handleKeydown);
</script>
