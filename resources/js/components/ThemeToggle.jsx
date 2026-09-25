import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'olshco_theme';

export const getStoredTheme = () => {
  if (typeof window === 'undefined') return 'blue';
  try {
    return localStorage.getItem(STORAGE_KEY) || 'blue';
  } catch (e) {
    return 'blue';
  }
};

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  const targetTheme = theme === 'maroon' ? 'maroon' : 'blue';
  document.documentElement.setAttribute('data-theme', targetTheme);
  try {
    localStorage.setItem(STORAGE_KEY, targetTheme);
  } catch (e) {
    // Ignore storage errors
  }
  window.dispatchEvent(new CustomEvent('olshco:themechange', { detail: { theme: targetTheme } }));
};

export default function ThemeToggle({ className = '', variant = 'navbar' }) {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    // Sync initial theme
    const current = getStoredTheme();
    setTheme(current);
    applyTheme(current);

    const handleThemeChange = (e) => {
      if (e.detail?.theme && e.detail.theme !== theme) {
        setTheme(e.detail.theme);
      }
    };

    window.addEventListener('olshco:themechange', handleThemeChange);
    return () => window.removeEventListener('olshco:themechange', handleThemeChange);
  }, [theme]);

  const toggle = (nextTheme) => {
    const target = nextTheme || (theme === 'maroon' ? 'blue' : 'maroon');
    setTheme(target);
    applyTheme(target);
  };

  return (
    <div
      className={`theme-toggle-container theme-toggle-${variant} ${className}`}
      role="group"
      aria-label="Color theme selector"
    >
      <button
        type="button"
        className={`theme-toggle-btn ${theme === 'maroon' ? 'is-maroon' : 'is-blue'}`}
        onClick={() => toggle()}
        aria-label={`Current theme: ${theme === 'maroon' ? 'Maroon' : 'Blue'}. Click to switch to ${
          theme === 'maroon' ? 'Blue' : 'Maroon'
        }`}
        title={`Switch to ${theme === 'maroon' ? 'Blue' : 'Maroon'} theme`}
      >
        <span className="theme-toggle-slider" aria-hidden="true" />

        <span
          className={`theme-toggle-option ${theme === 'blue' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggle('blue');
          }}
        >
          <span className="theme-swatch blue-swatch" />
          <span className="theme-label">Blue</span>
        </span>

        <span
          className={`theme-toggle-option ${theme === 'maroon' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggle('maroon');
          }}
        >
          <span className="theme-swatch maroon-swatch" />
          <span className="theme-label">Maroon</span>
        </span>
      </button>
    </div>
  );
}
