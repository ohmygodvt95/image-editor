<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">Text</h3>
    
    <!-- Add Text Button -->
    <div class="mb-6">
      <button
        @click="addTextBox"
        class="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Text</span>
      </button>
    </div>

    <!-- Text Presets -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-600 mb-3">Text Styles</h4>
      <div class="space-y-3">
        <div
          v-for="preset in textPresets"
          :key="preset.id"
          @click="addPresetText(preset)"
          class="p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div :style="getPreviewStyle(preset)" class="truncate">
            {{ preset.preview }}
          </div>
          <div class="text-xs text-gray-500 mt-1">{{ preset.name }}</div>
        </div>
      </div>
    </div>

    <!-- Font Families -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-600 mb-3">Font Families</h4>
      <div class="space-y-2">
        <button
          v-for="font in fontFamilies"
          :key="font.name"
          @click="addTextWithFont(font)"
          class="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          :style="{ fontFamily: font.value }"
        >
          {{ font.name }}
        </button>
      </div>
    </div>

    <!-- Quick Text Actions -->
    <div>
      <h4 class="text-sm font-medium text-gray-600 mb-3">Quick Actions</h4>
      <div class="space-y-2">
        <button
          @click="addQuote"
          class="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
        >
          Add Inspirational Quote
        </button>
        
        <button
          @click="addCurrentDate"
          class="w-full p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all"
        >
          Add Current Date
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesignStore } from '../../store/design';
import type { DesignObject } from '../../types';

const { addObject } = useDesignStore();

// Text presets
const textPresets = [
  {
    id: 'heading',
    name: 'Heading',
    preview: 'Your Heading Here',
    props: {
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      color: '#1F2937',
      textContent: 'Your Heading Here',
    }
  },
  {
    id: 'subheading',
    name: 'Subheading',
    preview: 'Your subheading text',
    props: {
      fontSize: 24,
      fontWeight: '600',
      fontFamily: 'Arial, sans-serif',
      color: '#374151',
      textContent: 'Your subheading text',
    }
  },
  {
    id: 'body',
    name: 'Body Text',
    preview: 'Your body text goes here',
    props: {
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      color: '#4B5563',
      textContent: 'Your body text goes here',
    }
  },
  {
    id: 'caption',
    name: 'Caption',
    preview: 'Small caption text',
    props: {
      fontSize: 12,
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      color: '#6B7280',
      textContent: 'Small caption text',
    }
  }
];

// Font families
const fontFamilies = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  { name: 'Impact', value: 'Impact, fantasy' },
];

// Get preview style for text presets
const getPreviewStyle = (preset: typeof textPresets[0]) => ({
  fontSize: `${Math.min(preset.props.fontSize, 18)}px`,
  fontWeight: preset.props.fontWeight,
  fontFamily: preset.props.fontFamily,
  color: preset.props.color,
});

// Add basic text box
const addTextBox = () => {
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'text',
    props: {
      x: 150,
      y: 150,
      width: 200,
      height: 40,
      textContent: 'Click to edit text',
      fontSize: 18,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      color: '#1F2937',
      textAlign: 'left',
    },
  };
  
  addObject(newObject);
};

// Add preset text
const addPresetText = (preset: typeof textPresets[0]) => {
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'text',
    props: {
      x: 150,
      y: 150,
      width: 300,
      height: preset.props.fontSize * 1.5,
      ...preset.props,
    },
  };
  
  addObject(newObject);
};

// Add text with specific font
const addTextWithFont = (font: typeof fontFamilies[0]) => {
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'text',
    props: {
      x: 150,
      y: 150,
      width: 250,
      height: 40,
      textContent: `Sample text in ${font.name}`,
      fontSize: 18,
      fontFamily: font.value,
      fontWeight: 'normal',
      color: '#1F2937',
      textAlign: 'left',
    },
  };
  
  addObject(newObject);
};

// Add inspirational quote
const addQuote = () => {
  const quotes = [
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Life is what happens to you while you're busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is during our darkest moments that we must focus to see the light.",
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'text',
    props: {
      x: 100,
      y: 200,
      width: 400,
      height: 80,
      textContent: `"${randomQuote}"`,
      fontSize: 20,
      fontFamily: 'Georgia, serif',
      fontWeight: 'italic',
      color: '#374151',
      textAlign: 'center',
    },
  };
  
  addObject(newObject);
};

// Add current date
const addCurrentDate = () => {
  const today = new Date();
  const dateString = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'text',
    props: {
      x: 150,
      y: 150,
      width: 300,
      height: 40,
      textContent: dateString,
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      color: '#6B7280',
      textAlign: 'left',
    },
  };
  
  addObject(newObject);
};
</script>
