<template>
  <div
    :style="objectStyle"
    class="absolute cursor-pointer select-none"
    @mousedown="handleMouseDown"
    @click="handleClick"
  >
    <!-- Shape rendering -->
    <div
      v-if="object.type === 'shape'"
      :style="shapeStyle"
      class="w-full h-full"
    ></div>

    <!-- Text rendering -->
    <div
      v-else-if="object.type === 'text'"
      :style="textStyle"
      class="w-full h-full flex items-center"
      :contenteditable="isSelected"
      @blur="handleTextBlur"
      @input="handleTextInput"
    >
      {{ object.props.textContent }}
    </div>

    <!-- Image rendering -->
    <img
      v-else-if="object.type === 'image'"
      :src="object.props.src"
      :style="imageStyle"
      class="w-full h-full object-cover"
      draggable="false"
    />

    <!-- Selection handles -->
    <div v-if="isSelected" class="absolute inset-0 pointer-events-none">
      <!-- Selection border -->
      <div class="absolute inset-0 border-2 border-blue-500 border-dashed rounded"></div>
      
      <!-- Resize handles -->
      <template v-if="!object.props.locked">
        <div
          v-for="handle in resizeHandles"
          :key="handle.position"
          :class="handle.classes"
          :style="handle.style"
          @mousedown.stop="handleResizeStart(handle.position, $event)"
          class="pointer-events-auto"
        ></div>
      </template>
      
      <!-- Rotation handle -->
      <div
        v-if="!object.props.locked"
        class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab pointer-events-auto flex items-center justify-center hover:bg-blue-50 transition-colors"
        :style="rotationHandleStyle"
        @mousedown.stop="handleRotationStart"
        title="Rotate"
      >
        <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DesignObject } from '../types';

interface Props {
  object: DesignObject;
  isSelected: boolean;
}

interface Emits {
  (e: 'select', id: string): void;
  (e: 'update', id: string, updates: Partial<DesignObject>): void;
  (e: 'delete', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isDragging = ref(false);
const isResizing = ref(false);
const isRotating = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const resizeHandle = ref<string>('');

// Computed styles
const objectStyle = computed(() => ({
  left: `${props.object.props.x}px`,
  top: `${props.object.props.y}px`,
  width: `${props.object.props.width || 100}px`,
  height: `${props.object.props.height || 100}px`,
  transform: `rotate(${props.object.props.rotation || 0}deg)`,
  zIndex: props.object.zIndex,
}));

const shapeStyle = computed(() => {
  const props_obj = props.object.props;
  const baseStyle = {
    backgroundColor: props_obj.fill || 'transparent',
    border: props_obj.stroke ? `${props_obj.strokeWidth || 1}px solid ${props_obj.stroke}` : 'none',
  };

  switch (props_obj.shapeType) {
    case 'circle':
      return {
        ...baseStyle,
        borderRadius: '50%',
      };
    case 'triangle':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        width: 0,
        height: 0,
        borderLeft: `${(props_obj.width || 100) / 2}px solid transparent`,
        borderRight: `${(props_obj.width || 100) / 2}px solid transparent`,
        borderBottom: `${props_obj.height || 100}px solid ${props_obj.fill || '#000'}`,
        border: 'none',
      };
    case 'line':
      return {
        ...baseStyle,
        backgroundColor: props_obj.fill || props_obj.stroke || '#000',
        height: `${props_obj.strokeWidth || 2}px`,
      };
    case 'star':
      return {
        ...baseStyle,
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      };
    default: // rectangle
      return {
        ...baseStyle,
        borderRadius: `${props_obj.borderRadius || 0}px`,
      };
  }
});

const textStyle = computed(() => ({
  fontSize: `${props.object.props.fontSize || 16}px`,
  fontFamily: props.object.props.fontFamily || 'Arial, sans-serif',
  fontWeight: props.object.props.fontWeight || 'normal',
  color: props.object.props.color || '#000000',
  textAlign: props.object.props.textAlign || 'left',
  overflow: 'hidden',
  wordWrap: 'break-word' as any,
  outline: 'none',
}));

const imageStyle = computed(() => ({
  borderRadius: `${props.object.props.borderRadius || 0}px`,
}));

// Resize handles
const resizeHandles = computed(() => [
  {
    position: 'nw',
    classes: 'absolute w-2 h-2 bg-white border border-blue-500 rounded-full cursor-nw-resize -top-1 -left-1 hover:bg-blue-50',
    style: {},
  },
  {
    position: 'ne',
    classes: 'absolute w-2 h-2 bg-white border border-blue-500 rounded-full cursor-ne-resize -top-1 -right-1 hover:bg-blue-50',
    style: {},
  },
  {
    position: 'sw',
    classes: 'absolute w-2 h-2 bg-white border border-blue-500 rounded-full cursor-sw-resize -bottom-1 -left-1 hover:bg-blue-50',
    style: {},
  },
  {
    position: 'se',
    classes: 'absolute w-2 h-2 bg-white border border-blue-500 rounded-full cursor-se-resize -bottom-1 -right-1 hover:bg-blue-50',
    style: {},
  },
  {
    position: 'n',
    classes: 'absolute w-2 h-2 bg-white border border-blue-500 rounded-full cursor-n-resize -top-1 hover:bg-blue-50',
    style: { left: '50%', transform: 'translateX(-50%)' },
  },
  {
    position: 's',
    classes: 'absolute w-2 h-2 bg-white border border-blue-500 rounded-full cursor-s-resize -bottom-1 hover:bg-blue-50',
    style: { left: '50%', transform: 'translateX(-50%)' },
  },
  {
    position: 'w',
    classes: 'absolute w-2 h-2 bg-white border border-blue-500 rounded-full cursor-w-resize -left-1 hover:bg-blue-50',
    style: { top: '50%', transform: 'translateY(-50%)' },
  },
  {
    position: 'e',
    classes: 'absolute w-2 h-2 bg-white border border-blue-500 rounded-full cursor-e-resize -right-1 hover:bg-blue-50',
    style: { top: '50%', transform: 'translateY(-50%)' },
  },
]);

const rotationHandleStyle = computed(() => ({
  top: '-35px',
  left: '50%',
  transform: 'translateX(-50%)',
}));

// Event handlers
const handleClick = (event: MouseEvent) => {
  event.stopPropagation();
  emit('select', props.object.id);
};

const handleMouseDown = (event: MouseEvent) => {
  // Don't allow dragging if object is locked
  if (props.object.props.locked) {
    emit('select', props.object.id);
    return;
  }
  
  if (props.isSelected && event.button === 0) {
    isDragging.value = true;
    dragStart.value = {
      x: event.clientX - props.object.props.x,
      y: event.clientY - props.object.props.y,
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value) {
    const newX = event.clientX - dragStart.value.x;
    const newY = event.clientY - dragStart.value.y;
    
    emit('update', props.object.id, {
      props: {
        ...props.object.props,
        x: newX,
        y: newY,
      },
    });
  }
  
  if (isResizing.value) {
    handleResize(event);
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
  isResizing.value = false;
  isRotating.value = false;
  resizeHandle.value = '';
  
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

// Resize handling
const handleResizeStart = (position: string, event: MouseEvent) => {
  // Don't allow resizing if object is locked
  if (props.object.props.locked) {
    return;
  }
  
  event.stopPropagation();
  isResizing.value = true;
  resizeHandle.value = position;
  dragStart.value = { x: event.clientX, y: event.clientY };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const handleResize = (event: MouseEvent) => {
  const deltaX = event.clientX - dragStart.value.x;
  const deltaY = event.clientY - dragStart.value.y;
  
  const currentProps = props.object.props;
  let newProps = { ...currentProps };
  
  switch (resizeHandle.value) {
    case 'se': // Southeast - resize from bottom-right
      newProps.width = Math.max(20, (currentProps.width || 100) + deltaX);
      newProps.height = Math.max(20, (currentProps.height || 100) + deltaY);
      break;
    case 'sw': // Southwest - resize from bottom-left
      newProps.width = Math.max(20, (currentProps.width || 100) - deltaX);
      newProps.height = Math.max(20, (currentProps.height || 100) + deltaY);
      newProps.x = currentProps.x + deltaX;
      break;
    case 'ne': // Northeast - resize from top-right
      newProps.width = Math.max(20, (currentProps.width || 100) + deltaX);
      newProps.height = Math.max(20, (currentProps.height || 100) - deltaY);
      newProps.y = currentProps.y + deltaY;
      break;
    case 'nw': // Northwest - resize from top-left
      newProps.width = Math.max(20, (currentProps.width || 100) - deltaX);
      newProps.height = Math.max(20, (currentProps.height || 100) - deltaY);
      newProps.x = currentProps.x + deltaX;
      newProps.y = currentProps.y + deltaY;
      break;
    case 'n': // North - resize height from top
      newProps.height = Math.max(20, (currentProps.height || 100) - deltaY);
      newProps.y = currentProps.y + deltaY;
      break;
    case 's': // South - resize height from bottom
      newProps.height = Math.max(20, (currentProps.height || 100) + deltaY);
      break;
    case 'w': // West - resize width from left
      newProps.width = Math.max(20, (currentProps.width || 100) - deltaX);
      newProps.x = currentProps.x + deltaX;
      break;
    case 'e': // East - resize width from right
      newProps.width = Math.max(20, (currentProps.width || 100) + deltaX);
      break;
  }
  
  emit('update', props.object.id, { props: newProps });
  dragStart.value = { x: event.clientX, y: event.clientY };
};

const handleRotationStart = (event: MouseEvent) => {
  // Don't allow rotation if object is locked
  if (props.object.props.locked) {
    return;
  }
  
  event.stopPropagation();
  isRotating.value = true;
  dragStart.value = { x: event.clientX, y: event.clientY };
  
  document.addEventListener('mousemove', handleRotationMove);
  document.addEventListener('mouseup', handleRotationEnd);
};

const handleRotationMove = (event: MouseEvent) => {
  if (!isRotating.value) return;
  
  const rect = (event.target as HTMLElement).closest('.absolute')?.getBoundingClientRect();
  if (!rect) return;
  
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
  const rotation = (angle * 180) / Math.PI + 90; // Convert to degrees
  
  emit('update', props.object.id, {
    props: {
      ...props.object.props,
      rotation: rotation,
    },
  });
};

const handleRotationEnd = () => {
  isRotating.value = false;
  document.removeEventListener('mousemove', handleRotationMove);
  document.removeEventListener('mouseup', handleRotationEnd);
};

// Text editing
const handleTextInput = (event: Event) => {
  const target = event.target as HTMLElement;
  emit('update', props.object.id, {
    props: {
      ...props.object.props,
      textContent: target.textContent || '',
    },
  });
};

const handleTextBlur = () => {
  // Text editing finished
};
</script>

<script lang="ts">
export default {
  name: 'CanvasObject'
};
</script>
