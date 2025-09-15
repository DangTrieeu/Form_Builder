# Form Builder Pro (React + Vite)

Dự án này là một ứng dụng tạo biểu mẫu (form builder) giống trải nghiệm Google Forms: soạn câu hỏi, xem trước, lưu trữ và hiển thị lại form đã lưu. Xây dựng bằng React + Vite, quản lý state với Zustand + Immer và lưu form lên Firebase Firestore.

## Tính năng chính
- Trang chủ giới thiệu (Hero + hiệu ứng GooeyNav + TextType).
- Trình biên tập biểu mẫu (Editor):
  - Thêm nhanh các loại câu hỏi qua thanh công cụ ghim (sticky toolbar).
  - Chỉnh sửa tiêu đề, mô tả form, nhãn câu hỏi, trạng thái bắt buộc.
  - Thêm / sửa / xoá tùy chọn với các field chọn lựa (radio, checkbox, select).
  - Nhân bản câu hỏi.
- Xem trước (Preview) giao diện form giống người dùng cuối.
- Lưu form lên Firestore (nút Lưu).
- Danh sách form đã lưu (/forms) + xem chi tiết / điền thử (/forms/:id).
- Kiến trúc component tách rõ: FormHeader, FieldTypeToolbar, QuestionEditor, PreviewForm, ListForm, RenderForm.
- CSS tách file (styles/*) + hiệu ứng gradient, glassmorphism.

## Công nghệ sử dụng
| Nhóm | Thư viện |
|------|----------|
| UI | React 19, Vite |
| State | Zustand + Immer |
| Icons | lucide-react |
| Build & Dev | Vite, ESLint |
| Styling | CSS thuần + Tailwind config (có thể mở rộng) |
| Backend (DB) | Firebase Firestore |

## Cấu trúc thư mục chính
```
src/
  App.jsx                // Khai báo route
  main.jsx               // Mount React
  firebase.js            // Khởi tạo Firebase + Firestore
  stores/formStore.js    // Zustand store (formConfig, fields,...)
  datas/fieldTypes.js    // Định nghĩa metadata các loại field
  components/
    form-editor/         // Thành phần cho trang editor
    form-preview/        // Thành phần preview
    form-render/         // List & render form lưu trữ
    ui/                  // GooeyNav, TextType
    common/ErrorBoundary // Bắt lỗi runtime
  pages/                 // Trang điều hướng chính (Home, Editor, Preview, ...)
  styles/                // CSS tách riêng theo module
```

## Các route hiện có
| Route | Mô tả |
|-------|------|
| `/` | Trang giới thiệu (HomePage) |
| `/editor` | Tạo / chỉnh form cục bộ (state trong Zustand) |
| `/preview` | Xem trước form đang soạn |
| `/forms` | Danh sách form lưu trên Firestore |
| `/forms/:id` | Hiển thị và điền thử form đã lưu |

## Cài đặt & chạy
```bash
# Cài dependencies
npm install

# Chạy môi trường dev
npm run dev

# Build production
npm run build

# Preview bản build
npm run preview
```

## Firebase cấu hình
Hiện tại file `firebase.js` đang ghi trực tiếp cấu hình:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## Quy trình lưu Form
1. Người dùng soạn câu hỏi ở `/editor`.
2. Nhấn Lưu → gửi { formConfig, fields, createdAt } vào Firestore (collection `forms`).
3. Điều hướng sang `/forms` để xem danh sách.
4. Chọn form → `/forms/:id` hiển thị và người dùng có thể nhập thử.

## Thêm loại câu hỏi mới
1. Mở `src/datas/fieldTypes.js` thêm phần tử:
```js
{ type: 'file', label: 'Tệp', icon: SomeIcon, description: 'Upload tệp' }
```
2. Trong `QuestionEditor.jsx` và `RenderForm.jsx` bổ sung xử lý hiển thị (case mới trong switch / renderField).
3. (Tuỳ chọn) Thêm logic lưu dữ liệu phụ trợ (ví dụ upload file → Cloudinary / S3 / Uploadcare).

