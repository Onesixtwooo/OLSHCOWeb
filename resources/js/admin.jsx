import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DEFAULT_HOMEPAGE_CONTENT, mergeHomepageContent } from './content/homepageContent';
import RichTextEditor from './components/RichTextEditor';
import '../css/admin.css';

const SECTION_LABELS = {
  home: 'Home',
  pvmo: 'PVMO',
  about: 'About',
  academics: 'Academics',
  admissions: 'Admissions',
  contact: 'Contact',
  services: 'Office Services',
  administration: 'Administration',
};

const LEGACY_HOME_ALIASES = new Set(['site', 'visibility', 'hero', 'footer', 'home']);

/** Flat nav groups — each item is a direct section key with its own URL */
const NAV_GROUPS = [
  { label: 'Home', items: ['home'] },
  { label: 'Pages', items: ['pvmo', 'about', 'academics', 'admissions', 'services', 'contact'] },
  { label: 'Management', items: ['administration'] },
];

/** All valid section keys in a flat set */
const ALL_SECTIONS = new Set(Object.keys(SECTION_LABELS));

/** Map section key → group label (used for the topbar eyebrow) */
const SECTION_TO_GROUP = {};
NAV_GROUPS.forEach((g) => g.items.forEach((k) => { SECTION_TO_GROUP[k] = g.label; }));
LEGACY_HOME_ALIASES.forEach((k) => { SECTION_TO_GROUP[k] = 'Home'; });

/**
 * Parse the current pathname to determine which section is active.
 * Handles:
 *   /admin            → default (home)
 *   /admin/home/edit  → home
 *   /admin/site/edit  → home (legacy alias)
 *   /admin/about/edit → about
 */
function parseSectionFromPath() {
  const parts = window.location.pathname.replace(/^\/admin\/?/, '').split('/');
  const candidate = parts[0];
  if (candidate && LEGACY_HOME_ALIASES.has(candidate)) return 'home';
  if (candidate && ALL_SECTIONS.has(candidate)) return candidate;
  return 'home'; // default
}

/** Push a new URL for the given section key without reloading the page. */
function pushSectionUrl(sectionKey) {
  const url = `/admin/${sectionKey}/edit`;
  if (window.location.pathname !== url) {
    window.history.pushState({ sectionKey }, '', url);
  }
}

const pretty = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());

function ImageUploadField({ value, onChange, onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !onImageUpload) return;
    setUploading(true);
    setError('');
    try {
      await onImageUpload(file, onChange);
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload image.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };
  return <div className="admin-image-upload"><div className="admin-image-preview">{value ? <img src={value} alt="Program preview" /> : <span>No image uploaded</span>}</div><div className="admin-image-upload-controls"><label className="admin-upload-button">{uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} disabled={uploading} /></label>{value && <button type="button" className="admin-remove-image" onClick={() => onChange('')}>Remove image</button>}</div>{error && <small className="admin-upload-error">{error}</small>}<small className="admin-upload-hint">JPG, PNG, or WebP · max 8 MB</small></div>;
}

function TextField({ label, value, onChange, onImageUpload }) {
  if (label === 'image' && onImageUpload) return <label className="admin-field"><span>Image</span><ImageUploadField value={value} onChange={onChange} onImageUpload={onImageUpload} /></label>;
  
  const lowerLabel = String(label).toLowerCase();
  const isRich = ['description', 'introdescription', 'formdescription', 'responsenote', 'spotlightdescription', 'philosophy', 'vision', 'mission', 'body'].includes(lowerLabel)
    || String(value ?? '').length > 90
    || String(value ?? '').includes('\n')
    || String(value ?? '').includes('<p>');

  if (isRich) {
    return <div className="admin-field">
      <RichTextEditor label={pretty(label)} value={value ?? ''} onChange={onChange} />
    </div>;
  }

  return <label className="admin-field"><span>{pretty(label)}</span><input value={value ?? ''} placeholder={label === 'image' ? 'Optional image URL (leave blank for gray placeholder)' : undefined} onChange={(event) => onChange(event.target.value)} /></label>;
}

function ArrayEditor({ value, onChange, label, onImageUpload }) {
  const objectArray = value.length > 0 && typeof value[0] === 'object';
  return <div className="admin-array"><div className="admin-array-heading"><span>{pretty(label)}</span><button type="button" onClick={() => onChange([...value, objectArray ? { ...value[0] } : ''])}>Add</button></div>{value.map((item, index) => objectArray ? <div className="admin-array-card" key={index}><div className="admin-array-card-heading"><strong>{item.title || item.name || `${pretty(label)} ${index + 1}`}</strong><button type="button" className="admin-remove" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div><Editor value={item} onChange={(next) => onChange(value.map((entry, itemIndex) => itemIndex === index ? next : entry))} onImageUpload={onImageUpload} /></div> : <div className="admin-inline-field" key={index}><input value={item} onChange={(event) => onChange(value.map((entry, itemIndex) => itemIndex === index ? event.target.value : entry))} /><button type="button" className="admin-remove" aria-label={`Remove ${pretty(label)} ${index + 1}`} onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}</div>;
}

function CollapsibleSection({ id, icon, title, subtitle, isOpen, onToggle, children }) {
  return (
    <div className={`hero-editor-section is-collapsible ${isOpen ? 'is-open' : 'is-collapsed'}`}>
      <button
        type="button"
        className="hero-editor-section-trigger"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        aria-controls={`section-body-${id}`}
      >
        <div className="hero-editor-section-head-left">
          <span className="hero-editor-section-icon">{icon}</span>
          <div className="hero-editor-section-titles">
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </div>
        </div>
        <div className="hero-editor-section-head-right">
          <span className={`hero-editor-pill ${isOpen ? 'is-open' : 'is-closed'}`}>
            {isOpen ? 'Editing' : 'Click to Edit'}
          </span>
          <span className={`hero-editor-chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </button>

      <div
        id={`section-body-${id}`}
        className={`hero-editor-section-body-wrapper ${isOpen ? 'is-open' : 'is-collapsed'}`}
        aria-hidden={!isOpen}
      >
        <div className="hero-editor-section-body">
          <div className="hero-editor-section-body-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const EMPTY_PROGRAM = {
  level: '',
  title: 'New program',
  link: '#admissions',
  description: '',
  features: [],
  image: '',
};

function AcademicProgramItemEditor({ program = {}, onChange, onImageUpload }) {
  const set = (key) => (val) => onChange({ ...program, [key]: val });
  return (
    <div className="admin-editor-fields">
      <label className="admin-field">
        <span>Program Level</span>
        <input
          value={program.level ?? ''}
          onChange={(e) => set('level')(e.target.value)}
          placeholder="e.g. College Department, Basic Education"
        />
      </label>
      <label className="admin-field">
        <span>Title</span>
        <input
          value={program.title ?? ''}
          onChange={(e) => set('title')(e.target.value)}
          placeholder="e.g. IT Department"
        />
      </label>
      <label className="admin-field">
        <span>Discover Button Link (URL or #Section)</span>
        <input
          value={program.link ?? ''}
          onChange={(e) => set('link')(e.target.value)}
          placeholder="e.g. #admissions, /admissions, or https://example.com"
        />
        <small style={{ color: '#8492a8', fontSize: '11px', marginTop: '2px' }}>
          Destination when visitors click the "Discover" button on this card
        </small>
      </label>
      <div className="admin-field">
        <RichTextEditor
          label="Description"
          value={program.description ?? ''}
          onChange={set('description')}
          placeholder="Program overview and objectives…"
        />
      </div>
      <ArrayEditor
        label="features"
        value={program.features || []}
        onChange={set('features')}
        onImageUpload={onImageUpload}
      />
      <div className="admin-field">
        <span>Image</span>
        {onImageUpload ? (
          <ImageUploadField
            value={program.image ?? ''}
            onChange={set('image')}
            onImageUpload={onImageUpload}
          />
        ) : (
          <input
            value={program.image ?? ''}
            onChange={(e) => set('image')(e.target.value)}
            placeholder="Optional image URL (leave blank for gray placeholder)"
          />
        )}
      </div>
    </div>
  );
}

function AcademicProgramsEditor({ value = [], onChange, onImageUpload, onSave }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const updateProgram = (index, next) => onChange(value.map((program, itemIndex) => itemIndex === index ? next : program));
  const moveProgram = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= value.length) return;
    const reordered = [...value];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    onChange(reordered);
    if (activeIndex === index) setActiveIndex(targetIndex);
  };

  return <div className="admin-program-list">
    <div className="admin-program-list-heading">
      <div><span>Programs</span><small>{value.length} {value.length === 1 ? 'program' : 'programs'} in display order</small></div>
      <button type="button" onClick={() => { onChange([...value, { ...EMPTY_PROGRAM }]); setActiveIndex(value.length); }}>+ Add program</button>
    </div>
    {value.length === 0 && <p className="admin-empty-state">No programs yet. Add the first program for this department.</p>}
    <div className="admin-program-items">
      {value.map((program, index) => <div className="admin-program-card" key={index}>
        <button type="button" className="admin-program-trigger" onClick={() => setActiveIndex(index)} aria-label={`Edit ${program.title || `program ${index + 1}`}`}>
          <span className="admin-program-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="admin-program-summary"><strong>{program.title || `Program ${index + 1}`}</strong><small>{program.level || 'Program level not set'}</small></span>
          <span className="admin-program-count">{program.features?.length || 0} features</span>
          <span className="admin-program-edit">Edit <span aria-hidden="true">↗</span></span>
        </button>
      </div>)}
    </div>
    {activeIndex !== null && value[activeIndex] && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="program-modal-title">
        <header className="admin-modal-header"><div><span className="admin-modal-kicker">Program {String(activeIndex + 1).padStart(2, '0')}</span><h2 id="program-modal-title">{value[activeIndex].title || 'Edit program'}</h2></div><button type="button" className="admin-modal-close" onClick={() => setActiveIndex(null)} aria-label="Close program editor">×</button></header>
        <div className="admin-modal-content"><AcademicProgramItemEditor program={value[activeIndex]} onChange={(next) => updateProgram(activeIndex, next)} onImageUpload={onImageUpload} /></div>
        <footer className="admin-modal-footer"><div className="admin-order-actions" aria-label="Change program order"><button type="button" disabled={activeIndex === 0} onClick={() => moveProgram(activeIndex, -1)}>↑ Move up</button><button type="button" disabled={activeIndex === value.length - 1} onClick={() => moveProgram(activeIndex, 1)}>↓ Move down</button></div><div className="admin-modal-footer-actions"><button type="button" className="admin-delete-program" onClick={() => { onChange(value.filter((_, itemIndex) => itemIndex !== activeIndex)); setActiveIndex(null); }}>Remove program</button><button type="button" className="admin-modal-done" onClick={() => { setActiveIndex(null); onSave?.(); }}>Done</button></div></footer>
      </section>
    </div>}
  </div>;
}

function AcademicDepartmentEditor({ departmentKey, order, value, onChange, onImageUpload, onSave }) {
  const { programs = [], ...details } = value || {};
  const title = value?.title || pretty(departmentKey);

  return <section className="admin-department-group">
    <header className="admin-department-header">
      <span className="admin-department-number">{String(order).padStart(2, '0')}</span>
      <div><span className="admin-department-kicker">{value?.kicker || pretty(departmentKey)}</span><h2>{title}</h2></div>
      <span className="admin-department-total">{programs.length} {programs.length === 1 ? 'program' : 'programs'}</span>
    </header>
    <div className="admin-department-details"><Editor value={details} onChange={(next) => onChange({ ...next, programs })} /></div>
    <AcademicProgramsEditor value={programs} onChange={(next) => onChange({ ...value, programs: next })} onImageUpload={onImageUpload} onSave={onSave} />
  </section>;
}

function AcademicsEditor({ value, onChange, onImageUpload, onSave }) {
  const { ibed = {}, college = {}, ...overview } = value || {};
  const departments = [
    { key: 'ibed', value: ibed },
    { key: 'college', value: college },
  ];

  return <div className="admin-academics-editor">
    <div className="admin-academics-overview">
      <div className="admin-group-label"><span>Section overview</span><small>Text shown above all academic departments</small></div>
      <Editor value={overview} onChange={(next) => onChange({ ...next, ibed, college })} />
    </div>
    <div className="admin-departments-heading"><div><span>Departments</span><small>Grouped in the same order used on the homepage</small></div><span className="admin-departments-total">{departments.length} groups</span></div>
    {departments.map((department, index) => <AcademicDepartmentEditor key={department.key} departmentKey={department.key} order={index + 1} value={department.value} onChange={(next) => onChange({ ...value, [department.key]: next })} onImageUpload={onImageUpload} onSave={onSave} />)}
  </div>;
}

const ABOUT_SECTIONS = [
  { id: 'header', label: 'Section Header' },
  { id: 'hymn', label: 'School Hymn' },
  { id: 'visual', label: 'Visual Card & Floating Badges' },
  { id: 'features', label: 'Features' },
  { id: 'impact', label: 'Impact Pillars' },
  { id: 'actions', label: 'Actions & Section Footer' },
];

function AudioUploadField({ value, mediaType, onChange, onAudioUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = async (event) => {
    const file = event.target.files?.[0]; if (!file || !onAudioUpload) return;
    setUploading(true); setError('');
    try { await onAudioUpload(file, onChange); } catch (uploadError) { setError(uploadError.message || 'Unable to upload hymn media.'); }
    finally { setUploading(false); event.target.value = ''; }
  };
  const isVideo = mediaType === 'video' || /\.(mp4|webm|mov)(?:\?|$)/i.test(value || '');
  return <div className="admin-audio-upload"><label className="admin-upload-button">{uploading ? 'Uploading...' : value ? 'Replace hymn media' : 'Upload hymn media'}<input type="file" accept="audio/*,video/mp4,video/webm,video/quicktime" onChange={handleChange} disabled={uploading} /></label>{value && <>{isVideo ? <video controls src={value} /> : <audio controls src={value} />} <button type="button" className="admin-remove-image" onClick={() => onChange({ url: '', type: '' })}>Remove hymn media</button></>}{error && <small className="admin-upload-error">{error}</small>}<small className="admin-upload-hint">MP3, WAV, OGG, M4A, AAC, MP4, WEBM, or MOV - max 50 MB</small></div>;
}

function AboutEditor({ value = {}, onChange, onImageUpload, onAudioUpload, onSave }) {
  const set = (key) => (val) => onChange({ ...value, [key]: val });
  const features = Array.isArray(value.features) ? value.features : [];
  const impact = Array.isArray(value.impact) ? value.impact : [];

  // Default only the first section open for clean, compact overview
  const [openSections, setOpenSections] = useState({ header: true });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all = {};
    ABOUT_SECTIONS.forEach((s) => { all[s.id] = true; });
    setOpenSections(all);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const openCount = ABOUT_SECTIONS.filter((s) => !!openSections[s.id]).length;

  return (
    <div className="hero-editor">
      {/* Accordion Toolbar with Expand / Collapse actions */}
      <div className="admin-accordion-toolbar">
        <div className="admin-accordion-hint">
          <span>About Sections</span>
          <span className="admin-accordion-count">
            {openCount} of {ABOUT_SECTIONS.length} open
          </span>
        </div>
        <div className="admin-accordion-actions">
          <button type="button" className="admin-accordion-btn" onClick={expandAll} title="Open all 5 sections">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="7 13 12 18 17 13" />
              <polyline points="7 6 12 11 17 6" />
            </svg>
            Expand All
          </button>
          <button type="button" className="admin-accordion-btn" onClick={collapseAll} title="Close all sections">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="17 11 12 6 7 11" />
              <polyline points="17 18 12 13 7 18" />
            </svg>
            Collapse All
          </button>
        </div>
      </div>

      {/* 1. History Overview */}
      <CollapsibleSection
        id="header"
        icon="✦"
        title="History Overview"
        subtitle="The history and founding story shown on the About page"
        isOpen={!!openSections.header}
        onToggle={toggleSection}
      >
        <div className="admin-field hero-editor-full">
          <RichTextEditor
            label="Overview of OLSHCO History"
            value={value.historyOverview ?? ''}
            onChange={set('historyOverview')}
            placeholder="Write the founding story, milestones, and continuing mission of OLSHCO..."
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="hymn" icon="♫" title="School Hymn" subtitle="Add the school hymn lyrics and music file" isOpen={!!openSections.hymn} onToggle={toggleSection}>
        <div className="hero-editor-grid">
          <label className="admin-field"><span>Hymn title</span><input value={value.hymn?.title ?? ''} onChange={(e) => onChange({ ...value, hymn: { ...(value.hymn || {}), title: e.target.value } })} placeholder="e.g. OLSHCO School Hymn" /></label>
          <div className="admin-field"><span>Music or video file</span><AudioUploadField value={value.hymn?.musicUrl ?? ''} mediaType={value.hymn?.mediaType} onChange={(media) => onChange({ ...value, hymn: { ...(value.hymn || {}), musicUrl: media.url, mediaType: media.type } })} onAudioUpload={onAudioUpload} /></div>
          <div className="admin-field hero-editor-full"><RichTextEditor label="Lyrics" value={value.hymn?.lyrics ?? ''} onChange={(lyrics) => onChange({ ...value, hymn: { ...(value.hymn || {}), lyrics } })} placeholder="Enter the school hymn lyrics..." /></div>
        </div>
      </CollapsibleSection>

      {/* 2. Visual Card & Floating Badges */}
      <CollapsibleSection
        id="visual"
        icon="🎨"
        title="Visual Card & Floating Badges"
        subtitle="Top & bottom floating badges and campus photo"
        isOpen={!!openSections.visual}
        onToggle={toggleSection}
      >
        {/* Floating Top Badge */}
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>Top Badge Eyebrow</span>
            <input
              value={value.cardTopEyebrow ?? ''}
              onChange={(e) => set('cardTopEyebrow')(e.target.value)}
              placeholder="e.g. Faith"
            />
          </label>
          <label className="admin-field">
            <span>Top Badge Title</span>
            <textarea
              value={value.cardTopTitle ?? ''}
              onChange={(e) => set('cardTopTitle')(e.target.value)}
              rows={2}
              placeholder="e.g. Forms Brighter\nFutures"
            />
          </label>
        </div>

        {/* Floating Bottom Badge */}
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>Bottom Badge Eyebrow</span>
            <input
              value={value.cardBottomEyebrow ?? ''}
              onChange={(e) => set('cardBottomEyebrow')(e.target.value)}
              placeholder="e.g. A Community"
            />
          </label>
          <label className="admin-field">
            <span>Bottom Badge Title</span>
            <input
              value={value.cardBottomTitle ?? ''}
              onChange={(e) => set('cardBottomTitle')(e.target.value)}
              placeholder="e.g. for Life"
            />
          </label>
        </div>

        {/* Visual Campus Image */}
        <div className="admin-field">
          <span>Campus Photo / Card Image</span>
          {onImageUpload ? (
            <ImageUploadField
              value={value.image ?? ''}
              onChange={(url) => set('image')(url)}
              onImageUpload={onImageUpload}
            />
          ) : (
            <input
              value={value.image ?? ''}
              onChange={(e) => set('image')(e.target.value)}
              placeholder="Optional image URL (leave blank for default placeholder)"
            />
          )}
        </div>
      </CollapsibleSection>

      {/* 3. Features */}
      <CollapsibleSection
        id="features"
        icon="✨"
        title="Features"
        subtitle={`${features.length} core community & learning features shown in the about grid`}
        isOpen={!!openSections.features}
        onToggle={toggleSection}
      >
        <AboutArrayEditor
          label="Features"
          value={features}
          onChange={(next) => onChange({ ...value, features: next })}
          onSave={onSave}
        />
      </CollapsibleSection>

      {/* 4. Impact Pillars */}
      <CollapsibleSection
        id="impact"
        icon="🏛"
        title="Impact Pillars"
        subtitle={`${impact.length} milestone statistics and impact highlights`}
        isOpen={!!openSections.impact}
        onToggle={toggleSection}
      >
        <AboutArrayEditor
          label="Impact"
          value={impact}
          onChange={(next) => onChange({ ...value, impact: next })}
          onSave={onSave}
        />
      </CollapsibleSection>

      {/* 5. Actions & Section Footer */}
      <CollapsibleSection
        id="actions"
        icon="⚓"
        title="Actions & Section Footer"
        subtitle="Call-to-action link, divider tagline rule, and bottom brand watermark"
        isOpen={!!openSections.actions}
        onToggle={toggleSection}
      >
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>Action Button Label</span>
            <input
              value={value.actionLabel ?? ''}
              onChange={(e) => set('actionLabel')(e.target.value)}
              placeholder="e.g. Learn More"
            />
          </label>
          <label className="admin-field">
            <span>Action Target Link</span>
            <input
              value={value.actionLink ?? ''}
              onChange={(e) => set('actionLink')(e.target.value)}
              placeholder="e.g. #academics"
            />
          </label>
          <label className="admin-field hero-editor-full">
            <span>Divider Tagline Rule</span>
            <input
              value={value.taglineRule ?? ''}
              onChange={(e) => set('taglineRule')(e.target.value)}
              placeholder="e.g. Faith • Learning • Service • Community"
            />
          </label>
          <label className="admin-field hero-editor-full">
            <span>Footer Brand Mark</span>
            <input
              value={value.footerMark ?? ''}
              onChange={(e) => set('footerMark')(e.target.value)}
              placeholder="e.g. OUR LADY OF THE SACRED HEART COLLEGE"
            />
          </label>
        </div>
      </CollapsibleSection>
      <div className="admin-editor-save-row"><button type="button" className="admin-save" onClick={() => onSave?.(value)}>Save About page</button></div>
    </div>
  );
}

function AdministrationEditor({ value = {}, onChange, onImageUpload }) {
  const entries = Array.isArray(value.entries) ? value.entries : [];
  const departments = Array.isArray(value.departments) ? value.departments : [];
  const [openPeople, setOpenPeople] = useState(() => entries.reduce((state, _, index) => ({ ...state, [index]: false }), {}));
  const update = (index, key, next) => onChange({ ...value, entries: entries.map((entry, i) => i === index ? { ...entry, [key]: next } : entry) });
  const addPerson = () => { const index = entries.length; onChange({ ...value, entries: [...entries, { name: '', role: '', department: 'School Leadership', order: index + 1, image: '' }] }); setOpenPeople((state) => ({ ...state, [index]: true })); };
  const updateDepartment = (index, key, next) => onChange({ ...value, departments: departments.map((item, i) => i === index ? { ...item, [key]: next } : item) });
  return <div className="admin-editor-fields admin-directory-editor">
    <div className="admin-program-list-heading"><div><span>Faculty and staff</span><small>Add people, profile images, designations, and display order.</small></div><button type="button" onClick={addPerson}>+ Add person</button></div>
    {entries.length === 0 && <div className="admin-empty-state">No faculty or staff added yet.</div>}
    {entries.map((person, index) => <div className={`admin-array-card admin-person-card ${openPeople[index] ? 'is-open' : 'is-collapsed'}`} key={index}>
      <div className="admin-person-summary"><button type="button" className="admin-person-toggle" onClick={() => setOpenPeople((state) => ({ ...state, [index]: !state[index] }))} aria-expanded={!!openPeople[index]}><span className="admin-person-title"><strong>{person.name || `Person ${index + 1}`}</strong>{person.role && <small>{person.role}</small>}</span><span className="admin-person-chevron" aria-hidden="true">⌄</span></button></div>
      {openPeople[index] && <div className="admin-person-card-body"><div className="admin-person-actions"><button type="button" className="admin-remove" onClick={() => onChange({ ...value, entries: entries.filter((_, i) => i !== index) })}>Remove</button></div><div className="admin-editor-grid"><label className="admin-field"><span>Name</span><input value={person.name ?? ''} onChange={(e) => update(index, 'name', e.target.value)} placeholder="e.g. Juan Dela Cruz" /></label><label className="admin-field"><span>Designation</span><input value={person.role ?? ''} onChange={(e) => update(index, 'role', e.target.value)} placeholder="e.g. School President" /></label><label className="admin-field"><span>Department</span><input value={person.department ?? ''} onChange={(e) => update(index, 'department', e.target.value)} placeholder="e.g. School Leadership" /></label><label className="admin-field"><span>Display order</span><input type="number" min="1" value={person.order ?? index + 1} onChange={(e) => update(index, 'order', Number(e.target.value) || index + 1)} /></label></div><label className="admin-field"><span>Profile image</span><ImageUploadField value={person.image ?? ''} onChange={(next) => update(index, 'image', next)} onImageUpload={onImageUpload} /></label></div>}
    </div>)}
    <div className="admin-department-editor"><div className="admin-program-list-heading"><div><span>Departments</span><small>Define the departments used to organize the public directory.</small></div><button type="button" onClick={() => onChange({ ...value, departments: [...departments, { name: '', description: '' }] })}>+ Add department</button></div>{departments.length === 0 && <div className="admin-empty-state">No departments added yet.</div>}{departments.map((department, index) => <div className="admin-array-card" key={index}><div className="admin-array-card-heading"><strong>{department.name || `Department ${index + 1}`}</strong><button type="button" className="admin-remove" onClick={() => onChange({ ...value, departments: departments.filter((_, i) => i !== index) })}>Remove</button></div><label className="admin-field"><span>Department name</span><input value={department.name ?? ''} onChange={(e) => updateDepartment(index, 'name', e.target.value)} placeholder="e.g. Academic Faculty" /></label><label className="admin-field"><span>Description</span><input value={department.description ?? ''} onChange={(e) => updateDepartment(index, 'description', e.target.value)} placeholder="Short description" /></label></div>)}</div>
  </div>;
}

function ContactEditor({ value, onChange, onSave }) {
  const { details = [], formTitle, formDescription, responseNote, ...overview } = value || {};
  return <div className="admin-about-editor"><div className="admin-academics-overview"><div className="admin-group-label"><span>Contact overview</span><small>Introductory content and contact section headings</small></div><Editor value={overview} onChange={(next) => onChange({ ...next, details, formTitle, formDescription, responseNote })} /></div><ContactDetailsEditor value={details} onChange={(next) => onChange({ ...value, details: next })} onSave={onSave} /><div className="admin-academics-overview"><div className="admin-group-label"><span>Inquiry form</span><small>Content shown beside the message form</small></div><Editor value={{ formTitle, formDescription, responseNote }} onChange={(next) => onChange({ ...value, ...next, details })} /></div></div>;
}

const EMPTY_ADMISSION_STEP = {
  title: 'New enrollment step',
  description: '',
};

function AdmissionsStepsEditor({ value = [], onChange, onSave }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const updateStep = (index, next) => onChange(value.map((step, itemIndex) => itemIndex === index ? next : step));
  const moveStep = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= value.length) return;
    const reordered = [...value];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    onChange(reordered);
    if (activeIndex === index) setActiveIndex(targetIndex);
  };

  return <div className="admin-admissions-steps">
    <div className="admin-program-list-heading">
      <div><span>Enrollment steps</span><small>{value.length} {value.length === 1 ? 'step' : 'steps'} in display order</small></div>
      <button type="button" onClick={() => { onChange([...value, { ...EMPTY_ADMISSION_STEP }]); setActiveIndex(value.length); }}>+ Add step</button>
    </div>
    {value.length === 0 && <p className="admin-empty-state">No enrollment steps yet. Add the first step to build the admissions roadmap.</p>}
    <div className="admin-program-items">
      {value.map((step, index) => <div className="admin-program-card" key={index}>
        <button type="button" className="admin-program-trigger" onClick={() => setActiveIndex(index)} aria-label={`Edit ${step.title || `step ${index + 1}`}`}>
          <span className="admin-program-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="admin-program-summary"><strong>{step.title || `Enrollment step ${index + 1}`}</strong><small>{step.description || 'No description yet'}</small></span>
          <span className="admin-program-edit">Edit <span aria-hidden="true">-&gt;</span></span>
        </button>
      </div>)}
    </div>
    {activeIndex !== null && value[activeIndex] && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admission-step-modal-title">
        <header className="admin-modal-header"><div><span className="admin-modal-kicker">Enrollment step {String(activeIndex + 1).padStart(2, '0')}</span><h2 id="admission-step-modal-title">{value[activeIndex].title || 'Edit enrollment step'}</h2></div><button type="button" className="admin-modal-close" onClick={() => setActiveIndex(null)} aria-label="Close enrollment step editor">x</button></header>
        <div className="admin-modal-content"><Editor value={value[activeIndex]} onChange={(next) => updateStep(activeIndex, next)} /></div>
        <footer className="admin-modal-footer"><div className="admin-order-actions" aria-label="Change enrollment step order"><button type="button" disabled={activeIndex === 0} onClick={() => moveStep(activeIndex, -1)}>^ Move up</button><button type="button" disabled={activeIndex === value.length - 1} onClick={() => moveStep(activeIndex, 1)}>v Move down</button></div><div className="admin-modal-footer-actions"><button type="button" className="admin-delete-program" onClick={() => { onChange(value.filter((_, itemIndex) => itemIndex !== activeIndex)); setActiveIndex(null); }}>Remove step</button><button type="button" className="admin-modal-done" onClick={() => { setActiveIndex(null); onSave?.(); }}>Done</button></div></footer>
      </section>
    </div>}
  </div>;
}

function AdmissionsEditor({ value, onChange, onSave }) {
  const { steps = [], ...content } = value || {};
  const set = (key) => (next) => onChange({ ...value, [key]: next, steps });

  return <div className="admin-admissions-editor">
    <div className="admin-admissions-section">
      <div className="admin-group-label"><div><span>Admissions overview</span><small>Section badge, title, and introduction shown above the enrollment roadmap</small></div></div>
      <div className="admin-editor-fields admin-admissions-grid">
        {['badge', 'title', 'description'].map((key) => <TextField key={key} label={key} value={content[key]} onChange={set(key)} />)}
      </div>
    </div>
    <div className="admin-admissions-section">
      <div className="admin-group-label"><div><span>Spotlight CTA</span><small>Featured invitation displayed beside the enrollment steps</small></div></div>
      <div className="admin-editor-fields admin-admissions-grid">
        {['spotlightEyebrow', 'spotlightTitle', 'spotlightDescription', 'spotlightButton'].map((key) => <TextField key={key} label={key} value={content[key]} onChange={set(key)} />)}
      </div>
    </div>
    <div className="admin-admissions-section admin-admissions-steps-section">
      <AdmissionsStepsEditor value={steps} onChange={(next) => onChange({ ...value, steps: next })} onSave={onSave} />
    </div>
  </div>;
}

function ContactDetailsEditor({ value = [], onChange, onSave }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const update = (index, next) => onChange(value.map((item, itemIndex) => itemIndex === index ? next : item));
  return <div className="admin-about-list"><div className="admin-program-list-heading"><div><span>Contact details</span><small>{value.length} entries in display order</small></div><button type="button" onClick={() => { onChange([...value, { label: '', value: '', icon: '' }]); setActiveIndex(value.length); }}>+ Add detail</button></div><div className="admin-program-items">{value.map((item, index) => <div className="admin-program-card" key={index}><button type="button" className="admin-program-trigger" onClick={() => setActiveIndex(index)}><span className="admin-program-number">{String(index + 1).padStart(2, '0')}</span><span className="admin-program-summary"><strong>{item.label || `Contact detail ${index + 1}`}</strong><small>{item.value || 'No value yet'}{item.icon ? ` · ${item.icon}` : ''}</small></span><span className="admin-program-edit">Edit ↗</span></button></div>)}</div>{activeIndex !== null && value[activeIndex] && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}><section className="admin-modal" role="dialog" aria-modal="true"><header className="admin-modal-header"><div><span className="admin-modal-kicker">Contact detail {String(activeIndex + 1).padStart(2, '0')}</span><h2>{value[activeIndex].label || 'Edit contact detail'}</h2></div><button type="button" className="admin-modal-close" onClick={() => setActiveIndex(null)} aria-label="Close editor">×</button></header><div className="admin-modal-content"><Editor value={value[activeIndex]} onChange={(next) => update(activeIndex, next)} /></div><footer className="admin-modal-footer"><button type="button" className="admin-delete-program" onClick={() => { onChange(value.filter((_, itemIndex) => itemIndex !== activeIndex)); setActiveIndex(null); }}>Remove detail</button><button type="button" className="admin-modal-done" onClick={() => { setActiveIndex(null); onSave?.(); }}>Done</button></footer></section></div>}</div>;
}

function AboutArrayEditor({ value = [], label, onChange, onSave }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const isImpact = label === 'Impact';
  const emptyItem = isImpact ? { mark: '', title: '', description: '' } : { title: '', description: '' };
  const update = (index, next) => onChange(value.map((item, itemIndex) => itemIndex === index ? next : item));
  return <div className="admin-about-list"><div className="admin-program-list-heading"><div><span>{label}</span><small>{value.length} items in display order</small></div><button type="button" onClick={() => { onChange([...value, { ...emptyItem }]); setActiveIndex(value.length); }}>+ Add {isImpact ? 'impact item' : 'feature'}</button></div><div className="admin-program-items">{value.map((item, index) => <div className="admin-program-card" key={index}><button type="button" className="admin-program-trigger" onClick={() => setActiveIndex(index)}><span className="admin-program-number">{String(index + 1).padStart(2, '0')}</span><span className="admin-program-summary"><strong>{item.title || item.mark || `${label} ${index + 1}`}</strong><small>{item.description || 'No description yet'}</small></span><span className="admin-program-edit">Edit ↗</span></button></div>)}</div>{activeIndex !== null && value[activeIndex] && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}><section className="admin-modal" role="dialog" aria-modal="true"><header className="admin-modal-header"><div><span className="admin-modal-kicker">{label} {String(activeIndex + 1).padStart(2, '0')}</span><h2>{value[activeIndex].title || (isImpact ? 'Impact item' : 'Feature')}</h2></div><button type="button" className="admin-modal-close" onClick={() => setActiveIndex(null)} aria-label="Close editor">×</button></header><div className="admin-modal-content"><Editor value={value[activeIndex]} onChange={(next) => update(activeIndex, next)} /></div><footer className="admin-modal-footer"><button type="button" className="admin-delete-program" onClick={() => { onChange(value.filter((_, itemIndex) => itemIndex !== activeIndex)); setActiveIndex(null); }}>Remove</button><button type="button" className="admin-modal-done" onClick={() => { setActiveIndex(null); onSave?.(); }}>Done</button></footer></section></div>}</div>;
}

function HeroSlidesManager({ slides = [], intervalSeconds = 4, onChange, onImageUpload }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      image: '',
      titleTop: 'ROOTED IN FAITH',
      titleBottom: 'GROUNDED IN EXCELLENCE',
      description: 'Guided by the Oneness of Heart of Jesus and Mary, OLSHCO provides holistic, values-centered education that nurtures faith, develops excellence, and prepares learners to serve, lead, and contribute to a sustainable future.',
      badgeTitle: 'Faith and',
      badgeSub: 'Character',
    };
    const next = [...slides, newSlide];
    onChange(next);
    setActiveIndex(next.length - 1);
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    onChange(next);
    if (activeIndex === index) setActiveIndex(target);
  };

  const handleDelete = (index) => {
    if (slides.length <= 1) {
      alert('You need at least 1 slide in the slideshow.');
      return;
    }
    const next = slides.filter((_, i) => i !== index);
    onChange(next);
    if (activeIndex === index) setActiveIndex(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset slides to the 5 default campus & student slides?')) {
      onChange(DEFAULT_HOMEPAGE_CONTENT.hero.slides);
      setActiveIndex(null);
    }
  };

  const updateSlideField = (index, field, val) => {
    const next = slides.map((s, i) => (i === index ? { ...s, [field]: val } : s));
    onChange(next);
  };

  const activeSlide = activeIndex !== null ? slides[activeIndex] : null;

  return (
    <div className="hero-editor-section">
      <div className="admin-slides-header">
        <div className="admin-slides-header-left">
          <span className="hero-editor-section-icon">🎞</span>
          <div>
            <strong>Rolling Slideshow ({slides.length} Slides)</strong>
            <small>Slides roll every {intervalSeconds}s. At least 5 can be saved and customized.</small>
          </div>
          <span className="admin-slides-count">{slides.length} Slides Saved</span>
          <span className="admin-slides-interval-pill">⏱ {intervalSeconds}s Interval</span>
        </div>
        <div className="admin-slides-header-actions">
          <button type="button" className="admin-btn-secondary" onClick={handleResetDefaults} title="Restore 5 default slides">
            ↺ Reset 5 Defaults
          </button>
          <button type="button" className="admin-btn-primary" onClick={handleAddSlide}>
            + Add Slide
          </button>
        </div>
      </div>

      <div className="admin-slides-items">
        {slides.map((slide, index) => {
          const title = [slide.titleTop, slide.titleBottom].filter(Boolean).join(' ') || `Slide ${index + 1}`;
          return (
            <div className="admin-slide-card" key={slide.id || index}>
              <span className="admin-slide-card-num">{String(index + 1).padStart(2, '0')}</span>
              <div className="admin-slide-card-thumb">
                {slide.image ? (
                  <img src={slide.image} alt={title} />
                ) : (
                  <span className="admin-slide-card-thumb-empty">No image</span>
                )}
              </div>
              <div className="admin-slide-card-info">
                <strong>{title}</strong>
                <small>{slide.description || 'No description entered'}</small>
                <span className="admin-slide-badge-pill">
                  Badge: {slide.badgeTitle || 'Faith and'} {slide.badgeSub || 'Character'}
                </span>
              </div>
              <div className="admin-slide-card-actions">
                <button
                  type="button"
                  className="admin-slide-btn-order"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  title="Move slide up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="admin-slide-btn-order"
                  disabled={index === slides.length - 1}
                  onClick={() => handleMove(index, 1)}
                  title="Move slide down"
                >
                  ▼
                </button>
                <button
                  type="button"
                  className="admin-slide-btn-edit"
                  onClick={() => setActiveIndex(index)}
                >
                  Edit Slide ↗
                </button>
                <button
                  type="button"
                  className="admin-slide-btn-delete"
                  onClick={() => handleDelete(index)}
                  title="Delete this slide"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeSlide && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setActiveIndex(null); }}
        >
          <section className="admin-modal" role="dialog" aria-modal="true">
            <header className="admin-modal-header">
              <div>
                <span className="admin-modal-kicker">Hero Slide {String(activeIndex + 1).padStart(2, '0')}</span>
                <h2>{activeSlide.titleTop || 'Edit Slide'}</h2>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setActiveIndex(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </header>

            <div className="admin-modal-content">
              <div className="admin-editor-fields">
                <label className="admin-field">
                  <span>Slide Photo (Campus / Student)</span>
                  <ImageUploadField
                    value={activeSlide.image || ''}
                    onChange={(url) => updateSlideField(activeIndex, 'image', url)}
                    onImageUpload={onImageUpload}
                  />
                </label>

                <div className="hero-editor-grid">
                  <label className="admin-field">
                    <span>Title — Top Line</span>
                    <input
                      value={activeSlide.titleTop || ''}
                      onChange={(e) => updateSlideField(activeIndex, 'titleTop', e.target.value)}
                      placeholder="e.g. ROOTED IN FAITH"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Title — Bottom Line</span>
                    <input
                      value={activeSlide.titleBottom || ''}
                      onChange={(e) => updateSlideField(activeIndex, 'titleBottom', e.target.value)}
                      placeholder="e.g. GROUNDED IN EXCELLENCE"
                    />
                  </label>
                </div>

                <label className="admin-field">
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={activeSlide.description || ''}
                    onChange={(e) => updateSlideField(activeIndex, 'description', e.target.value)}
                    placeholder="Short description for this slide..."
                  />
                </label>

                <div className="hero-editor-grid">
                  <label className="admin-field">
                    <span>Badge Title</span>
                    <input
                      value={activeSlide.badgeTitle || ''}
                      onChange={(e) => updateSlideField(activeIndex, 'badgeTitle', e.target.value)}
                      placeholder="e.g. Faith and"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Badge Subtitle</span>
                    <input
                      value={activeSlide.badgeSub || ''}
                      onChange={(e) => updateSlideField(activeIndex, 'badgeSub', e.target.value)}
                      placeholder="e.g. Character"
                    />
                  </label>
                </div>
              </div>
            </div>

            <footer className="admin-modal-footer">
              <button
                type="button"
                className="admin-delete-program"
                onClick={() => handleDelete(activeIndex)}
              >
                Remove Slide
              </button>
              <button
                type="button"
                className="admin-modal-done"
                onClick={() => setActiveIndex(null)}
              >
                Done
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

function HeroEditor({ value = {}, onChange, onImageUpload }) {
  const set = (key) => (val) => onChange({ ...value, [key]: val });
  const features = value.quickFeatures || [];
  const [newFeature, setNewFeature] = useState('');
  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;
    onChange({ ...value, quickFeatures: [...features, trimmed] });
    setNewFeature('');
  };

  const slides = Array.isArray(value.slides) && value.slides.length > 0
    ? value.slides
    : (DEFAULT_HOMEPAGE_CONTENT.hero.slides || []);
  const intervalSeconds = Math.max(1, Number(value.intervalSeconds) || 4);

  const handleSlidesChange = (nextSlides) => {
    onChange({
      ...value,
      slides: nextSlides,
      // Keep first slide image synced to main value.image for backward compatibility
      image: nextSlides[0]?.image || value.image || '',
    });
  };

  return (
    <div className="hero-editor">
      {/* Slideshow Manager (At least 5 slides) */}
      <HeroSlidesManager
        slides={slides}
        intervalSeconds={intervalSeconds}
        onChange={handleSlidesChange}
        onImageUpload={onImageUpload}
      />

      {/* Slide Timing Settings */}
      <div className="hero-editor-section">
        <div className="hero-editor-section-head">
          <span className="hero-editor-section-icon">⏱</span>
          <div>
            <strong>Slideshow Rolling Interval</strong>
            <small>How many seconds each slide stays before rolling to the next (default: 4 seconds)</small>
          </div>
        </div>
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>Interval (in seconds)</span>
            <input
              type="number"
              min="1"
              max="60"
              value={value.intervalSeconds ?? 4}
              onChange={(e) => set('intervalSeconds')(Math.max(1, Number(e.target.value) || 4))}
            />
          </label>
        </div>
      </div>

      {/* Headline group */}
      <div className="hero-editor-section">
        <div className="hero-editor-section-head">
          <span className="hero-editor-section-icon">✦</span>
          <div><strong>Default Headline & Institution Tag</strong><small>School name tag and fallback headline text</small></div>
        </div>
        <div className="hero-editor-grid">
          <label className="admin-field hero-editor-full">
            <span>Institution Tag</span>
            <input value={value.institutionTag || ''} onChange={(e) => set('institutionTag')(e.target.value)} placeholder="e.g. OUR LADY OF THE SACRED HEART COLLEGE OF GUIMBA INC." />
          </label>
          <label className="admin-field">
            <span>Default Title — Top Line</span>
            <input value={value.titleTop || ''} onChange={(e) => set('titleTop')(e.target.value)} placeholder="e.g. ROOTED IN FAITH" />
          </label>
          <label className="admin-field">
            <span>Default Title — Bottom Line</span>
            <input value={value.titleBottom || ''} onChange={(e) => set('titleBottom')(e.target.value)} placeholder="e.g. GROUNDED IN EXCELLENCE" />
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="hero-editor-section">
        <div className="hero-editor-section-head">
          <span className="hero-editor-section-icon">¶</span>
          <div><strong>Default Description</strong><small>Introductory paragraph shown when a slide does not specify custom text</small></div>
        </div>
        <div className="admin-field">
          <RichTextEditor
            label="Body text"
            value={value.description || ''}
            onChange={set('description')}
            placeholder="Introductory paragraph shown below the headline…"
          />
        </div>
      </div>

      {/* CTA + Phone */}
      <div className="hero-editor-section">
        <div className="hero-editor-section-head">
          <span className="hero-editor-section-icon">⚡</span>
          <div><strong>Call to action</strong><small>Button label and contact phone shown in the hero</small></div>
        </div>
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>CTA Button Label</span>
            <input value={value.ctaLabel || ''} onChange={(e) => set('ctaLabel')(e.target.value)} placeholder="e.g. ENROLL NOW" />
          </label>
          <label className="admin-field">
            <span>Phone Number</span>
            <input value={value.phoneNumber || ''} onChange={(e) => set('phoneNumber')(e.target.value)} placeholder="e.g. (044) 958-0000" />
          </label>
        </div>
      </div>

      {/* Quick Features */}
      <div className="hero-editor-section">
        <div className="hero-editor-section-head">
          <span className="hero-editor-section-icon">◈</span>
          <div><strong>Quick Features</strong><small>Short highlight tags shown in the hero strip</small></div>
        </div>
        <div className="hero-chips">
          {features.map((f, i) => (
            <span key={i} className="hero-chip">
              {f}
              <button type="button" aria-label={`Remove ${f}`} onClick={() => onChange({ ...value, quickFeatures: features.filter((_, j) => j !== i) })}>×</button>
            </span>
          ))}
        </div>
        <div className="hero-chip-add">
          <input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
            placeholder="Type a feature and press Enter or Add…"
          />
          <button type="button" onClick={addFeature}>Add</button>
        </div>
      </div>
    </div>
  );
}

const PVMO_SECTIONS = [
  { id: 'header', label: 'Section Header' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'vision', label: 'Vision' },
  { id: 'mission', label: 'Mission' },
  { id: 'values', label: 'Core Values' },
  { id: 'watermarks', label: 'Background Watermarks & Scripts' },
  { id: 'footer', label: 'Section Footer' },
];

function PvmoEditor({ value = {}, onChange, onImageUpload }) {
  const set = (key) => (val) => onChange({ ...value, [key]: val });
  const coreValues = Array.isArray(value.coreValues) ? value.coreValues : [];

  // Default only the first section open so the page is clean and easy to navigate
  const [openSections, setOpenSections] = useState({ header: true });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all = {};
    PVMO_SECTIONS.forEach((s) => { all[s.id] = true; });
    setOpenSections(all);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const openCount = PVMO_SECTIONS.filter((s) => !!openSections[s.id]).length;

  const updateCoreValue = (index, field, text) => {
    const next = [...coreValues];
    if (typeof next[index] === 'object' && next[index] !== null) {
      next[index] = { ...next[index], [field]: text };
    } else {
      next[index] = { title: field === 'title' ? text : next[index], description: field === 'description' ? text : '' };
    }
    onChange({ ...value, coreValues: next });
  };

  const addCoreValue = () => {
    onChange({
      ...value,
      coreValues: [...coreValues, { title: 'New Core Value', description: 'Description of this value' }],
    });
  };

  const removeCoreValue = (index) => {
    onChange({
      ...value,
      coreValues: coreValues.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="hero-editor">
      {/* Accordion Toolbar with Expand / Collapse actions */}
      <div className="admin-accordion-toolbar">
        <div className="admin-accordion-hint">
          <span>PVMO Sections</span>
          <span className="admin-accordion-count">
            {openCount} of {PVMO_SECTIONS.length} open
          </span>
        </div>
        <div className="admin-accordion-actions">
          <button type="button" className="admin-accordion-btn" onClick={expandAll} title="Open all 7 sections">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="7 13 12 18 17 13" />
              <polyline points="7 6 12 11 17 6" />
            </svg>
            Expand All
          </button>
          <button type="button" className="admin-accordion-btn" onClick={collapseAll} title="Close all sections">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="17 11 12 6 7 11" />
              <polyline points="17 18 12 13 7 18" />
            </svg>
            Collapse All
          </button>
        </div>
      </div>

      {/* 1. Section Header */}
      <CollapsibleSection
        id="header"
        icon="✦"
        title="Section Header"
        subtitle="Badge, title, and overview description for the PVMO section"
        isOpen={!!openSections.header}
        onToggle={toggleSection}
      >
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>Badge</span>
            <input value={value.badge || ''} onChange={(e) => set('badge')(e.target.value)} placeholder="e.g. Our Foundations" />
          </label>
          <label className="admin-field">
            <span>Section Title</span>
            <input value={value.title || ''} onChange={(e) => set('title')(e.target.value)} placeholder="e.g. Philosophy, Vision, Mission & Core Values" />
          </label>
          <div className="admin-field hero-editor-full">
            <RichTextEditor
              label="Overview Description"
              value={value.description || ''}
              onChange={set('description')}
              placeholder="Brief introductory text…"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. Philosophy */}
      <CollapsibleSection
        id="philosophy"
        icon="📖"
        title="Philosophy"
        subtitle="Educational philosophy, kicker, script, and statue image"
        isOpen={!!openSections.philosophy}
        onToggle={toggleSection}
      >
        <div className="admin-field">
          <RichTextEditor
            label="Philosophy Statement"
            value={value.philosophy || ''}
            onChange={set('philosophy')}
            placeholder="State the school's philosophy..."
          />
        </div>
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>Kicker (Uppercase)</span>
            <input value={value.philosophyKicker || ''} onChange={(e) => set('philosophyKicker')(e.target.value)} placeholder="e.g. WHOLE PERSON.\nBRIGHTER TOMORROWS." />
          </label>
          <label className="admin-field">
            <span>Cursive Script</span>
            <input value={value.philosophyScript || ''} onChange={(e) => set('philosophyScript')(e.target.value)} placeholder="e.g. Mind Heart Faith Service" />
          </label>
        </div>
        <div className="admin-field hero-editor-full">
          <span>Statue Photo / Campus Image</span>
          {onImageUpload ? (
            <ImageUploadField
              value={value.philosophyImage || ''}
              onChange={(url) => set('philosophyImage')(url)}
              onImageUpload={onImageUpload}
            />
          ) : (
            <input
              value={value.philosophyImage || ''}
              onChange={(e) => set('philosophyImage')(e.target.value)}
              placeholder="/images/pvmo-statue.jpg"
            />
          )}
          <label className="admin-field" style={{ marginTop: '10px' }}>
            <span>Or Image URL Path</span>
            <input
              value={value.philosophyImage || ''}
              onChange={(e) => set('philosophyImage')(e.target.value)}
              placeholder="/images/pvmo-statue.jpg"
            />
          </label>
        </div>
      </CollapsibleSection>

      {/* 3. Vision */}
      <CollapsibleSection
        id="vision"
        icon="👁"
        title="Vision"
        subtitle="The institution's long-term vision and kicker"
        isOpen={!!openSections.vision}
        onToggle={toggleSection}
      >
        <div className="hero-editor-grid">
          <div className="admin-field hero-editor-full">
            <RichTextEditor
              label="Vision Statement"
              value={value.vision || ''}
              onChange={set('vision')}
              placeholder="State the school's vision..."
            />
          </div>
          <label className="admin-field">
            <span>Kicker (Top Right)</span>
            <input value={value.visionKicker || ''} onChange={(e) => set('visionKicker')(e.target.value)} placeholder="e.g. A BRIGHTER TOMORROW" />
          </label>
        </div>
      </CollapsibleSection>

      {/* 4. Mission */}
      <CollapsibleSection
        id="mission"
        icon="🎯"
        title="Mission"
        subtitle="The educational mission and kicker"
        isOpen={!!openSections.mission}
        onToggle={toggleSection}
      >
        <div className="hero-editor-grid">
          <div className="admin-field hero-editor-full">
            <RichTextEditor
              label="Mission Statement"
              value={value.mission || ''}
              onChange={set('mission')}
              placeholder="State the school's mission..."
            />
          </div>
          <label className="admin-field">
            <span>Kicker (Top Right)</span>
            <input value={value.missionKicker || ''} onChange={(e) => set('missionKicker')(e.target.value)} placeholder="e.g. PEOPLE WITH PURPOSE" />
          </label>
        </div>
      </CollapsibleSection>

      {/* 5. Core Values */}
      <CollapsibleSection
        id="values"
        icon="💎"
        title="Core Values"
        subtitle="Guiding pillars of character and student development"
        isOpen={!!openSections.values}
        onToggle={toggleSection}
      >
        <label className="admin-field">
          <span>Core Values Tagline</span>
          <input value={value.coreValuesTagline || ''} onChange={(e) => set('coreValuesTagline')(e.target.value)} placeholder="ROOTED IN FAITH.\nLIVING THE VALUES." />
        </label>

        <div className="admin-array" style={{ border: 'none', padding: 0, background: 'transparent' }}>
          <div className="admin-array-heading">
            <span>{coreValues.length} {coreValues.length === 1 ? 'Value' : 'Values'}</span>
            <button type="button" onClick={addCoreValue}>+ Add Value</button>
          </div>
          {coreValues.map((item, index) => {
            const isObj = typeof item === 'object' && item !== null;
            const itemTitle = isObj ? item.title : item;
            const itemDesc = isObj ? item.description : '';

            return (
              <div key={index} className="admin-array-card">
                <div className="admin-array-card-heading">
                  <strong>{itemTitle || `Value ${index + 1}`}</strong>
                  <button type="button" className="admin-remove" onClick={() => removeCoreValue(index)}>Remove</button>
                </div>
                <div className="hero-editor-grid">
                  <label className="admin-field">
                    <span>Title</span>
                    <input
                      value={itemTitle || ''}
                      onChange={(e) => updateCoreValue(index, 'title', e.target.value)}
                      placeholder="e.g. Faith, Excellence"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Description</span>
                    <input
                      value={itemDesc || ''}
                      onChange={(e) => updateCoreValue(index, 'description', e.target.value)}
                      placeholder="e.g. Deep love for God..."
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* 6. Background Watermarks & Decorative Scripts */}
      <CollapsibleSection
        id="watermarks"
        icon="✨"
        title="Background Watermarks & Scripts"
        subtitle="Decorative background text displayed across the top of the PVMO section"
        isOpen={!!openSections.watermarks}
        onToggle={toggleSection}
      >
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>Left Cross Watermark Text</span>
            <textarea
              value={value.watermarkText || ''}
              onChange={(e) => set('watermarkText')(e.target.value)}
              rows={4}
              placeholder={'EDUCATION\nIN FAITH\nFOR A MORE\nHUMAN WORLD'}
            />
            <small style={{ color: '#8492a8', fontSize: '11px', marginTop: '2px' }}>
              Tip: Use Enter for line breaks (displayed beside the background cross on the left)
            </small>
          </label>
          <label className="admin-field">
            <span>Right Cursive Script Watermark</span>
            <textarea
              value={value.scriptText || ''}
              onChange={(e) => set('scriptText')(e.target.value)}
              rows={4}
              placeholder={'Faith\nForms\nBrighter\nTomorrows'}
            />
            <small style={{ color: '#8492a8', fontSize: '11px', marginTop: '2px' }}>
              Tip: Use Enter for line breaks (displayed as cursive script on the top right)
            </small>
          </label>
        </div>
      </CollapsibleSection>

      {/* 7. Footer Branding */}
      <CollapsibleSection
        id="footer"
        icon="✦"
        title="Section Footer"
        subtitle="Brand mark line and tagline at the bottom of the section"
        isOpen={!!openSections.footer}
        onToggle={toggleSection}
      >
        <div className="hero-editor-grid">
          <label className="admin-field">
            <span>Footer Brand Mark</span>
            <input value={value.footerMark || ''} onChange={(e) => set('footerMark')(e.target.value)} placeholder="OUR LADY OF THE SACRED HEART COLLEGE" />
          </label>
          <label className="admin-field">
            <span>Footer Subtitle</span>
            <input value={value.footerSub || ''} onChange={(e) => set('footerSub')(e.target.value)} placeholder="Faith · Formation · A Brighter Tomorrow" />
          </label>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function HomeEditor({ content, onChange, onImageUpload }) {
  const [activeTab, setActiveTab] = useState('all');

  const hero = content.hero || {};
  const site = content.site || {};
  const visibility = content.visibility || {};
  const footer = content.footer || {};

  const setHero = (next) => onChange({ ...content, hero: next });
  const setSiteField = (key, val) => onChange({ ...content, site: { ...site, [key]: val } });
  const setFooterField = (key, val) => onChange({ ...content, footer: { ...footer, [key]: val } });
  const toggleVisibility = (key) => onChange({ ...content, visibility: { ...visibility, [key]: !visibility[key] } });

  const tabs = [
    { id: 'all', label: 'All Sections' },
    { id: 'hero', label: 'Hero Banner' },
    { id: 'site', label: 'Site & Navigation' },
    { id: 'visibility', label: 'Section Visibility' },
    { id: 'footer', label: 'Footer' },
  ];

  const visibilitySections = [
    { key: 'hero', label: 'Hero Banner', desc: 'Main headline, call-to-action button, and campus highlights' },
    { key: 'pvmo', label: 'PVMO Section', desc: 'Philosophy, Vision, Mission, and Core Values foundations' },
    { key: 'about', label: 'About OLSHCO', desc: 'School story, learning community, and impact pillars' },
    { key: 'academics', label: 'Academic Programs', desc: 'IBED and College department course offerings' },
    { key: 'admissions', label: 'Admissions & Enrollment', desc: 'Step-by-step admission roadmap and CTA spotlight' },
    { key: 'contact', label: 'Contact Us', desc: 'Campus address, phone, email, and inquiry contact form' },
  ];

  return (
    <div className="home-editor">
      <div className="admin-subtabs" role="tablist" aria-label="Home page sub-sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`admin-subtab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hero-editor">
        {/* 1. Hero Banner */}
        {(activeTab === 'all' || activeTab === 'hero') && (
          <HeroEditor value={hero} onChange={setHero} onImageUpload={onImageUpload} />
        )}

        {/* 2. Site & Navigation Settings */}
        {(activeTab === 'all' || activeTab === 'site') && (
          <div className="hero-editor-section">
            <div className="hero-editor-section-head">
              <span className="hero-editor-section-icon">⚙</span>
              <div>
                <strong>Site & Navigation Settings</strong>
                <small>School brand identity and top navigation bar button text</small>
              </div>
            </div>
            <div className="hero-editor-grid">
              <label className="admin-field">
                <span>Brand Name / Logo Text</span>
                <input
                  value={site.brand || ''}
                  onChange={(e) => setSiteField('brand', e.target.value)}
                  placeholder="e.g. OLSHCO"
                />
              </label>
              <label className="admin-field">
                <span>Header CTA Button Label</span>
                <input
                  value={site.enrollCta || ''}
                  onChange={(e) => setSiteField('enrollCta', e.target.value)}
                  placeholder="e.g. Enroll Now"
                />
              </label>
            </div>
          </div>
        )}

        {/* 3. Section Visibility */}
        {(activeTab === 'all' || activeTab === 'visibility') && (
          <div className="hero-editor-section">
            <div className="hero-editor-section-head">
              <span className="hero-editor-section-icon">👁</span>
              <div>
                <strong>Section Visibility</strong>
                <small>Choose which sections are displayed or hidden on the live homepage</small>
              </div>
            </div>
            <div className="visibility-grid">
              {visibilitySections.map((sec) => {
                const isVisible = visibility[sec.key] !== false;
                return (
                  <div
                    key={sec.key}
                    className={`visibility-card ${isVisible ? '' : 'is-hidden'}`}
                    onClick={() => toggleVisibility(sec.key)}
                  >
                    <div className="visibility-card-info">
                      <strong>{sec.label}</strong>
                      <small className={isVisible ? 'visibility-status-visible' : 'visibility-status-hidden'}>
                        {isVisible ? '● Visible on page' : '○ Hidden from visitors'}
                      </small>
                    </div>
                    <label className="admin-switch" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => toggleVisibility(sec.key)}
                      />
                      <span className="admin-switch-slider" />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Footer */}
        {(activeTab === 'all' || activeTab === 'footer') && (
          <div className="hero-editor-section">
            <div className="hero-editor-section-head">
              <span className="hero-editor-section-icon">⚓</span>
              <div>
                <strong>Footer Content</strong>
                <small>Brand description statement displayed in the site footer</small>
              </div>
            </div>
            <div className="admin-field">
              <RichTextEditor
                label="Footer Description"
                value={footer.description || ''}
                onChange={(e) => setFooterField('description', e)}
                placeholder="Our Lady of the Sacred Heart College - nurturing faith, inspiring excellence..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Editor({ value, onChange, onImageUpload }) {
  return <div className="admin-editor-fields">{Object.entries(value || {}).map(([key, current]) => {
    if (Array.isArray(current)) return <ArrayEditor key={key} label={key} value={current} onChange={(next) => onChange({ ...value, [key]: next })} onImageUpload={onImageUpload} />;
    if (current && typeof current === 'object') return <fieldset key={key} className="admin-nested"><legend>{pretty(key)}</legend><Editor value={current} onChange={(next) => onChange({ ...value, [key]: next })} onImageUpload={onImageUpload} /></fieldset>;
    if (typeof current === 'boolean') return <label className="admin-toggle"><input type="checkbox" checked={current} onChange={(event) => onChange({ ...value, [key]: event.target.checked })} /><span>{pretty(key)}</span></label>;
    return <TextField key={key} label={key} value={current} onChange={(next) => onChange({ ...value, [key]: next })} onImageUpload={onImageUpload} />;
  })}</div>;
}

function ServicesEditor({ value, onChange, onImageUpload, onSave }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const { offices = [], ...heading } = value;
  const updateOffice = (index, next) => onChange({ ...value, offices: offices.map((office, i) => i === index ? next : office) });
  const moveOffice = (index, direction) => {
    const next = [...offices];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onChange({ ...value, offices: next });
  };
  return <div className="admin-services-editor">
    <Editor value={heading} onChange={(next) => onChange({ ...next, offices })} />
    <div className="admin-program-list-heading"><div><span>Office details</span><small>Leave unknown details blank. Only completed details appear on the website.</small></div>
      <button type="button" onClick={() => { onChange({ ...value, offices: [...offices, { name: 'New office', image: '', description: '', offers: [], personInCharge: '', location: '', officeHours: '', contact: '', gallery: ['', '', '', '', '', ''] }] }); setActiveIndex(offices.length); }}>+ Add office</button>
    </div>
    {offices.length === 0 && <p>No offices yet. Add an office to get started.</p>}
    {offices.map((office, index) => <section className="admin-office-card" key={index}>
      <div className="admin-office-heading"><h2>{office.name || 'Untitled office'}</h2><div className="admin-office-actions">
        <button type="button" className="admin-edit-office" onClick={() => setActiveIndex(index)}>Edit office</button>
        <button type="button" disabled={index === 0} aria-label={`Move ${office.name} up`} onClick={() => moveOffice(index, -1)}>Move up</button>
        <button type="button" disabled={index === offices.length - 1} aria-label={`Move ${office.name} down`} onClick={() => moveOffice(index, 1)}>Move down</button>
        <button type="button" className="admin-remove" onClick={() => onChange({ ...value, offices: offices.filter((_, i) => i !== index) })}>Remove</button>
      </div></div>
      {activeIndex === index && <div className="admin-modal-backdrop" role="presentation" onMouseDown={async (event) => { if (event.target === event.currentTarget) { await onSave?.({ services: value }); setActiveIndex(null); } }}><section className="admin-modal admin-office-modal" role="dialog" aria-modal="true" aria-labelledby={`office-modal-${index}`}>
        <header className="admin-modal-header"><div><span className="admin-modal-kicker">OFFICE {String(index + 1).padStart(2, '0')}</span><h2 id={`office-modal-${index}`}>{office.name || 'New office'}</h2></div><button type="button" className="admin-modal-close" onClick={async () => { await onSave?.({ services: value }); setActiveIndex(null); }} aria-label="Close office editor">×</button></header>
        <div className="admin-modal-content">
          <div className="admin-field"><span>Office photo</span><ImageUploadField value={office.image} onChange={(image) => updateOffice(index, { ...office, image })} onImageUpload={onImageUpload} /></div>
          <label className="admin-field"><span>Office name</span><input value={office.name || ''} onChange={(event) => updateOffice(index, { ...office, name: event.target.value })} /></label>
          <label className="admin-field"><span>Brief description</span><textarea rows={3} value={office.description || ''} onChange={(event) => updateOffice(index, { ...office, description: event.target.value })} /></label>
          <div className="admin-office-offers"><div className="admin-program-list-heading"><div><span>What this office offers</span><small>Add the services or assistance visitors can expect.</small></div><button type="button" onClick={() => updateOffice(index, { ...office, offers: [...(office.offers || []), ''] })}>+ Add offering</button></div>{(office.offers || []).map((offer, offerIndex) => <div className="admin-inline-field" key={offerIndex}><input value={offer} placeholder="e.g. Individual counseling" onChange={(event) => updateOffice(index, { ...office, offers: office.offers.map((item, i) => i === offerIndex ? event.target.value : item) })} /><button type="button" className="admin-remove" aria-label="Remove offering" onClick={() => updateOffice(index, { ...office, offers: office.offers.filter((_, i) => i !== offerIndex) })}>×</button></div>)}</div>
          <div className="admin-office-fields">{['personInCharge', 'location', 'officeHours', 'contact'].map((field) => <label className="admin-field" key={field}><span>{pretty(field)}</span><input value={office[field] || ''} onChange={(event) => updateOffice(index, { ...office, [field]: event.target.value })} /></label>)}</div>
          <div className="admin-office-gallery"><div className="admin-program-list-heading"><div><span>Office gallery</span><small>Upload at least six images to showcase this office.</small></div></div><div className="admin-gallery-grid">{(office.gallery || []).map((image, imageIndex) => <div className="admin-gallery-item" key={imageIndex}><strong>Image {imageIndex + 1}</strong><ImageUploadField value={image} onChange={(next) => updateOffice(index, { ...office, gallery: office.gallery.map((item, i) => i === imageIndex ? next : item) })} onImageUpload={onImageUpload} /></div>)}</div><button type="button" onClick={() => updateOffice(index, { ...office, gallery: [...(office.gallery || []), ''] })}>+ Add gallery image</button></div>
        </div>
        <footer className="admin-modal-footer"><button type="button" className="admin-modal-done" onClick={async () => { await onSave?.({ services: value }); setActiveIndex(null); }}>Save and close</button></footer>
      </section></div>}
    </section>)}
  </div>;
}

function AdminApp() {
  const initial = window.__OLSHCO_ADMIN_CONTENT__ || {};
  const [content, setContent] = useState(() => mergeHomepageContent(initial));
  const [activeSection, setActiveSection] = useState(() => parseSectionFromPath());
  const [status, setStatus] = useState('');

  const activeValue = useMemo(() => (activeSection === 'home' ? content : activeSection === 'administration' ? content.facultyStaff : content[activeSection]), [content, activeSection]);
  const activeGroup = SECTION_TO_GROUP[activeSection] || 'Home';

  /** On first mount: if we're at bare /admin or legacy sub-routes, redirect to /admin/home/edit */
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '');
    if (path === '/admin' || ['/admin/site/edit', '/admin/hero/edit', '/admin/visibility/edit', '/admin/footer/edit'].includes(path)) {
      window.history.replaceState({ sectionKey: 'home' }, '', '/admin/home/edit');
    }
  }, []);

  /** Listen to browser back/forward */
  useEffect(() => {
    const onPopState = () => setActiveSection(parseSectionFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const uploadImage = async (file, apply) => {
    const formData = new FormData(); formData.append('image', file);
    const response = await fetch('/admin/uploads/program-image', { method: 'POST', headers: { Accept: 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }, body: formData });
    const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to upload image.'); apply(data.url);
  };

  const uploadAudio = async (file, apply) => {
    const formData = new FormData(); formData.append('audio', file);
    const response = await fetch('/admin/uploads/hymn-audio', { method: 'POST', headers: { Accept: 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }, body: formData });
    const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to upload hymn media.'); apply({ url: data.url, type: data.type });
  };

  /** Navigate to a section: update React state + URL */
  const navigateToSection = (sectionKey) => {
    setActiveSection(sectionKey);
    pushSectionUrl(sectionKey);
  };

  const save = async (contentToSave = content) => {
    setStatus('Saving…');
    if (contentToSave && typeof contentToSave.preventDefault === 'function') contentToSave = content;
    const payload = contentToSave?.historyOverview !== undefined && !contentToSave.about ? { ...content, about: contentToSave } : contentToSave;
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      const response = await fetch('/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }, body: JSON.stringify({ content: payload }), signal: controller.signal });
      window.clearTimeout(timeout);
      if (!response.ok) { const errorBody = await response.json().catch(() => ({})); throw new Error(errorBody.message || `Save failed (${response.status})`); }
      setStatus('Saved just now');
    } catch (error) {
      setStatus(error.name === 'AbortError' ? 'Save timed out' : (error.message || 'Unable to save changes'));
    }
  };

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-brand"><img src="/images/logo.png" alt="OLSHCO logo" /><span>OLSHCO<br /><small>Homepage editor</small></span></div>
      <p className="admin-sidebar-copy">Manage each public page independently. Choose a page, then edit its sections.</p>
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="admin-nav-label">{group.label}</div>
          <nav className="admin-nav">
            {group.items.filter((key) => key === 'home' || key === 'administration' || Object.prototype.hasOwnProperty.call(content, key)).map((key) => (
              <a
                key={key}
                href={`/admin/${key}/edit`}
                className={activeSection === key ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); navigateToSection(key); }}
                aria-current={activeSection === key ? 'page' : undefined}
              >{SECTION_LABELS[key] || pretty(key)}</a>
            ))}
          </nav>
        </div>
      ))}
      <form action="/admin/logout" method="POST" className="admin-logout"><input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').content} /><button type="submit">Sign out</button></form>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><span className="admin-eyebrow">{activeGroup.toUpperCase()}</span><h1>{SECTION_LABELS[activeSection] || pretty(activeSection)}</h1></div><div className="admin-actions"><span className="admin-status">{status}</span><a href={activeSection === 'services' ? '/services' : '/'} target="_blank" rel="noreferrer" className="admin-preview">View page ↗</a><button type="button" className="admin-save" onClick={save}>Save changes</button></div></header>
      <section className={`admin-panel ${activeSection === 'services' || activeSection === 'academics' || activeSection === 'about' || activeSection === 'admissions' || activeSection === 'contact' || activeSection === 'pvmo' || activeSection === 'administration' || activeSection === 'home' ? 'admin-panel-wide' : ''}`}><div className="admin-panel-intro"><span>{SECTION_LABELS[activeSection] || pretty(activeSection)}</span><p>{activeSection === 'home' ? 'Manage homepage hero banner, site navigation settings, section visibility, and footer.' : 'Changes are stored in the site database and appear on the public page after refresh.'}</p></div>{activeSection === 'services' ? <ServicesEditor value={activeValue} onChange={(next) => setContent({ ...content, services: next })} onImageUpload={uploadImage} onSave={(servicesValue) => save({ ...content, ...servicesValue })} /> : activeSection === 'home' ? <HomeEditor content={content} onChange={setContent} onImageUpload={uploadImage} /> : activeSection === 'academics' ? <AcademicsEditor value={activeValue} onChange={(next) => setContent({ ...content, academics: next })} onImageUpload={uploadImage} onSave={save} /> : activeSection === 'about' ? <AboutEditor value={activeValue} onChange={(next) => setContent({ ...content, about: next })} onImageUpload={uploadImage} onAudioUpload={uploadAudio} onSave={save} /> : activeSection === 'administration' ? <AdministrationEditor value={activeValue} onChange={(next) => setContent({ ...content, facultyStaff: next })} onImageUpload={uploadImage} /> : activeSection === 'admissions' ? <AdmissionsEditor value={activeValue} onChange={(next) => setContent({ ...content, admissions: next })} onSave={save} /> : activeSection === 'contact' ? <ContactEditor value={activeValue} onChange={(next) => setContent({ ...content, contact: next })} onSave={save} /> : activeSection === 'hero' ? <HeroEditor value={activeValue} onChange={(next) => setContent({ ...content, hero: next })} onImageUpload={uploadImage} /> : activeSection === 'pvmo' ? <PvmoEditor value={activeValue} onChange={(next) => setContent({ ...content, pvmo: next })} onImageUpload={uploadImage} /> : <Editor value={activeValue} onChange={(next) => setContent({ ...content, [activeSection]: next })} onImageUpload={uploadImage} />}</section>
    </main>
  </div>;
}

createRoot(document.getElementById('admin-app')).render(<AdminApp />);
