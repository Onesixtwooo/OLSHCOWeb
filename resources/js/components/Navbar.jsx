import React, { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '/about' },
  { label: 'Academics', href: '#academics' },
  { label: 'Admissions', href: '#admissions' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ site = {} }) {
  const isServicesPage = window.location.pathname.replace(/\/$/, '').startsWith('/services');
  const isAboutPage = window.location.pathname.replace(/\/$/, '') === '/about';
  const isSubPage = isServicesPage || isAboutPage;
  const navHref = (href) => isSubPage && href.startsWith('#') ? `/${href}` : href;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 50;
          if (isScrolled !== lastScrolled) {
            lastScrolled = isScrolled;
            setScrolled(isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use IntersectionObserver for active section to eliminate layout thrashing
    const sectionIds = NAV_ITEMS.filter((item) => item.href.startsWith('#')).map((item) => item.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (!href.startsWith('#') || isSubPage) {
      window.location.assign(navHref(href));
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href={navHref('#home')} onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}>
          <img className="navbar-logo" src="/images/logo.png" alt="OLSHCO logo" />
          {site.brand || 'OLSHCO'}
        </a>

        <ul className="navbar-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                className={`navbar-link${(isSubPage ? navHref(item.href) === (isAboutPage ? '/about' : '/services') : activeSection === item.href.slice(1)) ? ' active' : ''}`}
                href={navHref(item.href)}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <a
            className="navbar-cta"
            href={navHref('#admissions')}
            onClick={(e) => { e.preventDefault(); handleNavClick('#admissions'); }}
          >
            {site.enrollCta || 'Enroll Now'}
          </a>
        </div>

        <button
          className={`navbar-toggle${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`navbar-mobile${mobileOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            className="navbar-mobile-link"
            href={navHref(item.href)}
            onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
          >
            {item.label}
          </a>
        ))}
        <a
          className="btn btn-primary btn-sm"
          href={navHref('#admissions')}
          onClick={(e) => { e.preventDefault(); handleNavClick('#admissions'); }}
          style={{ marginTop: '16px' }}
        >
          {site.enrollCta || 'Enroll Now'}
        </a>
      </div>
    </nav>
  );
}
