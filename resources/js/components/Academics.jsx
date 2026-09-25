import React, { useEffect, useRef, useState } from 'react';
import RichText from './RichText';

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function ProgramCards({ programs = [], offset = 0, cardRef }) {
  return programs.map((program, index) => (
    <article
      className={`academic-card ${program.image ? 'has-photo' : 'academic-card-placeholder'} fade-in stagger-${Math.min(index + offset + 1, 4)}`}
      key={program.title}
      tabIndex="0"
      ref={index === 0 ? cardRef : undefined}
    >
      {program.image ? <img className="academic-card-image" src={program.image} alt="" /> : <div className="academic-card-image academic-card-image-placeholder" aria-label="Placeholder image" />}
      <div className="academic-card-header">
        <div className="academic-card-level">{program.level}</div>
        <h3 className="academic-card-title">{program.title}</h3>
      </div>
      <div className="academic-card-body" aria-label={`${program.title} program details`}>
        <div className="academic-card-content">
          <RichText as="div" className="academic-card-desc" content={program.description} />
          <ul className="academic-features">
            {program.features.map((feature) => (
              <li className="academic-feature" key={feature}>
                <span className="academic-feature-icon">
                  <CheckIcon />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="academic-card-actions">
          <a
            href={program.link || '#admissions'}
            className="btn-academic-discover"
            onClick={(e) => {
              const targetLink = program.link || '#admissions';
              if (targetLink.startsWith('#')) {
                e.preventDefault();
                e.stopPropagation();
                document.querySelector(targetLink)?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span>Discover</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  ));
}

function CollegeCarousel({ programs }) {
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [cardStep, setCardStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const gap = visibleCount === 1 ? 16 : visibleCount === 2 ? 24 : 32;
  const hasOverflow = programs.length > visibleCount;
  const maxIndex = Math.max(0, programs.length - visibleCount);

  useEffect(() => {
    const updateLayout = () => {
      const nextVisibleCount = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 4;
      setVisibleCount(nextVisibleCount);
      setActiveIndex((current) => Math.min(current, Math.max(0, programs.length - nextVisibleCount)));
      if (viewportRef.current) {
        const viewportWidth = viewportRef.current.clientWidth;
        const nextGap = nextVisibleCount === 1 ? 16 : nextVisibleCount === 2 ? 24 : 32;
        const cardWidth = (viewportWidth - nextGap * (nextVisibleCount - 1)) / nextVisibleCount;
        setCardStep(cardWidth + nextGap);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout, { passive: true });
    return () => window.removeEventListener('resize', updateLayout);
  }, [programs.length]);

  useEffect(() => {
    if (!hasOverflow || paused) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 4600);
    return () => window.clearInterval(timer);
  }, [hasOverflow, maxIndex, paused]);

  const move = (direction) => {
    setActiveIndex((current) => {
      if (direction === 'next') return current >= maxIndex ? 0 : current + 1;
      return current <= 0 ? maxIndex : current - 1;
    });
  };

  return (
    <div
      className={`college-carousel${hasOverflow ? ' college-carousel-overflow' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="college-carousel-viewport" ref={viewportRef}>
        <div
          className="college-carousel-track"
          style={{
            '--college-card-width': `${Math.max(cardStep - gap, 0)}px`,
            transform: `translate3d(-${activeIndex * cardStep}px, 0, 0)`,
          }}
        >
          <ProgramCards programs={programs} offset={4} />
        </div>
      </div>

      {hasOverflow && (
        <div className="college-carousel-controls">
          <span className="college-carousel-status" aria-live="polite">
            {activeIndex + 1} / {maxIndex + 1}
          </span>
          <div className="college-carousel-buttons">
            <button type="button" onClick={() => move('previous')} aria-label="Previous college programs">←</button>
            <button type="button" onClick={() => move('next')} aria-label="Next college programs">→</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Academics({ content = {} }) {
  const ibed = content.ibed || {};
  const college = content.college || {};
  return (
    <section className="academics section" id="academics">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            {content.badge || 'Academics'}
          </div>
          <h2 className="heading-lg section-title">{content.title || 'Academic Programs'}</h2>
          <RichText
            as="div"
            className="text-body-lg section-subtitle"
            content={content.description}
            defaultContent="A complete Catholic education journey from preschool to college, developing the whole person — intellectually, spiritually, and socially."
          />
        </div>

        <div className="academic-departments">
          <div className="academic-department">
            <div className="department-heading">
              <span className="department-kicker">{ibed.kicker || 'IBED'}</span>
              <div>
                <h3>{ibed.title || 'Integrated Basic Education Department'}</h3>
                <RichText as="div" className="department-desc" content={ibed.description} defaultContent="Preschool, elementary, junior high, and senior high school programs." />
              </div>
            </div>
            <div className="academics-grid ibed-grid">
              <ProgramCards programs={ibed.programs || []} />
            </div>
          </div>

          <div className="academic-department college-department">
            <div className="department-heading">
              <span className="department-kicker">{college.kicker || 'COLLEGE'}</span>
              <div>
                <h3>{college.title || 'College Department'}</h3>
                <RichText as="div" className="department-desc" content={college.description} defaultContent="College departments and programs preparing students for purposeful careers and service." />
              </div>
            </div>
            <CollegeCarousel programs={college.programs || []} />
          </div>
        </div>
      </div>
    </section>
  );
}
