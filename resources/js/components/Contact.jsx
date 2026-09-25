import React, { useState } from 'react';
import RichText from './RichText';

function DetailIcon({ type }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (type === 'phone') return <svg {...common}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" /></svg>;
  if (type === 'mail') return <svg {...common}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" /><path d="m22 6-10 7L2 6" /></svg>;
  if (type === 'clock') return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  return <svg {...common}><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2Z" /><path d="m22 7-10 7L2 7" /></svg>;
}

export default function Contact({ content = {} }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  const details = content.details || [];
  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="contact contact-reference section" id="contact">
      <div className="container">
        <div className="section-header contact-reference-header">
          <div className="section-badge"><MailIcon /> {content.badge || 'Get in Touch'}</div>
          <h2 className="heading-lg section-title">{content.title || 'Contact Us'}</h2>
          <RichText
            as="div"
            className="text-body-lg section-subtitle"
            content={content.description}
            defaultContent="Have questions? We'd love to hear from you. Reach out and our team will respond promptly."
          />
        </div>

        <div className="contact-reference-grid">
          <div className="contact-reference-info fade-in-left">
            <div className="contact-reference-kicker">OUR LADY OF THE SACRED HEART COLLEGE</div>
            <h3>{content.introTitle || "Let's Connect"}</h3>
            <RichText
              as="div"
              className="contact-intro-desc"
              content={content.introDescription}
              defaultContent="Whether you're a prospective student, parent, or community member, we're here to help. Visit our campus or get in touch through any of the channels below."
            />
            <div className="contact-reference-details">
              {details.map((detail) => (
                <div className="contact-reference-detail" key={detail.label}>
                  <span className="contact-reference-detail-icon"><DetailIcon type={detail.icon} /></span>
                  <span><small>{detail.label}</small><strong>{detail.value}</strong></span>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-reference-visual" aria-label="Campus and map image unavailable">
            <div className="contact-reference-campus-placeholder" />
            <div className="contact-reference-welcome"><DetailIcon type="pin" /><strong>A welcoming<br />community awaits</strong><span>→</span></div>
          </div>

          <div className="contact-form-wrapper contact-reference-form fade-in-right">
            <div className="contact-reference-form-heading"><span><MailIcon /></span><div><h3>{content.formTitle || 'Send Us a Message'}</h3><RichText as="div" className="contact-form-desc" content={content.formDescription} defaultContent="Fill out the form below and our team will get back to you as soon as possible." /></div></div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label className="form-label" htmlFor="firstName">First Name</label><input className="form-input" type="text" id="firstName" name="firstName" placeholder="Juan" value={formData.firstName} onChange={handleChange} required /></div>
                <div className="form-group"><label className="form-label" htmlFor="lastName">Last Name</label><input className="form-input" type="text" id="lastName" name="lastName" placeholder="Dela Cruz" value={formData.lastName} onChange={handleChange} required /></div>
              </div>
              <div className="form-group"><label className="form-label" htmlFor="email">Email Address</label><input className="form-input" type="email" id="email" name="email" placeholder="juan@example.com" value={formData.email} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label" htmlFor="subject">Subject</label><select className="form-input" id="subject" name="subject" value={formData.subject} onChange={handleChange} required><option value="" disabled>Select a topic</option><option>Enrollment Inquiry</option><option>Academic Programs</option><option>Campus Visit</option><option>General Question</option></select></div>
              <div className="form-group"><label className="form-label" htmlFor="message">Message</label><textarea className="form-textarea" id="message" name="message" placeholder="Tell us how we can help you..." value={formData.message} onChange={handleChange} required /></div>
              <button type="submit" className="btn btn-primary contact-reference-submit">Send Message <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg></button>
              <RichText
                as="small"
                className="contact-reference-response"
                content={content.responseNote}
                defaultContent="We typically respond within 1–2 business days."
              />
            </form>
          </div>
        </div>
        <div className="contact-reference-footer">Faith&nbsp;&nbsp;•&nbsp;&nbsp;Learning&nbsp;&nbsp;•&nbsp;&nbsp;Service&nbsp;&nbsp;•&nbsp;&nbsp;Community</div>
      </div>
    </section>
  );
}
