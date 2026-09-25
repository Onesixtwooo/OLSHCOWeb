import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import '../css/landing.css';
import '../css/about-reference.css';
import '../css/academics-carousel.css';
import '../css/admissions-reference.css';
import '../css/contact-reference.css';
import '../css/pvmo.css';
import '../css/services.css';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
