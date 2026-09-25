import React, { useEffect, useRef, useState, useCallback } from 'react';

// Modern SVG Icons for the toolbar
const Icons = {
  bold: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  ),
  italic: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  underline: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0 0 12 0V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  strike: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.3 4.9c-2.3-.6-5.8-.3-6.9 1.1-1.3 1.5-.7 3.5 1.5 4.3 1.9.7 4.9 1.2 5.1 3.5.2 2.7-2.6 4.2-5.4 4.2-3.1 0-5.4-1.3-6.6-2.5" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  ul: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  ol: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  unlink: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 2 20 20" />
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  eraser: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
      <path d="M22 21H7" />
      <path d="m5 11 9 9" />
    </svg>
  ),
  undo: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  ),
  redo: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
};

export default function RichTextEditor({
  label,
  value = '',
  onChange,
  placeholder = 'Write content here…',
  minHeight = 120,
}) {
  const editorRef = useRef(null);
  const isInternalChangeRef = useRef(false);
  const [activeFormats, setActiveFormats] = useState({});
  const [currentBlock, setCurrentBlock] = useState('p');
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  // Sync value from props into contentEditable without breaking cursor position
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (isInternalChangeRef.current) {
        isInternalChangeRef.current = false;
        return;
      }
      const incomingHtml = value ?? '';
      if (editorRef.current.innerHTML !== incomingHtml) {
        editorRef.current.innerHTML = incomingHtml;
      }
    }
  }, [value, isHtmlMode]);

  // Check which formatting options are currently active at cursor
  const updateToolbarState = useCallback(() => {
    if (isHtmlMode || !editorRef.current) return;
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strike: document.queryCommandState('strikeThrough'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
      });

      const block = document.queryCommandValue('formatBlock');
      if (block) {
        setCurrentBlock(block.toLowerCase().replace(/[<>]/g, ''));
      }
    } catch {
      // Ignored if selection not in document
    }
  }, [isHtmlMode]);

  const exec = (command, valueArg = null) => {
    if (isHtmlMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, valueArg);
    handleInput();
    updateToolbarState();
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    // Normalize empty content
    if (html === '<p><br></p>' || html === '<br>' || html === '<div><br></div>') {
      html = '';
    }
    isInternalChangeRef.current = true;
    onChange?.(html);
  };

  const handleLink = () => {
    if (isHtmlMode) return;
    const selection = window.getSelection();
    const existingUrl = selection?.anchorNode?.parentElement?.closest('a')?.getAttribute('href') || '';
    const url = window.prompt('Enter link URL (e.g. https://example.com or #contact):', existingUrl || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      exec('unlink');
    } else {
      exec('createLink', url.trim());
    }
  };

  const handleBlockChange = (event) => {
    const format = event.target.value;
    setCurrentBlock(format);
    if (format === 'p') {
      exec('formatBlock', '<p>');
    } else if (format === 'h2' || format === 'h3' || format === 'h4') {
      exec('formatBlock', `<${format}>`);
    } else if (format === 'blockquote') {
      exec('formatBlock', '<blockquote>');
    }
  };

  return (
    <div className="rich-text-editor-wrapper">
      {label && <span className="rich-text-label">{label}</span>}
      <div className={`rich-text-editor ${isHtmlMode ? 'is-html-mode' : ''}`}>
        {/* Toolbar */}
        <div className="rich-text-toolbar" role="toolbar" aria-label="Text formatting options">
          {/* Block type selector */}
          <select
            className="rich-text-select"
            value={currentBlock}
            onChange={handleBlockChange}
            disabled={isHtmlMode}
            title="Text style"
          >
            <option value="p">Paragraph</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="blockquote">Quote block</option>
          </select>

          <span className="rich-text-divider" />

          {/* Inline formatting buttons */}
          <button
            type="button"
            className={`rich-text-btn ${activeFormats.bold ? 'is-active' : ''}`}
            onClick={() => exec('bold')}
            disabled={isHtmlMode}
            title="Bold (Ctrl+B)"
          >
            {Icons.bold}
          </button>
          <button
            type="button"
            className={`rich-text-btn ${activeFormats.italic ? 'is-active' : ''}`}
            onClick={() => exec('italic')}
            disabled={isHtmlMode}
            title="Italic (Ctrl+I)"
          >
            {Icons.italic}
          </button>
          <button
            type="button"
            className={`rich-text-btn ${activeFormats.underline ? 'is-active' : ''}`}
            onClick={() => exec('underline')}
            disabled={isHtmlMode}
            title="Underline (Ctrl+U)"
          >
            {Icons.underline}
          </button>
          <button
            type="button"
            className={`rich-text-btn ${activeFormats.strike ? 'is-active' : ''}`}
            onClick={() => exec('strikeThrough')}
            disabled={isHtmlMode}
            title="Strikethrough"
          >
            {Icons.strike}
          </button>

          <span className="rich-text-divider" />

          {/* Lists */}
          <button
            type="button"
            className={`rich-text-btn ${activeFormats.ul ? 'is-active' : ''}`}
            onClick={() => exec('insertUnorderedList')}
            disabled={isHtmlMode}
            title="Bulleted list"
          >
            {Icons.ul}
          </button>
          <button
            type="button"
            className={`rich-text-btn ${activeFormats.ol ? 'is-active' : ''}`}
            onClick={() => exec('insertOrderedList')}
            disabled={isHtmlMode}
            title="Numbered list"
          >
            {Icons.ol}
          </button>

          <span className="rich-text-divider" />

          {/* Link / Unlink */}
          <button
            type="button"
            className="rich-text-btn"
            onClick={handleLink}
            disabled={isHtmlMode}
            title="Insert Link"
          >
            {Icons.link}
          </button>
          <button
            type="button"
            className="rich-text-btn"
            onClick={() => exec('unlink')}
            disabled={isHtmlMode}
            title="Remove Link"
          >
            {Icons.unlink}
          </button>
          <button
            type="button"
            className="rich-text-btn"
            onClick={() => exec('removeFormat')}
            disabled={isHtmlMode}
            title="Clear formatting"
          >
            {Icons.eraser}
          </button>

          <span className="rich-text-divider" />

          {/* Undo / Redo */}
          <button
            type="button"
            className="rich-text-btn"
            onClick={() => exec('undo')}
            disabled={isHtmlMode}
            title="Undo (Ctrl+Z)"
          >
            {Icons.undo}
          </button>
          <button
            type="button"
            className="rich-text-btn"
            onClick={() => exec('redo')}
            disabled={isHtmlMode}
            title="Redo (Ctrl+Y)"
          >
            {Icons.redo}
          </button>

          {/* HTML Source Mode Toggle on far right */}
          <button
            type="button"
            className={`rich-text-btn rich-text-code-toggle ${isHtmlMode ? 'is-active' : ''}`}
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            title={isHtmlMode ? 'Switch to Visual Editor' : 'Edit HTML Source code'}
            style={{ marginLeft: 'auto' }}
          >
            {Icons.code}
            <span>{isHtmlMode ? 'Visual' : 'HTML'}</span>
          </button>
        </div>

        {/* ContentEditable View OR HTML Code Textarea View */}
        {isHtmlMode ? (
          <textarea
            className="rich-text-code-area"
            value={value ?? ''}
            onChange={(e) => onChange?.(e.target.value)}
            style={{ minHeight: `${minHeight}px` }}
            placeholder="Edit raw HTML code…"
          />
        ) : (
          <div
            ref={editorRef}
            className="rich-text-content"
            contentEditable
            role="textbox"
            aria-multiline="true"
            data-placeholder={placeholder}
            onInput={handleInput}
            onKeyUp={updateToolbarState}
            onMouseUp={updateToolbarState}
            onFocus={updateToolbarState}
            style={{ minHeight: `${minHeight}px` }}
          />
        )}
      </div>
    </div>
  );
}
