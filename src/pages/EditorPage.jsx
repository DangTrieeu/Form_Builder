import { useFormStore } from "../stores/formStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../styles/EditorPage.css';

import FormHeader from "../components/form-editor/FormHeader.jsx";
import FieldTypeToolbar from "../components/form-editor/FieldTypeToolbar.jsx";
import QuestionEditor from "../components/form-editor/QuestionEditor.jsx";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";

export default function EditorPage() {
  const navigate = useNavigate();
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Store selectors
  const formConfig = useFormStore((state) => state.formConfig);
  const fields = useFormStore((state) => state.fields);
  const addField = useFormStore((state) => state.addField);
  const removeField = useFormStore((state) => state.removeField);
  const updateField = useFormStore((state) => state.updateField);
  const updateFormConfig = useFormStore((state) => state.updateFormConfig);

  const handlePreview = () => navigate("/preview");

  const handleFieldUpdate = (fieldId, updates) => {
    try { updateField(fieldId, updates); } catch (e) { console.error(e); }
  };

  const addOption = (fieldId) => {
    try {
      const field = fields.find(f => f.id === fieldId);
      if (field && ['checkbox', 'radio', 'select'].includes(field.type)) {
        const newOptions = [...(field.options || []), `Tùy chọn ${(field.options?.length || 0) + 1}`];
        updateField(fieldId, { options: newOptions });
      }
    } catch (e) { console.error(e); }
  };

  const removeOption = (fieldId, optionIndex) => {
    try {
      const field = fields.find(f => f.id === fieldId);
      if (field && field.options) {
        const newOptions = field.options.filter((_, idx) => idx !== optionIndex);
        updateField(fieldId, { options: newOptions });
      }
    } catch (e) { console.error(e); }
  };

  const updateOption = (fieldId, optionIndex, newValue) => {
    try {
      const field = fields.find(f => f.id === fieldId);
      if (field && field.options) {
        const newOptions = [...field.options];
        newOptions[optionIndex] = newValue;
        updateField(fieldId, { options: newOptions });
      }
    } catch (e) { console.error(e); }
  };

  const duplicateField = (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const duplicatedField = { ...field, id: Date.now(), label: field.label + " (Copy)" };
      addField(duplicatedField.type);
      setTimeout(() => {
        const newFields = useFormStore.getState().fields;
        const latestField = newFields[newFields.length - 1];
        updateField(latestField.id, duplicatedField);
      }, 0);
    }
  };

    const handleSave = async () => {
        if (isSaving) return;
        try {
            setIsSaving(true);
            console.log('[SAVE] Bắt đầu lưu form...', { formConfig, fields });
            if (!formConfig || !fields) throw new Error('State rỗng');
            const docRef = await addDoc(collection(db, "forms"), {
                formConfig,
                fields,
                createdAt: new Date().toISOString(),
            });
            console.log('[SAVE] Thành công, id:', docRef.id);
            alert("Form đã lưu vào Firebase! ID: " + docRef.id);
            navigate("/forms");
        } catch (e) {
            console.error("[SAVE] Error:", e);
            alert("Lưu thất bại: " + (e?.message || 'Không rõ lỗi'));
        } finally {
            setIsSaving(false);
        }
    };

  if (!formConfig || !fields) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <FormHeader
        fieldsLength={fields.length}
        onPreview={handlePreview}
        onSave={handleSave}
        isSaving={isSaving}
      />
      <FieldTypeToolbar onAdd={addField} />

      <div className="editor-main-wrapper">
        <QuestionEditor
          formConfig={formConfig}
          onUpdateFormConfig={updateFormConfig}
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onUpdateField={handleFieldUpdate}
          onDuplicateField={duplicateField}
          onRemoveField={removeField}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onUpdateOption={updateOption}
        />
      </div>
    </div>
  );
}