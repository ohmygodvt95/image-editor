Dưới đây là đề xuất bộ **task** (backlog) và **basic design** ở mức high-level để xây dựng một web editor giống Canva, chỉ với phần frontend (Vue 3 + TailwindCSS) và lưu tạm data lên LocalStorage.

---

## 1. Task Breakdown

| Epic                    | Task                                                                                   | Ước lượng |
| ----------------------- | -------------------------------------------------------------------------------------- | --------- |
| **Project Setup**       | - Khởi tạo repo Vue 3 + TailwindCSS                                                    | 1d        |
|                         | - Cấu hình ESLint, Prettier, Husky                                                     | 0.5d      |
|                         | - Thiết lập LocalStorage service (get/set JSON)                                        | 0.5d      |
| **Canvas Core**         | - Tạo component `CanvasArea.vue` với `<div contenteditable="false">`                   | 1d        |
|                         | - Cài đặt hệ thống coordinate, grid, và background (size, màu, ảnh…)                   | 1d        |
|                         | - Drag & Drop cơ bản: kéo elements từ sidebar vào Canvas                               | 1d        |
|                         | - Thao tác transform: chọn, di chuyển, scale, rotate, xóa object trên Canvas           | 2d        |
|                         | - Quản lý layer/z-index                                                                | 0.5d      |
| **Template Menu**       | - `TemplateMenu.vue`: hiển thị list ảnh/mẫu sẵn có                                     | 0.5d      |
|                         | - Click chọn template: copy toàn bộ object vào Canvas                                  | 1d        |
| **Elements Menu**       | - `ElementsMenu.vue`: list shape (rect, circle, line, icon…)                           | 0.5d      |
|                         | - Cấu hình prop mặc định (size, color…)                                                | 0.5d      |
|                         | - Kéo thả shape vào Canvas                                                             | 1d        |
| **Text Menu**           | - `TextMenu.vue`: nút “Add Textbox”, preset style (heading, subheading, body…)         | 0.5d      |
|                         | - Thêm textbox vào Canvas, chỉnh sửa text inline, chọn font, size, color, alignment    | 1.5d      |
| **Upload File**         | - `UploadMenu.vue`: input file chỉ accept image (png/jpeg…)                            | 0.5d      |
|                         | - Hiển thị thumbnail đã tải lên, kéo thả ảnh vào Canvas                                | 1d        |
| **State Management**    | - Sử dụng Vue Reactive hoặc Pinia/store: lưu list objects hiện có, thuộc tính, history | 1d        |
|                         | - Lưu/Load design từ LocalStorage (serialize toàn bộ scene)                            | 1d        |
| **UI Layout & Styling** | - Header toolbar (Undo/Redo, Save, Clear…)                                             | 1d        |
|                         | - Sidebar với tabs: Template / Elements / Text / Upload                                | 1d        |
|                         | - Responsive layout (desktop-first)                                                    | 1d        |
| **Utility & Extras**    | - Undo/Redo stack                                                                      | 1.5d      |
|                         | - Zoom In/Out, Pan Canvas                                                              | 1d        |
|                         | - Export to image (canvas.toDataURL)                                                   | 1d        |
|                         | - Thêm snackbar/toast confirm khi Save, Clear                                          | 0.5d      |

> Tổng cộng khoảng \~17 ngày công. Có thể refine thêm khi vào chi tiết sprint.

---

## 2. Basic Design Overview

### 2.1. Component Structure

```
App.vue
├─ HeaderToolbar.vue
│   ├─ UndoRedoButtons
│   ├─ SaveButton
│   └─ ClearButton
├─ Sidebar.vue
│   └─ <TabPanel>
│       ├─ TemplateMenu.vue
│       ├─ ElementsMenu.vue
│       ├─ TextMenu.vue
│       └─ UploadMenu.vue
└─ CanvasArea.vue
    └─ CanvasObject.vue  ← đổ object (shape/text/image) theo prop
```

### 2.2. Data Model (in Store)

```ts
interface DesignObject {
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
    textContent?: string;
    fontSize?: number;
    fontFamily?: string;
    // ...
  };
  zIndex: number;
}

interface DesignState {
  objects: DesignObject[];
  selectedId: string | null;
  history: DesignObject[][]; // undo stack
}
```

### 2.3. LocalStorage Service

```ts
class StorageService {
  static save(state: DesignState) {
    localStorage.setItem('canva_clone', JSON.stringify(state));
  }
  static load(): DesignState | null {
    const raw = localStorage.getItem('canva_clone');
    return raw ? JSON.parse(raw) : null;
  }
}
```

### 2.4. Drag & Drop Flow

1. **Drag Start** trên menu ⇒ emit event `add-object` kèm payload `{ type, defaultProps }`.
2. **CanvasArea** lắng nghe, thêm 1 `DesignObject` mới vào store với props gốc.
3. Người dùng drag nội bộ ⇒ cập nhật `x,y` realtime qua pointer events.

### 2.5. Transform Controls

* Khi click vào object, vẽ các handle (4 góc + rotate).
* Kéo handle ⇒ tính toán transform dựa mouse delta.
* Dùng CSS transform (`translate`, `rotate`, `scale`) hoặc trực tiếp mutate `props`.

---
