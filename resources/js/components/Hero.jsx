import React, { useState, useEffect } from 'react';
import Particles from './Particles';
import RichText from './RichText';
import { getStoredTheme } from './ThemeToggle';

const DEFAULT_FALLBACK_SLIDES = [
  {
    id: 'slide-1',
    image: '',
    titleTop: 'ROOTED IN FAITH',
    titleBottom: 'GROUNDED IN EXCELLENCE',
    description: 'Guided by the Oneness of Heart of Jesus and Mary, OLSHCO provides holistic, values-centered education that nurtures faith, develops excellence, and prepares learners to serve, lead, and contribute to a sustainable future.',
    badgeTitle: 'Faith and',
    badgeSub: 'Character',
  },
  {
    id: 'slide-2',
    image: '',
    titleTop: 'EMPOWERING MINDS',
    titleBottom: 'TOUCHING HEARTS',
    description: 'Experience transformative Catholic education with dedicated faculty, modern learning facilities, and programs that nurture both intellectual competence and moral character.',
    badgeTitle: 'Academic',
    badgeSub: 'Excellence',
  },
  {
    id: 'slide-3',
    image: '',
    titleTop: 'PURPOSE-DRIVEN',
    titleBottom: 'FUTURE-READY',
    description: 'From basic education to collegiate degrees, we equip young learners with the competence, character, and Christian values needed to thrive in tomorrow\'s world.',
    badgeTitle: 'Holistic',
    badgeSub: 'Formation',
  },
  {
    id: 'slide-4',
    image: '',
    titleTop: 'SERVICE IN LOVE',
    titleBottom: 'COMMUNITY OF HOPE',
    description: 'Join a vibrant school family where faith inspires action, compassion drives community outreach, and every student is valued and encouraged to excel.',
    badgeTitle: 'Compassion',
    badgeSub: '& Service',
  },
  {
    id: 'slide-5',
    image: '',
    titleTop: 'YOUR JOURNEY',
    titleBottom: 'BEGINS AT OLSHCO',
    description: 'Enroll today and become part of the OLSHCO family. Discover your potential in an atmosphere of faith, integrity, and lifelong learning.',
    badgeTitle: 'Join Our',
    badgeSub: 'Family',
  },
];

export default function Hero({ content = {} }) {
  const [theme, setTheme] = useState(getStoredTheme);
  const phoneNumber = content.phoneNumber || '(044) 958-0000';

  // Slides configuration (at least 5 slides)
  const slides = Array.isArray(content.slides) && content.slides.length > 0
    ? content.slides
    : (content.image ? [{
        id: 'slide-1',
        image: content.image,
        titleTop: content.titleTop || 'ROOTED IN FAITH',
        titleBottom: content.titleBottom || 'GROUNDED IN EXCELLENCE',
        description: content.description,
        badgeTitle: 'Faith and',
        badgeSub: 'Character',
      }, ...DEFAULT_FALLBACK_SLIDES.slice(1)] : DEFAULT_FALLBACK_SLIDES);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalSeconds = Math.max(1, Number(content.intervalSeconds) || 4);

  useEffect(() => {
    const handleThemeChange = (e) => e.detail?.theme && setTheme(e.detail.theme);
    window.addEventListener('olshco:themechange', handleThemeChange);
    return () => window.removeEventListener('olshco:themechange', handleThemeChange);
  }, []);

  // 4-second rolling interval timer
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, currentSlide, intervalSeconds]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide] || slides[0] || {};
  const activeTitleTop = activeSlide.titleTop || content.titleTop || 'ROOTED IN FAITH';
  const activeTitleBottom = activeSlide.titleBottom || content.titleBottom || 'GROUNDED IN EXCELLENCE';
  const activeDescription = activeSlide.description || content.description || 'Guided by the Oneness of Heart of Jesus and Mary, OLSHCO provides holistic, values-centered education that nurtures faith, develops excellence, and prepares learners to serve, lead, and contribute to a sustainable future.';
  const activeBadgeTitle = activeSlide.badgeTitle || 'Faith and';
  const activeBadgeSub = activeSlide.badgeSub || 'Character';
  const activeCtaLabel = activeSlide.ctaLabel || content.ctaLabel || 'ENROLL NOW';
  const activeCtaLink = activeSlide.ctaLink || '#admissions';

  return (
    <section className="hero-split hero-background" id="home">
      <Particles
        quantity={120}
        ease={60}
        color={theme === 'maroon' ? '#fca5a5' : '#93c5fd'}
        size={1.4}
        staticity={40}
      />
      <div className="container hero-split-container">
        <div className="hero-split-left">
          <div className="hero-split-left-content" key={`slide-text-${currentSlide}`}>
            <div className="hero-institution-tag">
              <span className="tag-pulse" />
              {content.institutionTag || 'OUR LADY OF THE SACRED HEART COLLEGE OF GUIMBA INC.'}
            </div>
            <h1 className="hero-split-title">
              <span className="hero-split-title-blue">{activeTitleTop}</span>
              <span className="hero-split-title-dark">{activeTitleBottom}</span>
            </h1>
            <RichText
              as="div"
              className="hero-split-description"
              content={activeDescription}
              defaultContent="Guided by the Oneness of Heart of Jesus and Mary, OLSHCO provides holistic, values-centered education that nurtures faith, develops excellence, and prepares learners to serve, lead, and contribute to a sustainable future."
            />
            <div className="hero-split-actions">
              <a
                href={activeCtaLink}
                className="btn-enroll-pill"
                onClick={(e) => {
                  if (activeCtaLink.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(activeCtaLink)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {activeCtaLabel}
              </a>
              <div className="hero-call-info">
                <span className="hero-call-label">Call For More Info</span>
                <a href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`} className="hero-call-number">
                  <svg className="hero-phone-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span>{phoneNumber}</span>
                </a>
              </div>
            </div>
          </div>
          <div className="hero-quick-features">
            {(content.quickFeatures || []).map((feature) => (
              <div className="hero-qf-item" key={feature}>
                <span className="qf-check">OK</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="hero-split-right"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="hero-image-wrapper">
            <div className="hero-image-backdrop" />
            <div className="hero-discount-badge" key={`badge-${currentSlide}`}>
              <div className="badge-ring">
                <span className="badge-title">{activeBadgeTitle}</span>
                <span className="badge-sub">{activeBadgeSub}</span>
              </div>
            </div>
            <div className="hero-image-frame">
              {slides.map((slide, idx) => {
                const slideImg = slide.image || content.image || '';
                return (
                  <div
                    key={slide.id || idx}
                    className={`hero-slide-item ${idx === currentSlide ? 'active' : ''}`}
                    aria-hidden={idx !== currentSlide}
                  >
                    <div
                      className={`hero-main-photo ${slideImg ? '' : 'hero-image-placeholder'}`}
                      role="img"
                      aria-label={`OLSHCO campus slide ${idx + 1}`}
                      style={slideImg ? { backgroundImage: `url(${slideImg})` } : undefined}
                    />
                  </div>
                );
              })}
            </div>

            {slides.length > 1 && (
              <>
                <div className="hero-slide-counter">
                  <span className="counter-current">{String(currentSlide + 1).padStart(2, '0')}</span>
                  <span className="counter-sep">/</span>
                  <span className="counter-total">{String(slides.length).padStart(2, '0')}</span>
                </div>

                <button
                  type="button"
                  className="slide-nav-btn slide-nav-prev"
                  onClick={handlePrev}
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="slide-nav-btn slide-nav-next"
                  onClick={handleNext}
                  aria-label="Next slide"
                >
                  ›
                </button>

                <div className="hero-slider-dots" role="tablist" aria-label="Hero slide navigation">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id || idx}
                      type="button"
                      role="tab"
                      aria-selected={idx === currentSlide}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                    >
                      {idx === currentSlide && (
                        <span className="slider-dot-progress" key={`progress-${currentSlide}`} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
