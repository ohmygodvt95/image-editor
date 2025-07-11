import { reactive } from 'vue';
import type { DesignState, DesignObject } from '../types';
import { StorageService } from '../services/storage';

// Tạo state mặc định
const createDefaultState = (): DesignState => ({
  objects: [],
  selectedId: null,
  history: [[]],
  currentHistoryIndex: 0,
  canvas: {
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    zoom: 1,
    panX: 0,
    panY: 0,
  },
});

// Load state từ localStorage hoặc tạo mới
const loadInitialState = (): DesignState => {
  const saved = StorageService.load();
  return saved || createDefaultState();
};

// Tạo reactive store
export const designStore = reactive<DesignState>(loadInitialState());

// Utility functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const saveToHistory = () => {
  // Xóa history sau current index (khi undo rồi thực hiện hành động mới)
  designStore.history = designStore.history.slice(0, designStore.currentHistoryIndex + 1);
  
  // Thêm state hiện tại vào history
  designStore.history.push([...designStore.objects]);
  designStore.currentHistoryIndex = designStore.history.length - 1;
  
  // Giới hạn số lượng history (tối đa 50 bước)
  if (designStore.history.length > 50) {
    designStore.history.shift();
    designStore.currentHistoryIndex--;
  }
};

// Store actions
export const useDesignStore = () => {
  // Object operations
  const addObject = (object: Omit<DesignObject, 'id' | 'zIndex'>) => {
    saveToHistory();
    
    const newObject: DesignObject = {
      ...object,
      id: generateId(),
      zIndex: Math.max(...designStore.objects.map(o => o.zIndex), 0) + 1,
    };
    
    designStore.objects.push(newObject);
    designStore.selectedId = newObject.id;
    save();
  };

  const updateObject = (id: string, updates: Partial<DesignObject>) => {
    const index = designStore.objects.findIndex(obj => obj.id === id);
    if (index !== -1) {
      // Không lưu vào history cho mỗi update nhỏ (như khi drag)
      // History sẽ được lưu khi kết thúc action
      Object.assign(designStore.objects[index], updates);
      save();
    }
  };

  const deleteObject = (id: string) => {
    saveToHistory();
    
    designStore.objects = designStore.objects.filter(obj => obj.id !== id);
    if (designStore.selectedId === id) {
      designStore.selectedId = null;
    }
    save();
  };

  const selectObject = (id: string | null) => {
    designStore.selectedId = id;
  };

  const moveObjectToFront = (id: string) => {
    saveToHistory();
    
    const object = designStore.objects.find(obj => obj.id === id);
    if (object) {
      const maxZ = Math.max(...designStore.objects.map(o => o.zIndex));
      object.zIndex = maxZ + 1;
      save();
    }
  };

  const moveObjectToBack = (id: string) => {
    saveToHistory();
    
    const object = designStore.objects.find(obj => obj.id === id);
    if (object) {
      const minZ = Math.min(...designStore.objects.map(o => o.zIndex));
      object.zIndex = minZ - 1;
      save();
    }
  };

  // Canvas operations
  const updateCanvas = (updates: Partial<DesignState['canvas']>) => {
    Object.assign(designStore.canvas, updates);
    save();
  };

  const setZoom = (zoom: number) => {
    designStore.canvas.zoom = Math.max(0.1, Math.min(5, zoom));
    save();
  };

  const setCanvasSize = (width: number, height: number) => {
    designStore.canvas.width = Math.max(200, Math.min(4000, width));
    designStore.canvas.height = Math.max(200, Math.min(4000, height));
    save();
  };

  const setPan = (x: number, y: number) => {
    designStore.canvas.panX = x;
    designStore.canvas.panY = y;
    save();
  };

  // History operations
  const undo = () => {
    if (designStore.currentHistoryIndex > 0) {
      designStore.currentHistoryIndex--;
      designStore.objects = [...designStore.history[designStore.currentHistoryIndex]];
      designStore.selectedId = null;
      save();
    }
  };

  const redo = () => {
    if (designStore.currentHistoryIndex < designStore.history.length - 1) {
      designStore.currentHistoryIndex++;
      designStore.objects = [...designStore.history[designStore.currentHistoryIndex]];
      designStore.selectedId = null;
      save();
    }
  };

  const canUndo = () => designStore.currentHistoryIndex > 0;
  const canRedo = () => designStore.currentHistoryIndex < designStore.history.length - 1;

  // File operations
  const save = () => {
    StorageService.save(designStore);
  };

  const load = () => {
    const loaded = StorageService.load();
    if (loaded) {
      Object.assign(designStore, loaded);
    }
  };

  const clear = () => {
    saveToHistory();
    
    Object.assign(designStore, createDefaultState());
    StorageService.clear();
  };

  const exportDesign = (filename?: string) => {
    StorageService.exportToFile(designStore, filename);
  };

  const importDesign = async (file: File) => {
    try {
      const imported = await StorageService.importFromFile(file);
      saveToHistory();
      Object.assign(designStore, imported);
      save();
    } catch (error) {
      throw error;
    }
  };

  // Getters
  const getSelectedObject = () => {
    return designStore.selectedId 
      ? designStore.objects.find(obj => obj.id === designStore.selectedId) 
      : null;
  };

  const getObjectsByType = (type: DesignObject['type']) => {
    return designStore.objects.filter(obj => obj.type === type);
  };

  // Commit to history (gọi khi kết thúc một action như drag, resize)
  const commitToHistory = () => {
    saveToHistory();
    save();
  };

  return {
    // State
    state: designStore,
    
    // Object operations
    addObject,
    updateObject,
    deleteObject,
    selectObject,
    moveObjectToFront,
    moveObjectToBack,
    
    // Canvas operations
    updateCanvas,
    setZoom,
    setCanvasSize,
    setPan,
    
    // History operations
    undo,
    redo,
    canUndo,
    canRedo,
    commitToHistory,
    
    // File operations
    save,
    load,
    clear,
    exportDesign,
    importDesign,
    
    // Getters
    getSelectedObject,
    getObjectsByType,
  };
};
