import React from 'react';
import RichText from './RichText';

const DETAILS = [
  ['personInCharge', 'Person in charge'],
  ['location', 'Location'],
  ['officeHours', 'Office hours'],
  ['contact', 'Contact information'],
];

const officeSlug = (name = '') => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function Services({ content }) {
  const offices = content.offices || [];
  const pathParts = window.location.pathname.replace(/\/$/, '').split('/');
  const selectedSlug = pathParts.length > 2 ? pathParts[2] : null;
  const selectedOffice = selectedSlug ? offices.find((office) => officeSlug(office.name) === selectedSlug) : null;
  if (selectedSlug && selectedOffice) {
    return <OfficeDetail office={selectedOffice} />;
  }
  return <section className="services-page" id="services">
    <div className="container">
      <header className="services-heading">
        <a className="services-back" href="/">Home / Services</a>
        <span className="services-eyebrow">{content.badge}</span>
        <h1>{content.title}</h1>
        <RichText className="services-intro" content={content.description} />
      </header>
      <div className="services-grid">
        {offices.map((office, index) => <article className="office-card" key={index}>
          {office.image ? <img className="office-photo" src={office.image} alt={office.name} loading="lazy" /> : <div className="office-placeholder" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 54h44M16 54V14h32v40M25 54V40h14v14M24 23h4m8 0h4m-16 9h4m8 0h4" /><path d="M24 14V8h16v6" /></svg>
            <span>OLSHCO · CAMPUS OFFICES</span>
          </div>}
          <div className="office-content">
            <span className="office-number">OFFICE {String(index + 1).padStart(2, '0')}</span>
            <h2>{office.name}</h2>
            <a className="office-view-link" href={`/services/${officeSlug(office.name)}`}>View office details →</a>
            {office.description && <p className="office-description">{office.description}</p>}
            {!!office.offers?.length && <div className="office-offers"><h3>Services offered</h3><ul>{office.offers.filter(Boolean).map((offer, offerIndex) => <li key={offerIndex}>{offer}</li>)}</ul></div>}
            {DETAILS.some(([key]) => office[key]?.trim()) && <dl className="office-details">
              {DETAILS.filter(([key]) => office[key]?.trim()).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{office[key]}</dd></div>)}
            </dl>}
          </div>
          {!!office.gallery?.filter(Boolean).length && <div className="office-gallery"><h3>Office gallery</h3><div className="office-gallery-grid">{office.gallery.filter(Boolean).map((image, imageIndex) => <img key={imageIndex} src={image} alt={`${office.name} ${imageIndex + 1}`} loading="lazy" />)}</div></div>}
        </article>)}
      </div>
      {offices.length === 0 && <p className="services-empty">Office details will be available soon.</p>}
    </div>
  </section>;
}

function OfficeDetail({ office }) {
  const gallery = office.gallery?.filter(Boolean) || [];
  return <section className="services-page office-detail-page" id="services">
    <div className="container">
      <a className="services-back" href="/services">← Back to Services Offered</a>
      <header className="services-heading">
        <span className="services-eyebrow">CAMPUS OFFICE</span>
        <h1>{office.name}</h1>
        {office.description && <p className="services-intro">{office.description}</p>}
      </header>
      <div className="office-detail-layout">
        <div>
          {office.image ? <img className="office-detail-cover" src={office.image} alt={office.name} /> : <div className="office-detail-cover office-placeholder"><span>OLSHCO · CAMPUS OFFICES</span></div>}
          {!!gallery.length && <div className="office-detail-gallery"><h2>Office gallery</h2><div className="office-gallery-grid">{gallery.map((image, index) => <img key={index} src={image} alt={`${office.name} ${index + 1}`} />)}</div></div>}
        </div>
        <div className="office-detail-info">
          <h2 className="office-information-title">Office Information</h2>
          {!!office.offers?.filter(Boolean).length && <><h2>What we offer</h2><ul className="office-offer-list">{office.offers.filter(Boolean).map((offer, index) => <li key={index}>{offer}</li>)}</ul></>}
          {DETAILS.some(([key]) => office[key]?.trim()) && <dl className="office-details">{DETAILS.filter(([key]) => office[key]?.trim()).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{office[key]}</dd></div>)}</dl>}
        </div>
      </div>
    </div>
  </section>;
}
