import React from 'react';

const fallbackStaff = [
  { name: 'School Administration', role: 'Office of the President', department: 'Administration', email: '' },
  { name: 'Faculty Directory', role: 'Elementary, Junior High, and Senior High School', department: 'Academic Faculty', email: '' },
  { name: 'College Faculty', role: 'College Programs and Formation', department: 'Academic Faculty', email: '' },
  { name: 'Student Services Team', role: 'Guidance, clinic, and student support', department: 'Student Services', email: '' },
];

export default function FacultyStaff({ content = {} }) {
  const entries = Array.isArray(content.entries) && content.entries.length ? content.entries : fallbackStaff;
  const departmentDetails = Array.isArray(content.departments) ? content.departments : [];
  const grouped = entries.reduce((groups, person) => {
    const key = person.department || 'Faculty and Staff';
    (groups[key] ||= []).push(person);
    return groups;
  }, {});

  return <section className="directory-page section">
    <div className="container">
      <header className="directory-heading">
        <span className="section-badge">OLSHCO COMMUNITY</span>
        <h1>Faculty &amp; Staff Directory</h1>
        <p>Meet the educators, leaders, and support teams who help form learners in faith, excellence, and service.</p>
      </header>
      <div className="directory-groups">
        {Object.entries(grouped).map(([department, people]) => <section className="directory-group" key={department}>
          <div className="directory-group-heading"><span>Our people</span><div><h2>{department}</h2>{departmentDetails.find((item) => item.name === department)?.description && <p>{departmentDetails.find((item) => item.name === department).description}</p>}</div></div>
          <div className="directory-grid">
            {people.map((person, index) => { const profileImage = String(person.image || person.photo || '').trim(); const hasProfileImage = !!profileImage; return <article className={`directory-card has-image${hasProfileImage ? '' : ' is-logo-fallback'}`} key={`${person.name}-${index}`}>
              <img className="directory-card-image" src={profileImage || '/images/logo.png'} alt={hasProfileImage ? (person.name || 'Staff member') : 'OLSHCO logo'} />
              <div className="directory-card-body"><h3>{person.name}</h3>{person.role && <p>{person.role}</p>}{person.email && <a href={`mailto:${person.email}`}>{person.email}</a>}</div>
            </article>; })}
          </div>
        </section>)}
      </div>
    </div>
  </section>;
}
