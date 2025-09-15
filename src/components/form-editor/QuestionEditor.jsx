import React from "react";
import { Plus, GripVertical, Copy, Trash2, MoreVertical } from "lucide-react";
import { getFieldTypeMeta } from "../../datas/fieldTypes.js";

/*
  QuestionEditor
  Props:
    - formConfig {title, description}
    - onUpdateFormConfig(updates)
    - fields []
    - selectedFieldId
    - onSelectField(id)
    - onUpdateField(id, updates)
    - onDuplicateField(id)
    - onRemoveField(id)
    - onAddOption(fieldId)
    - onRemoveOption(fieldId, index)
    - onUpdateOption(fieldId, index, value)
*/
export default function QuestionEditor({
  formConfig,
  onUpdateFormConfig,
  fields = [],
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onDuplicateField,
  onRemoveField,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
}) {
  return (
    <main className="editor-main">
      <div className="main-content">
        {/* Form Header (Title + Description) */}
        <div className="form-header">
          <div className="form-header-content">
            <div>
              <input
                type="text"
                value={formConfig?.title || ""}
                onChange={(e) => onUpdateFormConfig && onUpdateFormConfig({ title: e.target.value })}
                className="form-title-input"
                placeholder="Tiêu đề form của bạn"
              />
              <div className="title-divider"></div>
            </div>
            <div>
              <textarea
                value={formConfig?.description || ""}
                onChange={(e) => onUpdateFormConfig && onUpdateFormConfig({ description: e.target.value })}
                className="form-desc-input"
                placeholder="Thêm mô tả để giải thích mục đích của form..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Fields */}
        <div>
          {(!fields || fields.length === 0) ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Plus size={40} />
              </div>
              <h3>Bắt đầu tạo form</h3>
              <p>Chọn loại câu hỏi từ NavBar bên trên để bắt đầu xây dựng form của bạn</p>
            </div>
          ) : (
            fields.map((field, index) => {
              const meta = getFieldTypeMeta(field.type) || { label: field.type };
              return (
                <div
                  key={field.id}
                  className={`field-card ${selectedFieldId === field.id ? 'selected' : ''}`}
                  onClick={() => onSelectField && onSelectField(field.id)}
                >
                  <div className="field-header">
                    <div className="field-info">
                      <div className="field-drag">
                        <GripVertical size={16} />
                        <div className="field-number"><span>{index + 1}</span></div>
                      </div>
                      <div className="field-meta">
                        <div className="field-badges">
                          <span className={`field-type-badge ${field.type}`}>{meta.label}</span>
                          {field.required && <span className="required-badge">Bắt buộc</span>}
                        </div>
                        <input
                          type="text"
                          value={field.label || ""}
                          onChange={(e) => onUpdateField && onUpdateField(field.id, { label: e.target.value })}
                          className="field-label-input"
                          placeholder="Nhập câu hỏi của bạn..."
                        />
                      </div>
                    </div>
                    <div className="field-actions">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicateField && onDuplicateField(field.id); }}
                        className="action-btn duplicate"
                        title="Nhân bản"
                        type="button"
                      >
                        <Copy size={16} />
                      </button>
                      <button className="action-btn" type="button"><MoreVertical size={16} /></button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemoveField && onRemoveField(field.id); }}
                        className="action-btn delete"
                        title="Xoá"
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="field-preview">
                    {field.type === 'text' && (
                      <input type="text" placeholder="Câu trả lời văn bản ngắn" className="preview-input" disabled />
                    )}
                    {field.type === 'textarea' && (
                      <textarea placeholder="Câu trả lời văn bản dài..." className="preview-textarea" rows={4} disabled />
                    )}
                    {field.type === 'email' && (
                      <input type="email" placeholder="example@email.com" className="preview-input" disabled />
                    )}
                    {field.type === 'number' && (
                      <input type="number" placeholder="Nhập số" className="preview-input" disabled />
                    )}
                    {field.type === 'date' && (<input type="date" className="preview-input" disabled />)}
                    {field.type === 'time' && (<input type="time" className="preview-input" disabled />)}

                    {['checkbox', 'radio', 'select'].includes(field.type) && (
                      <div className="options-container">
                        {field.options && field.options.length > 0 && field.type !== 'select' && field.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="option-item">
                            {field.type === 'checkbox' && (<input type="checkbox" disabled />)}
                            {field.type === 'radio' && (<input type="radio" disabled name={`field-${field.id}`} />)}
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => onUpdateOption && onUpdateOption(field.id, optionIndex, e.target.value)}
                              className="option-input"
                              placeholder="Tùy chọn"
                            />
                            <button
                              onClick={() => onRemoveOption && onRemoveOption(field.id, optionIndex)}
                              className="option-delete"
                              type="button"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        {field.type === 'select' && (
                          <select disabled className="preview-input">
                            {field.options?.map((opt, idx) => <option key={idx}>{opt}</option>)}
                          </select>
                        )}

                        {field.type !== 'select' && (
                          <button onClick={() => onAddOption && onAddOption(field.id)} className="add-option-btn" type="button">
                            <Plus size={16} />
                            <span>Thêm tuỳ chọn</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="field-settings">
                    <label className="setting-checkbox">
                      <input
                        type="checkbox"
                        checked={field.required || false}
                        onChange={(e) => onUpdateField && onUpdateField(field.id, { required: e.target.checked })}
                      />
                      <span>Bắt buộc</span>
                    </label>
                    <div className="field-id"><span>ID: {field.id}</span></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {fields && fields.length > 0 && (
          <div className="editor-footer">
            <div className="footer-divider"></div>
            <p className="footer-text">Thêm câu hỏi mới từ NavBar bên trên</p>
          </div>
        )}
      </div>
    </main>
  );
}

