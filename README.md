# Form Builder Pro (React + Vite)

Ứng dụng xây dựng biểu mẫu tương tự Google Forms với: soạn thảo trực quan, xem trước, lưu trữ lên Firestore, hiển thị lại, trang quản trị phản hồi realtime (Pusher), kiến trúc tách component rõ ràng và dễ mở rộng.

## 1. Tính năng hiện tại
- Trang giới thiệu (HomePage) với GooeyNav + TextType.
- Trình biên tập (Editor):
  - Thanh công cụ thêm nhanh các loại câu hỏi (text, textarea, radio, checkbox, select, email, number, date, time).
  - Chỉnh tiêu đề, mô tả, nội dung câu hỏi, bắt buộc / không.
  - Thêm / xoá / nhân bản câu hỏi, thêm tuỳ chọn cho nhóm lựa chọn.
- Xem trước (PreviewPage) – mô phỏng giao diện người dùng cuối.
- Lưu biểu mẫu lên Firestore (collection `forms`).
- Danh sách biểu mẫu đã lưu (/forms) và xem / trả lời thử (/forms/:id).
- Trang quản trị phản hồi (/admin/responses):
  - Danh sách form + số phản hồi.
  - Bảng phản hồi chi tiết, xem từng bản ghi.
  - Trạng thái realtime (Pusher) + cập nhật động khi có sự kiện form/response (nếu backend phát sự kiện).
- Kiến trúc tách component: FormHeader, FieldTypeToolbar, QuestionEditor, PreviewForm, ListForm, RenderForm, AdminResponses.
- CSS module hoá (glassmorphism, gradient) trong thư mục `styles/`.

## 2. Kiến trúc thư mục và các route hiện có

## Thư mục:
```
src/
  App.jsx                // Khai báo route
  firebase.js            // Khởi tạo Firebase + Firestore
  lib/pusherClient.js    // Client Pusher
  stores/formStore.js    // Zustand (formConfig, fields)
  datas/fieldTypes.js    // Metadata loại câu hỏi
  components/
    form-editor/         // Editor components
    form-preview/        // PreviewForm, (legacy QuestionPreview)
    form-render/         // ListForm, RenderForm
    common/              // ErrorBoundary
    ui/                  // GooeyNav, TextType
  pages/                 // HomePage, EditorPage, PreviewPage, AdminResponses
  styles/                // CSS tách riêng
```

## Route:
- `/` : HomePage
- `/editor` : tạo form mới
- `/preview` : xem trước form mới tạo
- `/forms` : Danh sách form đã lưu
- `/forms/:id` : Xem / trả lời form đã lưu
- `/admin/responses` : Quản trị phản hồi (danh sách form + phản hồi chi tiết)

## 3. Mô hình dữ liệu Firestore
Collection: `forms`
```json
{
  "formConfig": { "title": "...", "description": "..." },
  "fields": [
    { "id": 1736930400000, "type": "text", "label": "Họ tên", "required": true, "options": [] },
    { "id": 1736930401000, "type": "radio", "label": "Giới tính", "required": false, "options": ["Nam","Nữ"] }
  ],
  "createdAt": "2025-01-15T10:20:30.000Z"
}
```
Collection: `responses`
```json
{
  "formId": "<id form>",
  "answers": { "1736930400000": "Nguyễn Văn A", "1736930401000": "Nam" },
  "createdAt": "2025-01-15T10:25:11.000Z"
}
```

## 4. Realtime với Pusher
Client lắng nghe channel `form-builder` các event:
- `form:created|updated|deleted`
- `response:created|deleted`

## 5. Biến môi trường (.env)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
# Pusher
VITE_PUSHER_KEY=...
VITE_PUSHER_CLUSTER=ap1
```

## 6. Cài đặt & Chạy
```bash
npm install
npm run dev      # Dev server
npm run build    # Build production
npm run preview  # Preview build
```

## 7. Thêm loại câu hỏi
1. Thêm vào `datas/fieldTypes.js`:
```js
{ type: 'file', label: 'Tệp', icon: SomeIcon, description: 'Upload tệp' }
```
2. Bổ sung case trong `QuestionEditor.jsx` (preview) + `RenderForm.jsx` (runtime).

## 8. Xử lý lỗi & Debug
- Dùng `ErrorBoundary` tránh trắng màn hình.
- Kiểm tra console prefix: `[SAVE]` khi lưu form.
- Nếu Firestore báo `permission-denied`: chỉnh Firestore Rules `/forms` & `/responses` (chỉ nên mở tạm thời khi dev).
