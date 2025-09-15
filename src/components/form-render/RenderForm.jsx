import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import '../../styles/RenderForm.css';

export default function RenderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const ref = doc(db, 'forms', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError('Form không tồn tại');
        } else {
          setForm(snap.data());
        }
      } catch (e) {
        setError(e?.message || 'Lỗi tải form');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const setAnswer = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (loading) return <div className="render-center">Đang tải form...</div>;
  if (error) return <div className="render-center"><div className="render-error">{error}</div><button className="render-btn render-btn-secondary" onClick={() => navigate('/forms')}>← Danh sách</button></div>;
  if (!form) return null;

  const { formConfig, fields } = form;

  return (
    <div className="render-page">
      <div className="render-container">
        <div className="render-header">
          <h1 className="render-title">{formConfig?.title || 'Form không có tiêu đề'}</h1>
          {formConfig?.description && <p className="render-desc">{formConfig.description}</p>}
          <div className="render-meta">Số câu hỏi: {fields?.length || 0}</div>
          <div className="render-actions">
            <button className="render-btn render-btn-secondary" onClick={() => navigate('/forms')}>← Quay lại danh sách</button>
            <button className="render-btn render-btn-primary" onClick={() => navigate('/editor')}>Chỉnh sửa form mới</button>
          </div>
          <div className="render-divider" />
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="render-form">
            {(fields || []).map((f, idx) => (
              <div key={f.id} className="render-field-card">
                <label className="render-field-label"><span className="render-field-index">{idx + 1}.</span> {f.label || 'Câu hỏi'} {f.required && <span className="render-required">*</span>}</label>
                <div className="render-field-input">
                  {renderField(f, answers[f.id], v => setAnswer(f.id, v))}
                </div>
              </div>
            ))}
            <div className="render-submit-row">
              <button type="submit" className="render-btn render-submit-btn">Gửi phản hồi</button>
            </div>
          </form>
        )}

        {submitted && (
          <div className="render-thanks">
            <h3 className="render-thanks-title">Đã ghi nhận phản hồi!</h3>
            <p className="render-thanks-desc">Cảm ơn bạn đã hoàn thành biểu mẫu.</p>
            <div className="render-thanks-actions">
              <button className="render-btn render-btn-secondary" onClick={() => { setSubmitted(false); setAnswers({}); }}>Gửi lại</button>
              <button className="render-btn render-btn-secondary" onClick={() => navigate('/forms')}>Về danh sách</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderField(field, value, onChange) {
  const baseInputClass = 'render-input';
  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
    case 'date':
    case 'time':
      return <input className={baseInputClass} type={field.type === 'text' ? 'text' : field.type} value={value || ''} required={field.required} onChange={e => onChange(e.target.value)} placeholder={field.label} />;
    case 'textarea':
      return <textarea className={baseInputClass + ' render-textarea'} rows={4} value={value || ''} required={field.required} onChange={e => onChange(e.target.value)} placeholder={field.label} />;
    case 'radio':
      return (
        <div className="render-option-group">
          {(field.options||[]).map((opt,i)=>(
            <label key={i} className="render-option-item">
              <input type="radio" name={`f-${field.id}`} value={opt} checked={value===opt} onChange={e=>onChange(e.target.value)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="render-option-group">
          {(field.options||[]).map((opt,i)=>{
            const arr = Array.isArray(value)?value:[];
            const checked = arr.includes(opt);
            return (
              <label key={i} className="render-option-item">
                <input type="checkbox" value={opt} checked={checked} onChange={e=>{
                  if(e.target.checked) onChange([...(arr), opt]); else onChange(arr.filter(v=>v!==opt));
                }} />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      );
    case 'select':
      return (
        <select className={baseInputClass} value={value||''} required={field.required} onChange={e=>onChange(e.target.value)}>
          <option value="">-- Chọn --</option>
          {(field.options||[]).map((opt,i)=><option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    default:
      return <div className="render-unsupported">Không hỗ trợ loại: {field.type}</div>;
  }
}
