import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Services from './Services';
import Hero from './Hero';
import Pvmo from './Pvmo';
import About from './About';
import Academics from './Academics';
import Admissions from './Admissions';
import Contact from './Contact';
import FacultyStaff from './FacultyStaff';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import InteractiveBackground from './InteractiveBackground';
import { HomepageContentProvider, useHomepageContent } from '../content/HomepageContentContext';

function SiteContent() {
  const content = useHomepageContent();
  const isServicesPage = window.location.pathname.replace(/\/$/, '').startsWith('/services');
  const isAboutPage = window.location.pathname.replace(/\/$/, '') === '/about';
  const isFacultyStaffPage = window.location.pathname.replace(/\/$/, '') === '/faculty-staff';

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.fade-in, .fade-in-left, .fade-in-right'
    );
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <InteractiveBackground />
      <CustomCursor />
      <Navbar site={content.site} />
      <main>
        {isServicesPage ? <Services content={content.services} /> : isAboutPage ? <About content={content.about} pvmo={content.pvmo} site={content.site} facultyStaff={content.facultyStaff} /> : isFacultyStaffPage ? <FacultyStaff content={content.facultyStaff} /> : <>
        {content.visibility.hero && <Hero content={content.hero} />}
        {content.visibility?.pvmo !== false && content.pvmo && <Pvmo content={content.pvmo} />}
        {content.visibility.about && <About content={content.about} pvmo={content.pvmo} site={content.site} facultyStaff={content.facultyStaff} />}
        {content.visibility.academics && <Academics content={content.academics} />}
        {content.visibility.admissions && <Admissions content={content.admissions} />}
        {content.visibility.contact && <Contact content={content.contact} />}
        </>}
      </main>
      <Footer site={content.site} content={content.footer} />
    </>
  );
}

export default function App() {
  return <HomepageContentProvider><SiteContent /></HomepageContentProvider>;
}
