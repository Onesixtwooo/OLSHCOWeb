import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_HOMEPAGE_CONTENT, mergeHomepageContent } from './homepageContent';

const initialSaved = typeof window !== 'undefined' ? (window.__OLSHCO_PUBLIC_CONTENT__ || window.__OLSHCO_ADMIN_CONTENT__ || null) : null;

const HomepageContentContext = createContext(mergeHomepageContent(initialSaved || {}));

export function HomepageContentProvider({ children }) {
  const [savedContent, setSavedContent] = useState(() => initialSaved);

  useEffect(() => {
    if (!initialSaved) {
      fetch('/homepage-content', { headers: { Accept: 'application/json' } })
        .then((response) => (response.ok ? response.json() : {}))
        .then(setSavedContent)
        .catch(() => setSavedContent({}));
    }
  }, []);

  const content = useMemo(() => mergeHomepageContent(savedContent || {}), [savedContent]);
  return <HomepageContentContext.Provider value={content}>{children}</HomepageContentContext.Provider>;
}

export function useHomepageContent() {
  return useContext(HomepageContentContext);
}
