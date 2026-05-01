import React, { useRef } from 'react';

const BBCodeEditor = ({ value, onChange, placeholder, rows = 5 }) => {
    const textareaRef = useRef(null);

    const insertTag = (tagStart, tagEnd) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end, text.length);

        const newText = before + tagStart + selected + tagEnd + after;
        onChange(newText);

        // Refocus and set cursor position inside the tags if no text was selected
        setTimeout(() => {
            textarea.focus();
            if (start === end) {
                textarea.setSelectionRange(start + tagStart.length, start + tagStart.length);
            } else {
                textarea.setSelectionRange(start, start + tagStart.length + selected.length + tagEnd.length);
            }
        }, 0);
    };

    return (
        <div className="bbcode-editor-container" style={{ border: '1px solid var(--forum-border-light)', background: 'var(--forum-white)' }}>
            <div className="bbcode-toolbar" style={{ display: 'flex', gap: 'var(--forum-gap-sm)', padding: 'var(--forum-gap-sm)', background: 'var(--forum-row-even)', borderBottom: '1px solid var(--forum-border-light)' }}>
                <button type="button" className="forum-btn forum-btn-sm" onClick={() => insertTag('[b]', '[/b]')}><b>B</b></button>
                <button type="button" className="forum-btn forum-btn-sm" onClick={() => insertTag('[i]', '[/i]')}><i>I</i></button>
                <button type="button" className="forum-btn forum-btn-sm" onClick={() => insertTag('[u]', '[/u]')}><u>U</u></button>
                <button type="button" className="forum-btn forum-btn-sm" onClick={() => insertTag('[img]', '[/img]')}>IMG</button>
                <button type="button" className="forum-btn forum-btn-sm" onClick={() => insertTag('[quote]', '[/quote]')}>QUOTE</button>
            </div>
            <textarea
                ref={textareaRef}
                className="forum-textarea"
                style={{ border: 'none', borderRadius: 0, borderTop: 'none' }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                required
            />
        </div>
    );
};

export default BBCodeEditor;
