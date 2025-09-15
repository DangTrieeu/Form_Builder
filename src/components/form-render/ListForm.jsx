import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../stores/formStore';
import '../../styles/ListForm.css';

export default function ListForm() {
    const navigate = useNavigate();
    const { forms, loading, error, fetchForms } = useFormStore();

    useEffect(() => {
        fetchForms();
    }, [fetchForms]);

    return (
        <div className="list-page">
            <div className="list-container">
                <div className="list-header">
                    <h1 className="list-title">Danh sách Form</h1>
                    <div className="list-actions">
                        <button
                            className="list-btn list-btn-secondary"
                            onClick={fetchForms}
                            disabled={loading}
                        >
                            ↻ Làm mới
                        </button>
                        <button
                            className="list-btn list-btn-primary"
                            onClick={() => navigate('/editor')}
                        >
                            + Form mới
                        </button>
                    </div>
                </div>

                {loading && <div className="list-loading">Đang tải...</div>}
                {error && <div className="list-error">{error}</div>}
                {!loading && !error && forms.length === 0 && (
                    <div className="list-empty">Chưa có form nào. Hãy tạo form đầu tiên.</div>
                )}

                <div className="list-grid">
                    {forms.map((form) => {
                        const title = form.formConfig?.title || 'Không tiêu đề';
                        const created = form.createdAt
                            ? new Date(form.createdAt).toLocaleString()
                            : '—';
                        const fieldCount = form.fields?.length || 0;

                        return (
                            <div
                                key={form.id}
                                className="list-card"
                                onClick={() => navigate(`/forms/${form.id}`)}
                            >
                                <div className="list-card-header">
                                    <h2 className="list-card-title">{title}</h2>
                                    <span className="list-badge">{fieldCount} câu hỏi</span>
                                </div>
                                {form.formConfig?.description && (
                                    <p className="list-card-desc">{form.formConfig.description}</p>
                                )}
                                <div className="list-card-meta">Tạo lúc: {created}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
