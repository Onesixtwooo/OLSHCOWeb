import React from 'react';

/**
 * Checks if a string contains HTML tags.
 */
export function isHtml(str) {
  if (typeof str !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

const ALLOWED_TAGS = new Set(['a', 'b', 'blockquote', 'br', 'em', 'h2', 'h3', 'h4', 'i', 'li', 'ol', 'p', 's', 'strong', 'u', 'ul']);
const ALLOWED_ATTRIBUTES = new Set(['href', 'target', 'rel']);
const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

/** Keep editor formatting while removing scripts, event handlers, and unsafe links. */
export function sanitizeHtml(html) {
  if (typeof html !== 'string' || typeof DOMParser === 'undefined') return '';

  const parsed = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = parsed.body.firstElementChild;
  if (!root) return '';

  const clean = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType !== Node.ELEMENT_NODE) return;

      const element = child;
      clean(element);
      if (!ALLOWED_TAGS.has(element.tagName.toLowerCase())) {
        element.replaceWith(...element.childNodes);
        return;
      }

      [...element.attributes].forEach((attribute) => {
        if (!ALLOWED_ATTRIBUTES.has(attribute.name.toLowerCase())) element.removeAttribute(attribute.name);
      });

      if (element.tagName.toLowerCase() === 'a') {
        const href = element.getAttribute('href') || '';
        let safe = href.startsWith('#');
        try {
          safe = safe || SAFE_URL_PROTOCOLS.has(new URL(href, window.location.origin).protocol);
        } catch {
          safe = false;
        }
        if (!safe) element.removeAttribute('href');
        if (element.getAttribute('target') === '_blank') element.setAttribute('rel', 'noopener noreferrer');
      }
    });
  };

  clean(root);
  return root.innerHTML;
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
    const safeHtml = sanitizeHtml(stringValue);
    return (
      <Component
        className={`rich-text ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
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
