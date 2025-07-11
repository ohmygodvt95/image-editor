import type { DesignState } from '../types';

export class StorageService {
  private static readonly STORAGE_KEY = 'canva_editor_design';

  /**
   * Lưu design state vào localStorage
   */
  static save(state: DesignState): void {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Lỗi khi lưu design:', error);
    }
  }

  /**
   * Tải design state từ localStorage
   */
  static load(): DesignState | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.error('Lỗi khi tải design:', error);
      return null;
    }
  }

  /**
   * Xóa design state khỏi localStorage
   */
  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Xuất design ra file JSON
   */
  static exportToFile(state: DesignState, filename: string = 'design.json'): void {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Lỗi khi xuất file:', error);
    }
  }

  /**
   * Import design từ file JSON
   */
  static importFromFile(file: File): Promise<DesignState> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const state = JSON.parse(result);
          resolve(state);
        } catch (error) {
          reject(new Error('File không hợp lệ'));
        }
      };
      
      reader.onerror = () => reject(new Error('Lỗi khi đọc file'));
      reader.readAsText(file);
    });
  }
}
