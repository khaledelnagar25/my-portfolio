// ============================
// Theme toggle (dark / light)
// ============================
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;

function applyTheme(theme) {
  rootEl.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = rootEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ============================
// Language toggle (EN / AR)
// ============================
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
const translatable = document.querySelectorAll('[data-en][data-ar]');

function applyLang(lang) {
  rootEl.setAttribute('lang', lang);
  rootEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // Process deepest elements first so a parent's textContent update
  // doesn't wipe out a translated child (e.g. project-link + its span).
  const sorted = Array.from(translatable).sort((a, b) => {
    return b.querySelectorAll('*').length - a.querySelectorAll('*').length;
  });

  sorted.forEach(el => {
    const value = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    const childTranslatables = el.querySelectorAll('[data-en][data-ar]');

    if (childTranslatables.length > 0) {
      // Only replace this element's own leading text node, leave children intact.
      const firstNode = el.childNodes[0];
      if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
        firstNode.textContent = value + ' ';
      }
    } else {
      el.textContent = value;
    }
  });

  if (langLabel) langLabel.textContent = lang === 'ar' ? 'EN' : 'AR';
  localStorage.setItem('lang', lang);
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    const current = rootEl.getAttribute('lang') === 'ar' ? 'ar' : 'en';
    applyLang(current === 'en' ? 'ar' : 'en');
  });
}

// Restore saved language on load
(function initLang() {
  const savedLang = localStorage.getItem('lang');
  if (savedLang) applyLang(savedLang);
})();

// ============================
// Mobile nav toggle
// ============================
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked (mobile)
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================
// Scroll reveal (single, restrained pass)
// ============================
const revealTargets = document.querySelectorAll(
  '.section-title, .timeline-item, .skill-group, .service-card, .project-card, .achievement-item'
);

if ('IntersectionObserver' in window && revealTargets.length) {
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));
}

// ============================
// Contact form (front-end only — no backend wired up)
// ============================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      formStatus.textContent = 'Please fill in all fields with a valid email.';
      return;
    }

    // NOTE: This form has no backend connected yet.
    // Wire it up to a service like Formspree, EmailJS, or your own API endpoint.
    formStatus.textContent = 'Thanks! This form isn\u2019t connected to an inbox yet — please email me directly for now.';
    contactForm.reset();
  });
}

// ============================
// Footer year
// ============================
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
