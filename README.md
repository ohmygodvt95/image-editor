# Canva Editor Clone

Một ứng dụng web editor giống Canva được xây dựng với Vue 3 + TailwindCSS + TypeScript.

## Tính năng chính

- ✅ **Canvas Engine**: Canvas với zoom, pan, grid
- ✅ **Object Management**: Thêm, chỉnh sửa, xóa objects
- ✅ **Shape Tools**: Rectangle, Circle, Triangle, Star, Line
- ✅ **Text Tools**: Multiple text styles, fonts, formatting
- ✅ **Image Upload**: Upload ảnh từ máy tính và URL
- ✅ **Templates**: Predefined templates cho social media, business, etc.
- ✅ **Transform Controls**: Drag, resize, rotate objects
- ✅ **Layer Management**: Z-index, bring to front/back
- ✅ **Undo/Redo**: History management
- ✅ **Local Storage**: Tự động lưu design
- ✅ **Export/Import**: JSON format
- ✅ **Responsive UI**: Modern, clean interface

## Hướng dẫn sử dụng

1. **Thêm Elements**: Click vào sidebar tabs để thêm shapes, text, hoặc upload images
2. **Chỉnh sửa**: Click vào object để select, drag để move, dùng handles để resize
3. **Properties Panel**: Chỉnh sửa properties trong panel bên phải khi select object
4. **Keyboard Shortcuts**:
   - `Ctrl+Z`: Undo
   - `Ctrl+Y`: Redo
   - `Delete`: Delete selected object
   - `Ctrl+D`: Duplicate object
   - `Arrow keys`: Move object (Shift for 10px steps)

## Tech Stack

- **Vue 3**: Composition API, TypeScript
- **TailwindCSS v4**: Modern styling
- **Vite**: Fast build tool
- **TypeScript**: Type safety
- **LocalStorage**: Data persistence

## Development

```bash
npm install
npm run dev
```

Mở http://localhost:5173 để xem ứng dụng.
