import React, { useState, useEffect } from 'react';
import Particles from './Particles';
import RichText from './RichText';
import { getStoredTheme } from './ThemeToggle';

// Icons matching the reference design
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M12 6v10" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
  </svg>
);

const CompassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M12 3v18M6 8h12" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

// Map value titles to appropriate icons
const getValueIcon = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('faith') || t.includes('god') || t.includes('catholic')) return <CrossIcon />;
  if (t.includes('excel') || t.includes('quality') || t.includes('academic')) return <StarIcon />;
  if (t.includes('leader') || t.includes('communit') || t.includes('people')) return <UsersIcon />;
  return <HeartIcon />;
};

export default function Pvmo({ content = {} }) {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme);
      }
    };
    window.addEventListener('olshco:themechange', handleThemeChange);
    return () => window.removeEventListener('olshco:themechange', handleThemeChange);
  }, []);

  const badge = content.badge || 'OUR FOUNDATIONS';
  const title = content.title || 'Philosophy, Vision, Mission & Core Values';
  const description = content.description || 'The guiding principles and spiritual cornerstone that define our commitment to holistic Christian education at OLSHCO.';

  const philosophy = content.philosophy || 'OLSHCO believes in holistic education that nurtures the mind, touches the heart, and forms learners rooted in faith, compassion, and service.';
  const philosophyKicker = content.philosophyKicker || 'WHOLE PERSON.\nBRIGHTER TOMORROWS.';
  const philosophyScript = content.philosophyScript || 'Mind Heart Faith Service';

  const vision = content.vision || 'A premier Catholic academic community recognized for transformative education, spiritual depth, and ethical leadership in service of God, country, and society.';
  const visionKicker = content.visionKicker || 'A BRIGHTER TOMORROW';

  const mission = content.mission || 'To provide quality, accessible, and faith-centered education that empowers learners with competence, character, and commitment to community.';
  const missionKicker = content.missionKicker || 'PEOPLE WITH PURPOSE';

  const coreValuesTagline = content.coreValuesTagline || 'ROOTED IN FAITH.\nLIVING THE VALUES.';

  const coreValues = Array.isArray(content.coreValues) ? content.coreValues : [];

  const watermarkText = content.watermarkText || 'EDUCATION\nIN FAITH\nFOR A MORE\nHUMAN WORLD';
  const scriptText = content.scriptText || 'Faith\nForms\nBrighter\nTomorrows';
  const footerMark = content.footerMark || 'OUR LADY OF THE SACRED HEART COLLEGE';
  const footerSub = content.footerSub || 'Faith · Formation · A Brighter Tomorrow';

  return (
    <section className="pvmo-ref-section section" id="pvmo">
      {/* Background Decorative Watermarks */}
      <div className="pvmo-watermark-left" aria-hidden="true">
        <svg className="pvmo-cross-svg" viewBox="0 0 100 150" fill="none" stroke="currentColor">
          <path d="M50 10 V140 M16 48 H84" strokeWidth="7" strokeLinecap="round" />
        </svg>
        <div className="pvmo-cross-text">
          {watermarkText.split('\n').map((line, idx) => (
            <span key={idx}>{line}</span>
          ))}
        </div>
      </div>

      <div className="pvmo-script-right" aria-hidden="true">
        {scriptText.split('\n').map((line, idx) => (
          <span key={idx}>{line}</span>
        ))}
      </div>

      <div className="pvmo-botanical-right" aria-hidden="true">
        <svg viewBox="0 0 200 240" fill="none">
          <path d="M190 230 C 140 180, 110 120, 130 30" stroke="rgba(147, 197, 253, 0.45)" strokeWidth="3" strokeLinecap="round" />
          <path d="M150 150 C 120 140, 100 110, 110 80 C 130 95, 145 125, 150 150 Z" fill="rgba(191, 219, 254, 0.4)" />
          <path d="M165 110 C 140 90, 135 60, 150 40 C 170 55, 175 85, 165 110 Z" fill="rgba(191, 219, 254, 0.35)" />
          <path d="M135 180 C 105 175, 80 155, 85 130 C 110 140, 125 160, 135 180 Z" fill="rgba(191, 219, 254, 0.3)" />
          <path d="M180 190 C 160 170, 155 140, 170 120 C 190 135, 195 165, 180 190 Z" fill="rgba(191, 219, 254, 0.35)" />
        </svg>
      </div>

      <div className="pvmo-ref-container">
        {/* Header Area */}
        <header className="pvmo-ref-header fade-in">
          <div className="pvmo-badge-wrap">
            <span className="pvmo-badge-line" />
            <span className="pvmo-badge">{badge}</span>
            <span className="pvmo-badge-line" />
          </div>
          <h2 className="pvmo-ref-title">{title}</h2>
          <RichText as="div" className="pvmo-ref-subtitle" content={description} />
        </header>

        {/* Main Grid: Left Big Philosophy Card + Right Column (Vision, Mission, Core Values) */}
        <div className="pvmo-ref-grid">
          {/* LEFT: Philosophy Card with Headline-style Particles Background */}
          <article className="pvmo-philo-card fade-in">
            <Particles
              quantity={70}
              ease={60}
              color={theme === 'maroon' ? '#fca5a5' : '#93c5fd'}
              size={1.3}
              staticity={40}
            />

            <div className="pvmo-philo-content">
              <div className="pvmo-philo-icon-wrap">
                <span className="pvmo-philo-icon">
                  <BookIcon />
                </span>
                <span className="pvmo-philo-dash" />
              </div>

              <h3 className="pvmo-philo-title">Philosophy</h3>
              <RichText as="div" className="pvmo-philo-body" content={philosophy} />

              {(Boolean(philosophyKicker?.trim()) || Boolean(philosophyScript?.trim())) && (
                <div className="pvmo-philo-bottom">
                  {Boolean(philosophyKicker?.trim()) && (
                    <div className="pvmo-philo-kicker">
                      {philosophyKicker.split('\n').map((line, idx) => (
                        <span key={idx}>{line}</span>
                      ))}
                    </div>
                  )}
                  {Boolean(philosophyScript?.trim()) && (
                    <div className="pvmo-philo-script">{philosophyScript}</div>
                  )}
                </div>
              )}
            </div>
          </article>

          {/* RIGHT COLUMN */}
          <div className="pvmo-right-col">
            {/* Top row: Vision & Mission cards */}
            <div className="pvmo-vm-row">
              {/* Vision Card */}
              <article className="pvmo-vm-card pvmo-vision-card fade-in">
                <div className="pvmo-vm-head">
                  <span className="pvmo-vm-icon pvmo-icon-blue">
                    <EyeIcon />
                  </span>
                  <div className="pvmo-vm-num-wrap">
                    <span className="pvmo-vm-kicker">{visionKicker}</span>
                  </div>
                </div>
                <h3 className="pvmo-vm-title">Vision</h3>
                <RichText as="div" className="pvmo-vm-desc" content={vision} />
              </article>

              {/* Mission Card */}
              <article className="pvmo-vm-card pvmo-mission-card fade-in">
                <div className="pvmo-vm-head">
                  <span className="pvmo-vm-icon pvmo-icon-blue">
                    <CompassIcon />
                  </span>
                  <div className="pvmo-vm-num-wrap">
                    <span className="pvmo-vm-kicker">{missionKicker}</span>
                  </div>
                </div>
                <h3 className="pvmo-vm-title">Mission</h3>
                <RichText as="div" className="pvmo-vm-desc" content={mission} />
              </article>
            </div>

            {/* Bottom row: Core Values Wide Card */}
            <article className="pvmo-values-card fade-in">
              <div className="pvmo-values-head">
                <div className="pvmo-values-title-wrap">
                  <span className="pvmo-vm-icon pvmo-icon-blue">
                    <HeartIcon />
                  </span>
                  <h3 className="pvmo-values-title">Core Values</h3>
                </div>
                <div className="pvmo-values-tagline">
                  {coreValuesTagline.split('\n').map((line, idx) => (
                    <span key={idx}>{line}</span>
                  ))}
                </div>
              </div>

              <div className="pvmo-values-pills">
                {coreValues.map((val, idx) => {
                  const isObj = typeof val === 'object' && val !== null;
                  const vTitle = isObj ? val.title : val;
                  const vDesc = isObj ? val.description : '';
                  return (
                    <div key={idx} className="pvmo-value-pill">
                      <span className="pvmo-pill-icon">{getValueIcon(vTitle)}</span>
                      <div className="pvmo-pill-text">
                        <strong className="pvmo-pill-title">{vTitle}</strong>
                        {vDesc && <RichText as="small" className="pvmo-pill-desc" content={vDesc} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>

        {/* Footer Brand Line at bottom of PVMO section */}
        <footer className="pvmo-footer-mark fade-in">
          <div className="pvmo-footer-line-wrap">
            <span className="pvmo-footer-line" />
            <span className="pvmo-footer-brand">{footerMark}</span>
            <span className="pvmo-footer-line" />
          </div>
          <div className="pvmo-footer-sub">{footerSub}</div>
        </footer>
      </div>
    </section>
  );
}
