import React from 'react';
import RichText from './RichText';

function StepIcon({ type }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (type === 'document') return <svg {...common}><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v5h4M9 13h6M9 16.5h5" /></svg>;
  if (type === 'cap') return <svg {...common}><path d="m3 9 9-4 9 4-9 4-9-4Z" /><path d="M7 11.2v4.2c2.8 2.3 7.2 2.3 10 0v-4.2M21 9v6" /></svg>;
  if (type === 'heart') return <svg {...common}><path d="M20.8 8.7c0 5.3-8.8 10.2-8.8 10.2S3.2 14 3.2 8.7A4.5 4.5 0 0 1 12 6.5a4.5 4.5 0 0 1 8.8 2.2Z" /></svg>;
  return <svg {...common}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2.3" /><path d="M3.5 19c0-3 2.4-5.2 5.5-5.2s5.5 2.2 5.5 5.2M14.5 14.8c2.8-.2 5 1.5 5.6 4.2" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

export default function Admissions({ content = {} }) {
  const steps = content.steps || [];
  return (
    <section className="admissions admissions-reference section" id="admissions">
      <div className="container">
        <div className="section-header admissions-reference-header">
          <div className="section-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            {content.badge || 'Admissions'}
          </div>
          <h2 className="heading-lg section-title">{content.title || 'How to Enroll'}</h2>
          <RichText
            as="div"
            className="text-body-lg section-subtitle"
            content={content.description}
            defaultContent="Begin your journey with OLSHCO. Our simple four-step process will guide you from inquiry to enrollment."
          />
        </div>

        <div className="admissions-layout">
          <aside className="admissions-spotlight fade-in">
            <div className="admissions-spotlight-placeholder" aria-hidden="true" />
            <span className="spotlight-eyebrow">{content.spotlightEyebrow || 'YOUR NEXT CHAPTER'}</span>
            <h3>{(content.spotlightTitle || 'Start your OLSHCO journey.').split(' ').map((word, index) => <React.Fragment key={`${word}-${index}`}>{word}{index < (content.spotlightTitle || '').split(' ').length - 1 ? ' ' : ''}</React.Fragment>)}</h3>
            <RichText
              as="div"
              className="admissions-spotlight-desc"
              content={content.spotlightDescription}
              defaultContent="A simple, personal path from your first inquiry to becoming part of our faith-filled school community."
            />
            <div className="spotlight-meta"><span className="spotlight-meta-number">{String(steps.length).padStart(2, '0')}</span><span>steps to enrollment</span></div>
            <a href="#contact" className="btn btn-light admissions-spotlight-button" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {content.spotlightButton || 'Contact Admissions Office'} <ArrowIcon />
            </a>
            <div className="admissions-faith-badge"><StepIcon type="heart" /><span>Faith<br /><strong>Forms Brighter<br />Futures</strong></span></div>
          </aside>

          <div className="admissions-steps-grid">
            {steps.map((step, index) => (
              <article className={`admission-step-card fade-in stagger-${index + 1}`} key={`${step.title || 'step'}-${index}`}>
                <div className="admission-step-marker">{String(index + 1).padStart(2, '0')}</div>
                <div className="admission-step-card-inner">
                  <div className="admission-step-icon"><StepIcon type={step.icon || ['people', 'document', 'cap', 'heart'][index % 4]} /></div>
                  <div className="admission-step-copy"><h3>{step.title}</h3><RichText as="div" className="admission-step-desc" content={step.description} /></div>
                  <span className="admission-step-arrow"><ArrowIcon /></span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="admissions-reference-footer">Faith&nbsp;&nbsp;•&nbsp;&nbsp;Learning&nbsp;&nbsp;•&nbsp;&nbsp;Service&nbsp;&nbsp;•&nbsp;&nbsp;Community</div>
      </div>
    </section>
  );
}
