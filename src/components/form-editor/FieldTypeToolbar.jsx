import React from 'react';
import { fieldTypes } from '../../datas/fieldTypes.js';

/*
  Props:
    - onAdd(type)
*/
export default function FieldTypeToolbar({ onAdd }) {
  return (
    <div className="editor-tools">
      <div className="tools-inner">
        <div className="tools-title">Thêm câu hỏi</div>
        <div className="tools-list">
          {fieldTypes.map(ft => {
            const Icon = ft.icon;
            return (
              <button
                key={ft.type}
                type="button"
                className={`tool-btn ${ft.type}`}
                onClick={() => onAdd && onAdd(ft.type)}
                title={ft.description}
              >
                <span className="tool-icon"><Icon size={18} /></span>
                <span className="tool-label">{ft.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

