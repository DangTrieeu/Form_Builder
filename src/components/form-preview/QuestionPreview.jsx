export default function QuestionPreview({ question, index, value, onChange, showProgress, totalQuestions }) {
  const handleChange = (newValue) => {
    onChange(newValue);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'short-text':
        return (
          <input
            type="text"
            className="form-input"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Nhập câu trả lời của bạn"
            required={question.required}
          />
        );

      case 'long-text':
        return (
          <textarea
            className="form-input textarea-input"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Nhập câu trả lời của bạn"
            rows={4}
            required={question.required}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            className="form-input"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="example@email.com"
            required={question.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className="form-input"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Nhập số"
            required={question.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className="form-input"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={question.required}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            className="form-input"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={question.required}
          />
        );

      case 'multiple-choice':
        return (
          <div className="radio-group">
            {question.options?.map((option, optionIndex) => (
              <label key={optionIndex} className="radio-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleChange(e.target.value)}
                  required={question.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="checkbox-group">
            {question.options?.map((option, optionIndex) => {
              const isChecked = Array.isArray(value) ? value.includes(option) : false;
              return (
                <label key={optionIndex} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={option}
                    checked={isChecked}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleChange([...currentValues, option]);
                      } else {
                        handleChange(currentValues.filter(v => v !== option));
                      }
                    }}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'dropdown':
        return (
          <select
            className="form-input"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={question.required}
          >
            <option value="">Chọn một tùy chọn</option>
            {question.options?.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="preview-question">
      {showProgress && totalQuestions > 0 && (
        <div style={{
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>Câu {index + 1} / {totalQuestions}</span>
          <div style={{
            flex: 1,
            height: '4px',
            background: '#e0e0e0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((index + 1) / totalQuestions) * 100}%`,
              height: '100%',
              background: '#4285f4',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      <div className="question-title">
        {question.title}
        {question.required && <span className="required-indicator"> *</span>}
      </div>

      {question.description && (
        <div className="question-description">
          {question.description}
        </div>
      )}

      {renderInput()}
    </div>
  );
}
