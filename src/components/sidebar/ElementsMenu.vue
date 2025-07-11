<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">Elements</h3>
    
    <!-- Basic Shapes -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-600 mb-3">Basic Shapes</h4>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="shape in shapes"
          :key="shape.id"
          @click="addShape(shape)"
          class="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <component :is="shape.icon" class="w-6 h-6 text-gray-600 mb-1" />
          <span class="text-xs text-gray-600 text-center">{{ shape.name }}</span>
        </div>
      </div>
    </div>

    <!-- Lines & Arrows -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-600 mb-3">Lines & Arrows</h4>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="line in lines"
          :key="line.id"
          @click="addLine(line)"
          class="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div :class="line.preview" class="mb-1"></div>
          <span class="text-xs text-gray-600 text-center">{{ line.name }}</span>
        </div>
      </div>
    </div>

    <!-- Icons -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-600 mb-3">Icons</h4>
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="icon in icons"
          :key="icon.id"
          @click="addIcon(icon)"
          class="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <component :is="icon.component" class="w-5 h-5 text-gray-600 mb-1" />
          <span class="text-xs text-gray-600 text-center">{{ icon.name }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h4 class="text-sm font-medium text-gray-600 mb-3">Quick Actions</h4>
      <div class="space-y-2">
        <button
          @click="addRandomShape"
          class="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          Add Random Shape
        </button>
        
        <button
          @click="addColorPalette"
          class="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
        >
          Add Color Palette
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesignStore } from '../../store/design';
import type { DesignObject } from '../../types';

const { addObject } = useDesignStore();

// Shape icons
const RectangleIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2" />
    </svg>
  `
};

const CircleIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
    </svg>
  `
};

const TriangleIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l10 18H2L12 2z" />
    </svg>
  `
};

const StarIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  `
};

const HeartIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `
};

const DiamondIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l4 6h6l-4 6-4 6-4-6-4-6h6l4-6z"/>
    </svg>
  `
};

const ArrowIcon = {
  template: `
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4l8 8-8 8V4z"/>
    </svg>
  `
};

// Predefined shapes
const shapes = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: RectangleIcon,
    defaultProps: {
      x: 100,
      y: 100,
      width: 120,
      height: 80,
      fill: '#3B82F6',
      stroke: '#1E40AF',
      strokeWidth: 2,
      borderRadius: 4,
    }
  },
  {
    id: 'circle',
    name: 'Circle',
    icon: CircleIcon,
    defaultProps: {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#EF4444',
      stroke: '#DC2626',
      strokeWidth: 2,
    }
  },
  {
    id: 'triangle',
    name: 'Triangle',
    icon: TriangleIcon,
    defaultProps: {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#10B981',
      stroke: '#059669',
      strokeWidth: 2,
    }
  },
  {
    id: 'star',
    name: 'Star',
    icon: StarIcon,
    defaultProps: {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#F59E0B',
      stroke: '#D97706',
      strokeWidth: 2,
    }
  },
  {
    id: 'heart',
    name: 'Heart', 
    icon: HeartIcon,
    defaultProps: {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#EF4444',
      stroke: '#DC2626',
      strokeWidth: 2,
    }
  },
  {
    id: 'diamond',
    name: 'Diamond',
    icon: DiamondIcon,
    defaultProps: {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#8B5CF6',
      stroke: '#7C3AED',
      strokeWidth: 2,
    }
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    icon: ArrowIcon,
    defaultProps: {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#10B981',
      stroke: '#059669',
      strokeWidth: 2,
    }
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    icon: DiamondIcon,
    defaultProps: {
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#F97316',
      stroke: '#EA580C',
      strokeWidth: 2,
    }
  }
];

// Icon components for UI
const icons = [
  { id: 'star', name: 'Star', component: StarIcon },
  { id: 'heart', name: 'Heart', component: HeartIcon },
  { id: 'diamond', name: 'Diamond', component: DiamondIcon },
  { id: 'arrow', name: 'Arrow', component: ArrowIcon }
];

// Predefined lines
const lines = [
  {
    id: 'line-solid',
    name: 'Solid Line',
    preview: 'h-0.5 bg-gray-800',
    defaultProps: {
      x: 100,
      y: 100,
      width: 150,
      height: 2,
      fill: '#374151',
    }
  },
  {
    id: 'line-dashed',
    name: 'Dashed Line',
    preview: 'h-0.5 bg-gray-800 border-dashed',
    defaultProps: {
      x: 100,
      y: 100,
      width: 150,
      height: 2,
      fill: '#374151',
      stroke: '#374151',
      strokeWidth: 1,
    }
  }
];

// Add shape to canvas
const addShape = (shape: typeof shapes[0]) => {
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'shape',
    props: {
      ...shape.defaultProps,
      shapeType: shape.id as any,
    },
  };
  
  addObject(newObject);
};

// Add line to canvas
const addLine = (line: typeof lines[0]) => {
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'shape',
    props: {
      ...line.defaultProps,
      shapeType: 'line',
    },
  };
  
  addObject(newObject);
};

// Add icon to canvas (using corresponding shape)
const addIcon = (icon: typeof icons[0]) => {
  // Find matching shape for the icon
  const matchingShape = shapes.find(shape => shape.id === icon.id);
  if (matchingShape) {
    addShape(matchingShape);
  }
};

// Add random shape with random colors
const addRandomShape = () => {
  const randomShapes = ['rectangle', 'circle', 'triangle', 'star'];
  const randomColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];
  
  const shapeType = randomShapes[Math.floor(Math.random() * randomShapes.length)];
  const color = randomColors[Math.floor(Math.random() * randomColors.length)];
  
  const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
    type: 'shape',
    props: {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      width: Math.random() * 100 + 60,
      height: Math.random() * 100 + 60,
      fill: color,
      stroke: color,
      strokeWidth: 2,
      shapeType: shapeType as any,
      rotation: Math.random() * 360,
    },
  };
  
  addObject(newObject);
};

// Add color palette (multiple colored rectangles)
const addColorPalette = () => {
  const colors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  
  colors.forEach((color, index) => {
    const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
      type: 'shape',
      props: {
        x: 100 + (index * 60),
        y: 200,
        width: 50,
        height: 50,
        fill: color,
        stroke: color,
        strokeWidth: 0,
        shapeType: 'rectangle',
        borderRadius: 8,
      },
    };
    
    addObject(newObject);
  });
};
</script>
