// Định nghĩa các type cho ứng dụng Canva Editor

export interface DesignObject {
  id: string;
  type: 'shape' | 'text' | 'image';
  props: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    textContent?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    src?: string; // cho image
    shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line' | 'star' | 'heart' | 'diamond' | 'pentagon' | 'hexagon'; // cho shape
    borderRadius?: number;
    locked?: boolean; // lock position
  };
  zIndex: number;
}

export interface DesignState {
  objects: DesignObject[];
  selectedId: string | null;
  history: DesignObject[][];
  currentHistoryIndex: number;
  canvas: {
    width: number;
    height: number;
    backgroundColor: string;
    zoom: number;
    panX: number;
    panY: number;
  };
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  objects: DesignObject[];
}

export interface ShapeTemplate {
  id: string;
  name: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'line';
  defaultProps: Partial<DesignObject['props']>;
  icon: string;
}

export interface TextTemplate {
  id: string;
  name: string;
  defaultProps: Partial<DesignObject['props']>;
}
