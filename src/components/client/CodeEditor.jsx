import { useState, useEffect, useRef } from 'react';
import './CodeEditor.css';

function CodeEditor({ value, onChange }) {
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="code-editor-container">
      <textarea
        ref={textareaRef}
        className="code-editor"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Nhập code C++ của bạn ở đây..."
        spellCheck={false}
      />
    </div>
  );
}

export default CodeEditor;





