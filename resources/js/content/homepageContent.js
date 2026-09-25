export const DEFAULT_HOMEPAGE_CONTENT = {
  site: {
    brand: 'OLSHCO',
    enrollCta: 'Enroll Now',
    facebookUrl: '',
  },
  visibility: {
    hero: true,
    pvmo: true,
    about: true,
    academics: true,
    admissions: true,
    contact: true,
  },
  hero: {
    institutionTag: 'OUR LADY OF THE SACRED HEART COLLEGE OF GUIMBA INC.',
    titleTop: 'ROOTED IN FAITH',
    titleBottom: 'GROUNDED IN EXCELLENCE',
    description: 'Guided by the Oneness of Heart of Jesus and Mary, OLSHCO provides holistic, values-centered education that nurtures faith, develops excellence, and prepares learners to serve, lead, and contribute to a sustainable future.',
    phoneNumber: '(044) 958-0000',
    ctaLabel: 'ENROLL NOW',
    quickFeatures: ['K-12 and College Programs', 'ESC and Voucher Accepted', 'Faith-Centered Community'],
    image: '',
    intervalSeconds: 4,
    slides: [
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
    ],
  },
  pvmo: {
    badge: 'OUR FOUNDATIONS',
    title: 'Philosophy, Vision, Mission & Core Values',
    description: 'The guiding principles and spiritual cornerstone that define our commitment to holistic Christian education at OLSHCO.',
    philosophy: 'OLSHCO believes in holistic education that nurtures the mind, touches the heart, and forms learners rooted in faith, compassion, and service.',
    philosophyKicker: 'WHOLE PERSON.\nBRIGHTER TOMORROWS.',
    philosophyScript: 'Mind Heart Faith Service',
    philosophyImage: '/images/pvmo-statue.jpg',
    vision: 'A premier Catholic academic community recognized for transformative education, spiritual depth, and ethical leadership in service of God, country, and society.',
    visionKicker: 'A BRIGHTER TOMORROW',
    mission: 'To provide quality, accessible, and faith-centered education that empowers learners with competence, character, and commitment to community.',
    missionKicker: 'PEOPLE WITH PURPOSE',
    coreValuesTagline: 'ROOTED IN FAITH.\nLIVING THE VALUES.',
    coreValues: [
      { title: 'Faith', description: "Anchored in God's love" },
      { title: 'Excellence', description: 'Striving for the best' },
      { title: 'Leadership', description: 'Empowering for change' },
      { title: 'Service', description: 'A heart for others' },
    ],
    watermarkText: 'EDUCATION\nIN FAITH\nFOR A MORE\nHUMAN WORLD',
    scriptText: 'Faith\nForms\nBrighter\nTomorrows',
    footerMark: 'OUR LADY OF THE SACRED HEART COLLEGE',
    footerSub: 'Faith · Formation · A Brighter Tomorrow',
  },
  about: {
    badge: 'About OLSHCO',
    historyOverview: 'Our Lady of the Sacred Heart College began with a simple mission: to form learners through faith, knowledge, and service. From its beginnings in the community to its continuing growth from preschool to college, OLSHCO remains committed to nurturing compassionate leaders and building a brighter tomorrow.',
    hymn: { title: 'OLSHCO School Hymn', lyrics: '', musicUrl: '' },
    title: 'A school community where every learner is known, formed, and inspired to serve.',
    description: 'Our Lady of the Sacred Heart College is a Catholic institution offering a connected education journey from preschool to college. OLSHCO brings together strong academics, spiritual formation, character development, and a caring community.',
    image: '',
    cardTopEyebrow: 'Faith',
    cardTopTitle: 'Forms Brighter\nFutures',
    cardBottomEyebrow: 'A Community',
    cardBottomTitle: 'for Life',
    features: [
      { title: 'Preschool to College', description: 'A seamless learning journey' },
      { title: 'Faith and Values Formation', description: 'Rooted in a greater purpose' },
      { title: 'Academic Excellence', description: 'Nurturing every potential' },
      { title: 'Leadership and Service', description: 'For a kinder, brighter world' },
    ],
    impact: [
      { mark: '1', title: 'Community', description: 'United in Faith' },
      { mark: 'M', title: 'Many Learners', description: 'Brighter Tomorrows' },
      { mark: 'A', title: 'Lasting Impact', description: 'Beyond the Classroom' },
    ],
    actionLabel: 'Discover OLSHCO',
    actionLink: '/about',
    taglineRule: 'Faith • Learning • Service • Community',
    footerMark: 'OUR LADY OF THE SACRED HEART COLLEGE',
  },
  facultyStaff: {
    entries: [],
    departments: [],
  },
  academics: {
    badge: 'Academics',
    title: 'Academic Programs',
    description: 'A complete Catholic education journey from preschool to college, developing the whole person — intellectually, spiritually, and socially.',
    ibed: {
      kicker: 'IBED',
      title: 'Integrated Basic Education Department',
      description: 'Preschool, elementary, junior high, and senior high school programs.',
      programs: [
        { level: 'Early Childhood', title: 'Preschool', description: 'A joyful first step into learning where children build confidence, curiosity, and faith through play, discovery, and caring guidance.', link: '#admissions', features: ['Play-Based Learning', 'Early Literacy & Numeracy', 'Values Formation', 'Creative Arts & Movement'] },
        { level: 'Basic Education', title: 'Elementary', description: 'A strong foundation in literacy, numeracy, science, and values through an engaging, child-centered curriculum grounded in Catholic principles.', link: '#admissions', features: ['K-12 Curriculum', 'Values Formation', 'Arts & Music Programs', 'Science & Technology Integration'] },
        { level: 'Secondary Education', title: 'Junior High School', description: 'Preparing students for the challenges ahead with a rigorous academic program balanced with co-curricular activities and spiritual formation.', link: '#admissions', features: ['STEM-Focused Learning', 'Sports & Athletics', 'Student Leadership', 'Community Service Programs'] },
        { level: 'Senior Secondary', title: 'Senior High School', description: 'Specialized academic tracks designed to prepare students for higher education and future careers, with guidance and mentorship every step of the way.', link: '#admissions', features: ['STEM Track', 'ABM Track', 'HUMSS Track', 'Work Immersion Program'] },
      ],
    },
    college: {
      kicker: 'COLLEGE',
      title: 'College Department',
      description: 'College departments and programs preparing students for purposeful careers and service.',
      programs: [
        { level: 'College Department', title: 'IT Department', description: 'Technology-focused learning that equips students with practical skills for the digital world and the future of work.', link: '#admissions', features: ['Information Technology', 'Systems Development', 'Digital Innovation', 'Industry Preparation'] },
        { level: 'College Department', title: 'OAD Department', description: 'Formation and development programs that support student growth, leadership, and meaningful service to the community.', link: '#admissions', features: ['Student Formation', 'Leadership Programs', 'Campus Activities', 'Community Engagement'] },
        { level: 'College Program', title: 'Teacher Education Program', description: 'A values-centered teacher preparation program forming competent, compassionate, and future-ready educators.', link: '#admissions', features: ['Professional Education', 'Practice Teaching', 'Licensure Preparation', 'Classroom Leadership'] },
        { level: 'College Program', title: 'Hospitality Management', description: 'A service-centered program developing confident hospitality professionals ready to welcome, lead, and serve with excellence.', link: '#admissions', features: ['Guest Experience', 'Food & Beverage Service', 'Events Management', 'Industry Practicum'] },
        { level: 'College Program', title: 'Criminology', description: 'A disciplined, service-driven program preparing future public safety professionals through justice, leadership, and community responsibility.', link: '#admissions', features: ['Criminal Justice', 'Forensic Foundations', 'Public Safety', 'Field Practicum'] },
      ],
    },
  },
  admissions: {
    badge: 'Admissions',
    title: 'How to Enroll',
    description: 'Begin your journey with OLSHCO. Our simple four-step process will guide you from inquiry to enrollment.',
    spotlightEyebrow: 'YOUR NEXT CHAPTER',
    spotlightTitle: 'Start your OLSHCO journey.',
    spotlightDescription: 'A simple, personal path from your first inquiry to becoming part of our faith-filled school community.',
    spotlightButton: 'Contact Admissions Office',
    steps: [
      { title: 'Inquiry & Campus Visit', description: "Reach out to our admissions office or visit the campus to learn about OLSHCO's programs, community, and Catholic formation approach." },
      { title: 'Submit Application', description: 'Complete the online application form and submit the required documents including your birth certificate, report card, and baptismal certificate.' },
      { title: 'Entrance Assessment', description: 'Take the entrance examination and participate in a brief interview. We evaluate readiness, potential, and alignment with our school values.' },
      { title: 'Admission & Enrollment', description: 'Receive your acceptance notification and complete the enrollment process — secure your slot, attend orientation, and join the OLSHCO family!' },
    ],
  },
  services: {
    badge: 'CAMPUS OFFICES',
    title: 'Office Services',
    description: 'Get to know the offices that support our school community.',
    offices: [],
  },
  contact: {
    badge: 'Get in Touch',
    title: 'Contact Us',
    description: "Have questions? We'd love to hear from you. Reach out and our team will respond promptly.",
    introTitle: "Let's Connect",
    introDescription: "Whether you're a prospective student, parent, or community member, we're here to help. Visit our campus or get in touch through any of the channels below.",
    details: [
      { label: 'Address', value: 'OLSHCO Campus, Sacred Heart Avenue, City', icon: 'pin' },
      { label: 'Phone', value: '(02) 8888-OLSH', icon: 'phone' },
      { label: 'Email', value: 'admissions@olshco.edu.ph', icon: 'mail' },
      { label: 'Office Hours', value: 'Mon–Fri, 8:00 AM – 5:00 PM', icon: 'clock' },
    ],
    formTitle: 'Send Us a Message',
    formDescription: 'Fill out the form below and our team will get back to you as soon as possible.',
    responseNote: 'We typically respond within 1–2 business days.',
  },
  footer: {
    description: 'Our Lady of the Sacred Heart College - nurturing faith, inspiring excellence, and building a compassionate community.',
  },
};

export function mergeHomepageContent(saved = {}) {
  if (!saved || typeof saved !== 'object') return DEFAULT_HOMEPAGE_CONTENT;
  const merge = (base, override) => {
    if (Array.isArray(base)) {
      if (!Array.isArray(override)) return base;
      return override.map((item, index) => (item && typeof item === 'object' && base[index] && typeof base[index] === 'object' ? { ...merge(base[index], item), ...item } : item));
    }
    if (base && typeof base === 'object') {
      return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, merge(value, override?.[key])]));
    }
    return override ?? base;
  };
  const merged = merge(DEFAULT_HOMEPAGE_CONTENT, saved);

  // The About call-to-action always opens the About page. Older saved content may
  // have pointed this button at a social link.
  merged.about.actionLink = '/about';

  // Preserve and normalize hero slides if provided in saved content
  if (Array.isArray(saved?.hero?.slides) && saved.hero.slides.length > 0) {
    merged.hero.slides = saved.hero.slides.map((s, idx) => ({
      id: s.id || `slide-${idx + 1}`,
      image: s.image || '',
      titleTop: s.titleTop || '',
      titleBottom: s.titleBottom || '',
      description: s.description || '',
      badgeTitle: s.badgeTitle || '',
      badgeSub: s.badgeSub || '',
      ctaLabel: s.ctaLabel || '',
      ctaLink: s.ctaLink || '',
    }));
  }
  if (saved?.hero?.intervalSeconds !== undefined) {
    merged.hero.intervalSeconds = Number(saved.hero.intervalSeconds) || 4;
  }

  ['ibed', 'college'].forEach((group) => {
    (merged.academics?.[group]?.programs || []).forEach((program) => {
      if (typeof program.image !== 'string') program.image = '';
      if (typeof program.link !== 'string') program.link = '#admissions';
    });
  });
  return merged;
}
