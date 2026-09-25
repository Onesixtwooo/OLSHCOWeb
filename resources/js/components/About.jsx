import React from 'react';
import RichText from './RichText';
import Pvmo from './Pvmo';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.5 14.2 9l5.8.4-4.5 3.7 1.4 5.6-4.9-3.1-4.9 3.1 1.4-5.6L4 9.4 9.8 9 12 3.5Z" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h3.5a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H7a2.5 2.5 0 0 0-2.5 2.5v-14Z" />
    <path d="M19.5 5.5A2.5 2.5 0 0 0 17 3h-3.5a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3H17a2.5 2.5 0 0 1 2.5 2.5v-14Z" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3v18M7 8h10M8.5 5.5h7" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.8 8.7c0 5.3-8.8 10.2-8.8 10.2S3.2 14 3.2 8.7A4.5 4.5 0 0 1 12 6.5a4.5 4.5 0 0 1 8.8 2.2Z" />
  </svg>
);

const Feature = ({ icon, title, description }) => (
  <article className="about-reference-feature">
    <span className="about-reference-feature-icon">{icon}</span>
    <span>
      <strong>{title}</strong>
      <RichText as="small" content={description} />
    </span>
  </article>
);

const renderLines = (text, defaultText = '') => {
  const content = text ?? defaultText;
  if (!content) return null;
  const lines = String(content).split('\n');
  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx < lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

export default function About({ content = {}, pvmo = {}, site = {}, facultyStaff = {} }) {
  const features = content.features || [];
  const impact = content.impact || [];
  const cardTopEyebrow = content.cardTopEyebrow ?? 'Faith';
  const cardTopTitle = content.cardTopTitle ?? 'Forms Brighter\nFutures';
  const cardBottomEyebrow = content.cardBottomEyebrow ?? 'A Community';
  const cardBottomTitle = content.cardBottomTitle ?? 'for Life';
  const actionLabel = content.actionLabel ?? 'Learn More';
  const actionLink = content.actionLink ?? '#academics';
  const taglineRule = content.taglineRule ?? 'Faith • Learning • Service • Community';
  const footerMark = content.footerMark ?? 'OUR LADY OF THE SACRED HEART COLLEGE';
  const actionHref = window.location.pathname.replace(/\/$/, '') === '/about' && actionLink.startsWith('#') ? `/${actionLink}` : actionLink;
  const isStandaloneAbout = window.location.pathname.replace(/\/$/, '') === '/about';
  const staffPreviewDefaults = [
    { name: 'School President', role: 'President', department: 'School Leadership' },
    { name: 'Vice President for Academic Affairs', role: 'VPAA', department: 'School Leadership' },
    { name: 'Vice President for Administration', role: 'VP Administration', department: 'School Leadership' },
  ];
  const staffPreview = (Array.isArray(facultyStaff.entries) && facultyStaff.entries.length ? facultyStaff.entries : staffPreviewDefaults)
    .map((person, index) => ({ ...person, _index: index }))
    .sort((a, b) => (Number(a.order ?? a.sortOrder ?? a._index) - Number(b.order ?? b.sortOrder ?? b._index)))
    .slice(0, 3);

  if (isStandaloneAbout) {
    return <section className="about-page section" id="about">
      <div className="container">
        <header className="about-page-heading"><span className="section-badge">About OLSHCO</span><h1>Our Story</h1><p>Discover the story, values, people, and community that make Our Lady of the Sacred Heart College a place of faith, formation, and brighter tomorrows.</p></header>
        <section className="about-page-story">
          <div className="about-page-story-copy"><span className="section-badge">About OLSHCO</span><h2>History of OLSHCO</h2><RichText as="div" className="about-reference-lead" content={content.historyOverview} defaultContent="Our Lady of the Sacred Heart College began with a simple mission: to form learners through faith, knowledge, and service." /></div>
        </section>
        <div className="about-directory-cta"><div><span className="section-badge">Our community</span><h2>Meet our faculty and staff</h2><p>Discover the people who guide learning, formation, and student life at OLSHCO.</p><div className="about-directory-preview">{staffPreview.map((person, index) => <article className="about-directory-person" key={`${person.name}-${index}`}>{(person.image || person.photo) && <img src={person.image || person.photo} alt={person.name || 'Staff member'} />}<div><strong>{person.name}</strong>{(person.image || person.photo) && <small>{person.role}</small>}</div></article>)}</div></div><a className="about-reference-link" href="/faculty-staff">View faculty &amp; staff <span aria-hidden="true">→</span></a></div>
        <Pvmo content={pvmo} />
        <section className="about-page-hymn"><div><span className="section-badge">Our school hymn</span><h2>{content.hymn?.title || 'OLSHCO School Hymn'}</h2><RichText as="div" className="about-hymn-lyrics" content={content.hymn?.lyrics} defaultContent="Our school hymn lyrics will be shared here." /></div>{content.hymn?.musicUrl && (content.hymn?.mediaType === 'video' || /\.(mp4|webm|mov)(?:\?|$)/i.test(content.hymn.musicUrl) ? <video controls preload="metadata" src={content.hymn.musicUrl}>Your browser does not support video playback.</video> : <audio controls preload="metadata" src={content.hymn.musicUrl}>Your browser does not support audio playback.</audio>)}</section>
        <section className="about-page-action"><div><span className="section-badge">Learn more</span><h2>Discover OLSHCO</h2><p>{taglineRule}</p></div><div className="about-reference-actions"><a className="about-reference-link" href={actionHref}>{actionLabel} <span aria-hidden="true">→</span></a><a className="about-reference-facebook" href={site.facebookUrl || 'https://www.facebook.com/'} target="_blank" rel="noreferrer">Visit us on Facebook <span aria-hidden="true">↗</span></a></div></section>
      </div>
    </section>;
  }

  return (
    <section className={`about section${isStandaloneAbout ? ' about-standalone' : ''}`} id="about">
      <div className="container">
        <div className="about-reference-layout">
          <div className="about-reference-visual" aria-label="OLSHCO campus">
            <div className="about-reference-blob" />
            <div className="about-reference-dot-grid" />

            <div
              className={`about-reference-image-frame ${content.image ? '' : 'about-reference-image-placeholder'}`}
              role="img"
              aria-label="OLSHCO campus"
            >
              {content.image && <img src={content.image} alt="OLSHCO campus" />}
            </div>

            <div className="about-reference-callout about-reference-callout-faith">
              <span className="about-reference-callout-icon"><CrossIcon /></span>
              <span>
                {renderLines(cardTopEyebrow)}
                <br />
                <strong>{renderLines(cardTopTitle)}</strong>
              </span>
              <i />
            </div>

            <div className="about-reference-callout about-reference-callout-community">
              <span className="about-reference-callout-icon"><BookIcon /></span>
              <span>
                {renderLines(cardBottomEyebrow)}
                <br />
                <strong>{renderLines(cardBottomTitle)}</strong>
              </span>
              <i />
            </div>
          </div>

          <div className="about-reference-copy">
            <div className="section-badge">{content.badge || 'About OLSHCO'}</div>
            <h2>{content.title || 'A school community where every learner is known, formed, and inspired to serve.'}</h2>
            <RichText
              as="div"
              className="about-reference-lead"
              content={content.description}
              defaultContent="Our Lady of the Sacred Heart College is a Catholic institution offering a connected education journey from preschool to college. OLSHCO brings together strong academics, spiritual formation, character development, and a caring community."
            />

            <div className="about-reference-features">
              {features.map((feature, index) => <Feature key={feature.title || index} icon={[<CheckIcon />, <CrossIcon />, <BookIcon />, <HeartIcon />][index % 4]} title={feature.title} description={feature.description} />)}
            </div>

            <div className="about-reference-impact" aria-label="Our impact">
              {impact.map((item, index) => <div key={item.title || index}><strong>{item.mark}</strong><span><b>{item.title}</b><RichText as="span" content={item.description} /></span></div>)}
            </div>

            <div className="about-reference-actions">
              <a className="about-reference-link" href={actionHref}>
                {actionLabel} <span aria-hidden="true">→</span>
              </a>
              <a className="about-reference-facebook" href={site.facebookUrl || 'https://www.facebook.com/'} target="_blank" rel="noreferrer">Visit us on Facebook <span aria-hidden="true">↗</span></a>
              <span className="about-reference-rule">{taglineRule}</span>
            </div>
          </div>
        </div>
        <div className="about-reference-footer-mark">{footerMark}</div>
      </div>
    </section>
  );
}
