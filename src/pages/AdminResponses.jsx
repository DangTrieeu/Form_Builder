import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import '../styles/AdminResponses.css';
import pusher from '../lib/pusherClient.js';

export default function AdminResponses() {
  const [forms, setForms] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [search, setSearch] = useState('');
  const [detailResponse, setDetailResponse] = useState(null); // object or null
  const [deleting, setDeleting] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [realtimeStatus, setRealtimeStatus] = useState(pusher ? 'connecting' : 'disabled');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const qForms = query(collection(db, 'forms'), orderBy('createdAt', 'desc'));
        const qResponses = query(collection(db, 'responses'), orderBy('createdAt', 'desc'));
        const [formsSnap, respSnap] = await Promise.all([getDocs(qForms), getDocs(qResponses)]);
        const formsData = formsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const respData = respSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setForms(formsData);
        setResponses(respData);
        // Auto select first form if none selected
        if (!selectedFormId && formsData.length) setSelectedFormId(formsData[0].id);
      } catch (e) {
        setError(e?.message || 'Lỗi tải dữ liệu');
      } finally { setLoading(false); }
    };
    load();
  }, [selectedFormId, refreshFlag]);

  useEffect(() => {
    if (!pusher) return; // missing config

    const connection = pusher.connection;
    const handleConnected = () => setRealtimeStatus('online');
    const handleDisconnected = () => setRealtimeStatus('offline');
    const handleFailed = () => setRealtimeStatus('failed');

    connection.bind('connected', handleConnected);
    connection.bind('disconnected', handleDisconnected);
    connection.bind('failed', handleFailed);

    // Single channel for all events
    const channel = pusher.subscribe('form-builder');

    // Form events
    channel.bind('form:created', (payload) => {
      if (!payload?.id) return;
      setForms(prev => prev.some(f => f.id === payload.id) ? prev : [ { id: payload.id, ...payload.data }, ...prev ]);
    });
    channel.bind('form:updated', (payload) => {
      if (!payload?.id) return;
      setForms(prev => prev.map(f => f.id === payload.id ? { ...f, ...payload.data } : f));
    });
    channel.bind('form:deleted', (payload) => {
      if (!payload?.id) return;
      setForms(prev => prev.filter(f => f.id !== payload.id));
      setResponses(prev => prev.filter(r => r.formId !== payload.id));
      if (selectedFormId === payload.id) {
        setSelectedFormId(null);
        setDetailResponse(null);
      }
    });

    channel.bind('response:created', (payload) => {
      if (!payload?.id || !payload?.formId) return;
      setResponses(prev => [{ id: payload.id, ...payload.data }, ...prev]);
    });
    channel.bind('response:deleted', (payload) => {
      if (!payload?.id) return;
      setResponses(prev => prev.filter(r => r.id !== payload.id));
      if (detailResponse && detailResponse.id === payload.id) setDetailResponse(null);
    });

    return () => {
      connection.unbind('connected', handleConnected);
      connection.unbind('disconnected', handleDisconnected);
      connection.unbind('failed', handleFailed);
      channel.unbind('form:created');
      channel.unbind('form:updated');
      channel.unbind('form:deleted');
      channel.unbind('response:created');
      channel.unbind('response:deleted');
      pusher.unsubscribe('form-builder');
    };
  }, [detailResponse, selectedFormId]);

  const groupedCounts = useMemo(() => {
    const map = {};
    for (const r of responses) {
      map[r.formId] = (map[r.formId] || 0) + 1;
    }
    return map;
  }, [responses]);

  const activeForm = useMemo(() => forms.find(f => f.id === selectedFormId) || null, [forms, selectedFormId]);
  const activeFields = activeForm?.fields || [];
  const fieldMap = useMemo(() => {
    const m = {}; activeFields.forEach(f => { m[f.id] = f; }); return m;
  }, [activeFields]);

  const filteredForms = useMemo(() => {
    if (!search.trim()) return forms;
    const q = search.toLowerCase();
    return forms.filter(f => (f.formConfig?.title || '').toLowerCase().includes(q));
  }, [forms, search]);

  const activeResponses = useMemo(() => responses.filter(r => r.formId === selectedFormId), [responses, selectedFormId]);

  const handleSelectForm = (id) => { setSelectedFormId(id); setDetailResponse(null); };

  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm('Xoá phản hồi này?')) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'responses', responseId));
      setResponses(prev => prev.filter(r => r.id !== responseId));
      if (detailResponse && detailResponse.id === responseId) setDetailResponse(null);
    } catch (e) {
      alert('Xoá thất bại: ' + (e?.message || 'Không rõ lỗi'));
    } finally { setDeleting(false); }
  };

  if (loading) return <div className="admin-center">Đang tải dữ liệu... (Realtime: {realtimeStatus})</div>;
  if (error) return <div className="admin-center admin-error">{error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2>Forms <span className={`realtime-badge rt-${realtimeStatus}`}>{realtimeStatus}</span></h2>
            <input
              type="text"
              className="admin-input admin-search"
              placeholder="Tìm form..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          <div className="admin-form-list">
            {filteredForms.map(f => {
              const count = groupedCounts[f.id] || 0;
              const active = f.id === selectedFormId;
              return (
                <button
                  key={f.id}
                  className={`admin-form-item ${active ? 'active': ''}`}
                  onClick={()=>handleSelectForm(f.id)}
                >
                  <div className="afi-title">{f.formConfig?.title || 'Không tiêu đề'}</div>
                  <div className="afi-meta">{count} phản hồi</div>
                </button>
              );
            })}
            {filteredForms.length === 0 && <div className="admin-empty">Không tìm thấy form phù hợp.</div>}
          </div>
          <div className="admin-sidebar-footer">
            <button className="admin-btn" onClick={()=>setRefreshFlag(x=>x+1)}>↻ Làm mới</button>
          </div>
        </aside>

        <main className="admin-main">
          {!activeForm && <div className="admin-placeholder">Chọn một form để xem phản hồi.</div>}
          {activeForm && (
            <div className="admin-content">
              <div className="admin-content-header">
                <div>
                  <h1 className="admin-form-title">{activeForm.formConfig?.title || 'Không tiêu đề'}</h1>
                  {activeForm.formConfig?.description && <p className="admin-form-desc">{activeForm.formConfig.description}</p>}
                  <div className="admin-form-stats">{activeFields.length} câu hỏi • {activeResponses.length} phản hồi</div>
                </div>
              </div>

              {activeResponses.length === 0 && <div className="admin-empty big">Chưa có phản hồi nào.</div>}
              {activeResponses.length > 0 && (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Thời gian</th>
                        {activeFields.map(f => <th key={f.id}>{f.label || f.id}</th>)}
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeResponses.map(r => (
                        <tr key={r.id} className={detailResponse && detailResponse.id===r.id ? 'highlight' : ''}>
                          <td className="nowrap">{formatDate(r.createdAt)}</td>
                          {activeFields.map(f => (
                            <td key={f.id}>{formatValueShort(r.answers?.[f.id])}</td>
                          ))}
                          <td className="nowrap actions">
                            <button className="admin-link" onClick={()=>setDetailResponse(r)}>Chi tiết</button>
                            <button className="admin-link danger" disabled={deleting} onClick={()=>handleDeleteResponse(r.id)}>Xoá</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailResponse && (
                <div className="admin-detail">
                  <div className="admin-detail-header">
                    <h3>Phản hồi chi tiết</h3>
                    <button className="admin-btn small" onClick={()=>setDetailResponse(null)}>Đóng</button>
                  </div>
                  <div className="admin-detail-body">
                    <div className="detail-meta">ID: {detailResponse.id}</div>
                    <div className="detail-meta">Thời gian: {formatDate(detailResponse.createdAt)}</div>
                    <div className="detail-answers">
                      {activeFields.map(f => (
                        <div key={f.id} className="detail-answer-item">
                          <div className="dai-label">{f.label || f.id}{f.required && <span className="req">*</span>}</div>
                          <div className="dai-value">{formatValueFull(detailResponse.answers?.[f.id])}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function formatValueShort(v) { if (v == null) return ''; if (Array.isArray(v)) return v.join(', '); const s = String(v); return s.length>40 ? s.slice(0,37)+'…' : s; }
function formatValueFull(v) { if (v == null) return <em className="muted">(trống)</em>; if (Array.isArray(v)) return v.join(', '); return String(v); }
function formatDate(d) { if (!d) return ''; try { return new Date(d).toLocaleString(); } catch { return d; } }
