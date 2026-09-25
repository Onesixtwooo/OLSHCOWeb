import React from 'react';

/**
 * Checks if a string contains HTML tags.
 */
export function isHtml(str) {
  if (typeof str !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Renders rich text or plain text with preserved line breaks.
 */
export default function RichText({
  content,
  defaultContent = '',
  as: Component = 'div',
  className = '',
  ...props
}) {
  const value = content !== undefined && content !== null && content !== '' ? content : defaultContent;

  if (!value) return null;

  const stringValue = String(value);

  if (isHtml(stringValue)) {
    return (
      <Component
        className={`rich-text ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: stringValue }}
        {...props}
      />
    );
  }

  // Plain text with possible newlines
  const lines = stringValue.split('\n');
  if (lines.length > 1) {
    return (
      <Component className={`rich-text ${className}`.trim()} {...props}>
        {lines.map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </Component>
    );
  }

  return (
    <Component className={`rich-text ${className}`.trim()} {...props}>
      {stringValue}
    </Component>
  );
}
