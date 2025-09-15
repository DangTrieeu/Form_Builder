import React from "react";
import { Edit3, Eye, Save, Settings } from "lucide-react";

// FormHeader component (top sticky bar only)
// Props: fieldsLength, onPreview, onSave
export default function FormHeader({
  fieldsLength = 0,
  onPreview,
  onSave,
}) {
  return (
    <header className="editor-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">
              <Edit3 size={20} />
            </div>
            <div className="logo-text">
              <h1>Form Builder</h1>
              <p>Tạo form dễ dàng và nhanh chóng</p>
            </div>
          </div>
          <div className="status-badges">
            <div className="status-badge questions">
              <span>{fieldsLength} câu hỏi</span>
            </div>
            <div className="status-badge saved">
              <span>Đã lưu</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={onPreview} className="btn btn-primary" type="button">
            <Eye size={18} />
            <span>Xem trước</span>
          </button>
          <button onClick={onSave} className="btn btn-secondary" type="button">
            <Save size={18} />
            <span>Lưu</span>
          </button>
          <button className="btn btn-icon" type="button">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
