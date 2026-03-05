/* ============================================================
   SARANDA PIZZA – Main Script
   ============================================================ */

/* ── Navbar scroll effect ─────────────────────────────────── */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* ── Mobile burger menu ───────────────────────────────────── */
const burgerBtn  = document.getElementById('burger-btn');
const navMenu    = document.getElementById('nav-menu');

burgerBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burgerBtn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when a nav link is clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Menu category filtering ──────────────────────────────── */
const tabs      = document.querySelectorAll('.menu-tab');
const menuItems = document.querySelectorAll('.menu-item');

function filterMenu(category) {
  menuItems.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.removeAttribute('hidden');
      // Trigger a tiny re-paint for fade-in effect
      item.style.animation = 'none';
      requestAnimationFrame(() => {
        item.style.animation = 'fadeInUp 0.3s ease forwards';
      });
    } else {
      item.setAttribute('hidden', '');
    }
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterMenu(tab.dataset.category);
  });
});

// Inject fade-in keyframe once
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

// Show only the first category on initial load
filterMenu(tabs[0].dataset.category);

/* ── Footer year ──────────────────────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Smooth scroll for anchor links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Intersection Observer – subtle fade-in for sections ──── */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add reveal class and CSS, then observe
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

document.querySelectorAll(
  '.feature-card, .about__text, .about__img-wrap, ' +
  '.contact__info, .contact__map, .hours-banner__text, ' +
  '.hours-banner__times, .gallery-item'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  revealObserver.observe(el);
});
