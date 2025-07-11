<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">Templates</h3>
    
    <!-- Template Categories -->
    <div class="mb-4">
      <div class="flex space-x-2 mb-4">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-3 py-2 text-sm rounded-md transition-colors',
            selectedCategory === category.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Templates Grid -->
    <div class="space-y-4">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
        @click="applyTemplate(template)"
      >
        <!-- Template Preview -->
        <div class="h-32 bg-gradient-to-br relative" :class="template.gradient">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-white text-center">
              <div class="font-bold text-lg mb-1">{{ template.title }}</div>
              <div class="text-sm opacity-90">{{ template.subtitle }}</div>
            </div>
          </div>
        </div>
        
        <!-- Template Info -->
        <div class="p-3">
          <h4 class="font-medium text-gray-800">{{ template.name }}</h4>
          <p class="text-sm text-gray-600">{{ template.description }}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-gray-500">{{ template.objects.length }} elements</span>
            <button
              @click.stop="previewTemplate(template)"
              class="text-xs text-blue-500 hover:text-blue-700"
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Template Actions -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <h4 class="text-sm font-medium text-gray-600 mb-3">Custom Templates</h4>
      <div class="space-y-2">
        <button
          @click="saveCurrentAsTemplate"
          class="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Save Current as Template
        </button>
        
        <button
          @click="createBlankTemplate"
          class="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Create Blank Template
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDesignStore } from '../../store/design';
import type { DesignObject } from '../../types';

const { addObject, clear, state } = useDesignStore();

const selectedCategory = ref('all');

// Template categories
const categories = [
  { id: 'all', name: 'All' },
  { id: 'social', name: 'Social Media' },
  { id: 'business', name: 'Business' },
  { id: 'education', name: 'Education' },
  { id: 'event', name: 'Events' },
];

// Predefined templates
const templates = [
  {
    id: 'social-post-1',
    name: 'Instagram Post',
    description: 'Modern social media post template',
    category: 'social',
    title: 'Social Post',
    subtitle: 'Share your story',
    gradient: 'from-pink-400 to-purple-600',
    objects: [
      {
        type: 'shape',
        props: {
          x: 50,
          y: 50,
          width: 300,
          height: 300,
          fill: '#EC4899',
          shapeType: 'rectangle',
          borderRadius: 20,
        }
      },
      {
        type: 'text',
        props: {
          x: 80,
          y: 150,
          width: 240,
          height: 40,
          textContent: 'Your Amazing Story',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
        }
      }
    ]
  },
  {
    id: 'business-card-1',
    name: 'Business Card',
    description: 'Professional business card design',
    category: 'business',
    title: 'Business',
    subtitle: 'Professional card',
    gradient: 'from-blue-500 to-cyan-600',
    objects: [
      {
        type: 'shape',
        props: {
          x: 50,
          y: 100,
          width: 350,
          height: 200,
          fill: '#3B82F6',
          shapeType: 'rectangle',
          borderRadius: 10,
        }
      },
      {
        type: 'text',
        props: {
          x: 70,
          y: 130,
          width: 200,
          height: 30,
          textContent: 'John Doe',
          fontSize: 20,
          fontWeight: 'bold',
          color: '#FFFFFF',
        }
      },
      {
        type: 'text',
        props: {
          x: 70,
          y: 160,
          width: 200,
          height: 20,
          textContent: 'Software Developer',
          fontSize: 14,
          color: '#E5E7EB',
        }
      }
    ]
  },
  {
    id: 'presentation-slide-1',
    name: 'Presentation Slide',
    description: 'Clean presentation slide template',
    category: 'education',
    title: 'Education',
    subtitle: 'Learn & present',
    gradient: 'from-green-400 to-blue-500',
    objects: [
      {
        type: 'shape',
        props: {
          x: 50,
          y: 50,
          width: 500,
          height: 300,
          fill: '#FFFFFF',
          stroke: '#E5E7EB',
          strokeWidth: 2,
          shapeType: 'rectangle',
          borderRadius: 8,
        }
      },
      {
        type: 'text',
        props: {
          x: 80,
          y: 100,
          width: 440,
          height: 40,
          textContent: 'Presentation Title',
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1F2937',
          textAlign: 'center',
        }
      },
      {
        type: 'text',
        props: {
          x: 80,
          y: 160,
          width: 440,
          height: 120,
          textContent: 'Add your content here. This is a sample presentation slide that you can customize with your own text and elements.',
          fontSize: 16,
          color: '#4B5563',
          textAlign: 'center',
        }
      }
    ]
  },
  {
    id: 'event-flyer-1',
    name: 'Event Flyer',
    description: 'Eye-catching event promotion flyer',
    category: 'event',
    title: 'Event',
    subtitle: 'Promote your event',
    gradient: 'from-orange-400 to-red-500',
    objects: [
      {
        type: 'shape',
        props: {
          x: 50,
          y: 50,
          width: 300,
          height: 400,
          fill: '#F97316',
          shapeType: 'rectangle',
          borderRadius: 15,
        }
      },
      {
        type: 'text',
        props: {
          x: 80,
          y: 120,
          width: 240,
          height: 50,
          textContent: 'AMAZING EVENT',
          fontSize: 26,
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
        }
      },
      {
        type: 'text',
        props: {
          x: 80,
          y: 200,
          width: 240,
          height: 30,
          textContent: 'December 25, 2024',
          fontSize: 18,
          color: '#FEF3C7',
          textAlign: 'center',
        }
      }
    ]
  }
];

// Filtered templates based on category
const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') {
    return templates;
  }
  return templates.filter(template => template.category === selectedCategory.value);
});

// Apply template to canvas
const applyTemplate = (template: typeof templates[0]) => {
  if (confirm('This will replace your current design. Continue?')) {
    clear();
    
    template.objects.forEach(obj => {
      const newObject: Omit<DesignObject, 'id' | 'zIndex'> = {
        type: obj.type as DesignObject['type'],
        props: { ...obj.props } as DesignObject['props'],
      };
      
      addObject(newObject);
    });
  }
};

// Preview template (for now, just log it)
const previewTemplate = (template: typeof templates[0]) => {
  console.log('Previewing template:', template.name);
  // TODO: Implement preview modal or overlay
};

// Save current design as template
const saveCurrentAsTemplate = () => {
  if (state.objects.length === 0) {
    alert('Add some elements to your design first!');
    return;
  }
  
  const templateName = prompt('Enter template name:');
  if (templateName) {
    // TODO: Save to localStorage or user templates
    console.log('Saving template:', templateName, state.objects);
    alert('Template saved! (This is a demo - implement saving to user templates)');
  }
};

// Create blank template
const createBlankTemplate = () => {
  if (confirm('This will clear your current design. Continue?')) {
    clear();
  }
};
</script>
