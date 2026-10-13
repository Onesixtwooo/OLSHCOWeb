import React from 'react';

export const CORE_VALUE_ICONS = [
  { id: 'cross', label: 'Cross' },
  { id: 'star', label: 'Star' },
  { id: 'users', label: 'People' },
  { id: 'heart', label: 'Heart' },
  { id: 'book', label: 'Book' },
  { id: 'compass', label: 'Compass' },
  { id: 'sun', label: 'Sun' },
  { id: 'shield', label: 'Shield' },
];

export function coreValueIconFor(icon, title = '') {
  if (CORE_VALUE_ICONS.some((option) => option.id === icon)) return icon;
  const name = String(title).toLowerCase();
  if (name.includes('faith') || name.includes('god') || name.includes('catholic')) return 'cross';
  if (name.includes('excel') || name.includes('quality') || name.includes('academic')) return 'star';
  if (name.includes('leader') || name.includes('communit') || name.includes('people')) return 'users';
  return 'heart';
}

export default function CoreValueIcon({ icon, title }) {
  const selected = coreValueIconFor(icon, title);
  const paths = {
    cross: <path d="M12 3v18M6 8h12" />,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    users: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    compass: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  };

  return <svg viewBox="0 0 24 24" fill={['star', 'users'].includes(selected) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={selected === 'cross' ? '2.5' : '2'} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[selected]}</svg>;
}
