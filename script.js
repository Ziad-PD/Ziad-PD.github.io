const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
  if (!themeIcon) return;
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-sun';
    themeIcon.style.color = '#FFBD2E';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
    themeIcon.style.color = '';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const overlay = document.getElementById('themeOverlay');
    // 1. fade overlay in
    overlay.style.opacity = '1';
    setTimeout(() => {
      // 2. change theme while hidden
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
      // 3. fade overlay out — everything already changed
      setTimeout(() => { overlay.style.opacity = '0'; }, 30);
    }, 180);
  });
}

emailjs.init('jRQiSDITJdNx2Azz4');

const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card, .cert-card, .skill-tag, .filter-tab').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('expanded');
    cursorRing.classList.add('expanded');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('expanded');
    cursorRing.classList.remove('expanded');
  });
});

const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct    = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPct + '%';
}, { passive: true });

const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-nav a');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backTopBtn.classList.toggle('visible', window.scrollY > 400);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

const fadeEls = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

const typingEl = document.getElementById('typingText');
const currentLang = () => document.documentElement.lang;

const wordsEN = ['intuitive', 'scalable', 'impactful', 'elegant', 'seamless'];
const wordsAR = ['بديهي', 'قابل للتوسع', 'مؤثر', 'أنيق', 'سلس'];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const words = currentLang() === 'ar' ? wordsAR : wordsEN;
  const word  = words[wordIndex % words.length];

  if (!isDeleting) {
    typingEl.textContent = word.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === word.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
  } else {
    typingEl.textContent = word.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex++;
    }
  }
  setTimeout(typeEffect, isDeleting ? 60 : 100);
}
setTimeout(typeEffect, 1200);

const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(el) {
  const target   = +el.getAttribute('data-target');
  const suffix   = el.dataset.suffix || '+';
  const duration = 1800;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

const filterTabs    = document.querySelectorAll('.filter-tab');
const projectCards  = document.querySelectorAll('.project-card');
const projectsGrid  = document.getElementById('projectsGrid');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = filter === 'all' || cat === filter;
      card.style.opacity    = show ? '1' : '0';
      card.style.transform  = show ? 'scale(1)'   : 'scale(0.95)';
      card.style.pointerEvents = show ? 'auto' : 'none';
      card.style.position   = show ? 'relative' : 'absolute';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
  });
});

projectCards.forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxTitle   = document.getElementById('lightboxTitle');
const lightboxPdfBtn  = document.getElementById('lightboxPdfBtn');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxBdrop   = document.getElementById('lightboxBackdrop');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    lightboxImg.src     = card.getAttribute('data-cert-img');
    lightboxImg.alt     = card.getAttribute('data-cert-title');
    lightboxTitle.textContent = card.getAttribute('data-cert-title');
    lightboxPdfBtn.href = card.getAttribute('data-cert-pdf');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  });

  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

const track       = document.getElementById('carouselTrack');
const dotsWrapper = document.getElementById('carouselDots');
const prevBtn     = document.getElementById('carouselPrev') || {addEventListener: ()=>{}};
const nextBtn     = document.getElementById('carouselNext') || {addEventListener: ()=>{}};
const cards       = track ? track.querySelectorAll('.testimonial-card') : [];

let currentSlide  = 0;
let autoPlayTimer = null;

const visibleCount = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

function getCardWidth() {
  if (!track || !track.parentElement) return 300;
  const vc = visibleCount();
  const wrapperWidth = track.parentElement.offsetWidth;
  return (wrapperWidth - (24 * (vc - 1))) / vc;
}

function setCardWidths() {
  const w = getCardWidth();
  cards.forEach(function(card) {
    card.style.flex = '0 0 ' + w + 'px';
    card.style.width = w + 'px';
  });
}

function buildDots() {
  if (!dotsWrapper) return;
  dotsWrapper.innerHTML = '';
  const total = Math.ceil(cards.length / visibleCount());
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', (function(idx) {
      return function() { goTo(idx); resetAutoplay(); };
    })(i));
    dotsWrapper.appendChild(dot);
  }
}

function updateDots() {
  if (!dotsWrapper) return;
  dotsWrapper.querySelectorAll('.carousel-dot').forEach(function(dot, i) {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goTo(index) {
  if (!track) return;
  const total = Math.ceil(cards.length / visibleCount());
  currentSlide = (index + total) % total;
  const vc = visibleCount();
  const cardW = getCardWidth();
  const offset = currentSlide * (cardW + 24) * vc;
  track.style.transform = 'translateX(-' + offset + 'px)';
  updateDots();
}

function next() { goTo(currentSlide + 1); }
function prev() { goTo(currentSlide - 1); }

prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

let touchStartX = 0;
if (track) {
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAutoplay(); }
  });
}

function startAutoplay() {
  autoPlayTimer = setInterval(next, 4000);
}

function resetAutoplay() {
  clearInterval(autoPlayTimer);
  startAutoplay();
}

window.addEventListener('resize', () => {
  setCardWidths();
  buildDots();
  goTo(0);
});

setCardWidths();
buildDots();
goTo(0);
startAutoplay();

const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name     = document.getElementById('fullName').value.trim();
  const email    = document.getElementById('emailAddr').value.trim();
  const whatsapp = document.getElementById('waNumber').value.trim();
  const message  = document.getElementById('message').value.trim();

  if (!name || !email || !whatsapp || !message) return;

  submitBtn.classList.add('loading');

  try {
    await emailjs.send('service_oo1xfwa', 'template_kcanybs', {
      from_name:  name,
      from_email: email,
      whatsapp:   whatsapp,
      message:    message,
    });

    submitBtn.classList.remove('loading');
    formSuccess.classList.add('show');
    contactForm.reset();

    const waMsg = encodeURIComponent(
      `Hello Ziad! 👋\n\nMy name is ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const waUrl = `https://wa.me/201007011458?text=${waMsg}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    setTimeout(() => {
      if (isMobile) {
        window.location.href = waUrl;
      } else {
        window.open(waUrl, '_blank');
      }
    }, 800);

    setTimeout(() => formSuccess.classList.remove('show'), 6000);

  } catch (err) {
    submitBtn.classList.remove('loading');
    console.error('EmailJS error:', err);
    alert('Something went wrong. Please try again.');
  }
});

const backTopBtn = document.getElementById('backTopBtn');

backTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const langEN = document.getElementById('langEN');
const langAR = document.getElementById('langAR');

function applyLang(lang) {
  const isAR = lang === 'ar';

  document.documentElement.lang  = lang;
  document.documentElement.dir   = isAR ? 'rtl' : 'ltr';

  document.body.style.fontFamily = isAR
    ? "'Cairo', sans-serif"
    : "'DM Sans', sans-serif";

  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    const text = isAR ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else {
      el.textContent = text;
    }
  });

  if(langEN) langEN.classList.toggle('active', !isAR);
  if(langAR) langAR.classList.toggle('active', isAR);
  if(langEN) langEN.setAttribute('aria-pressed', !isAR);
  if(langAR) langAR.setAttribute('aria-pressed', isAR);

  localStorage.setItem('lang', lang);
}

if(langEN) langEN.addEventListener('click', () => applyLang('en'));
if(langAR) langAR.addEventListener('click', () => applyLang('ar'));

const savedLang = localStorage.getItem('lang') || 'en';
applyLang(savedLang);

document.getElementById('footerYear').textContent = new Date().getFullYear();