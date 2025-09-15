import React, { useState } from 'react';

/*
  PreviewForm Component
  Props:
    - formConfig: { title, description }
    - fields: [{ id, type, label, required, options }]
    - onSubmit?(answers)
    - onBack?()
*/
export default function PreviewForm({ formConfig, fields = [], onSubmit, onBack }) {
  const [answers, setAnswers] = useState({});

  const updateAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(answers);
    // Tạm thời chỉ log ra (UI mục đích demo)
    console.log('Form answers:', answers);
  };

  const renderField = (field) => {
    const value = answers[field.id] ?? (field.type === 'checkbox' ? [] : '');

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
      case 'time':
        return (
          <input
            type={field.type === 'text' ? 'text' : field.type}
            className="pv-input"
            placeholder={field.label}
            value={value}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            className="pv-input pv-textarea"
            placeholder={field.label}
            rows={4}
            value={value}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'radio':
        return (
          <div className="pv-options pv-radio-group">
            {field.options?.map((opt, idx) => (
              <label key={idx} className="pv-option pv-radio-option">
                <input
                  type="radio"
                  name={`field-${field.id}`}
                  value={opt}
                  checked={value === opt}
                  onChange={() => updateAnswer(field.id, opt)}
                  required={field.required}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="pv-options pv-checkbox-group">
            {field.options?.map((opt, idx) => {
              const arr = Array.isArray(value) ? value : [];
              const checked = arr.includes(opt);
              return (
                <label key={idx} className="pv-option pv-checkbox-option">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateAnswer(field.id, [...arr, opt]);
                      } else {
                        updateAnswer(field.id, arr.filter(v => v !== opt));
                      }
                    }}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        );
      case 'select':
        return (
          <select
            className="pv-input"
            value={value}
            onChange={(e) => updateAnswer(field.id, e.target.value)}
            required={field.required}
          >
            <option value="">-- Chọn --</option>
            {field.options?.map((opt, idx) => (
              <option value={opt} key={idx}>{opt}</option>
            ))}
          </select>
        );
      default:
        return <div className="pv-unsupported">(Không hỗ trợ loại: {field.type})</div>;
    }
  };

  return (
    <div className="preview-wrapper">
      <form className="preview-form" onSubmit={handleSubmit}>
        <div className="pv-form-header">
          <h1 className="pv-title">{formConfig?.title || 'Form không có tiêu đề'}</h1>
          {formConfig?.description && (
            <p className="pv-desc">{formConfig.description}</p>
          )}
          <div className="pv-divider" />
        </div>

        <div className="pv-fields">
          {fields.length === 0 && (
            <div className="pv-empty">Chưa có câu hỏi nào. Quay lại để thêm.</div>
          )}
          {fields.map((f, idx) => (
            <div key={f.id} className="pv-field-card">
              <div className="pv-field-label">
                <span className="pv-field-index">{idx + 1}.</span> {f.label || 'Câu hỏi'}
                {f.required && <span className="pv-required">*</span>}
              </div>
              <div className="pv-field-input">
                {renderField(f)}
              </div>
            </div>
          ))}
        </div>

        <div className="pv-actions">
          {onBack && (
            <button type="button" className="pv-btn pv-btn-secondary" onClick={onBack}>Quay lại chỉnh sửa</button>
          )}
          <button type="submit" className="pv-btn pv-btn-primary">Gửi phản hồi</button>
        </div>
      </form>
    </div>
  );
}

