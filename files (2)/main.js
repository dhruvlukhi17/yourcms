/* ============================================================
   PHOTOGRAPHY PORTFOLIO — main.js
   Loads content from _data/*.json (managed by Decap CMS)
   Falls back to defaults when JSON files aren't present yet.
   ============================================================ */

'use strict';

/* ——————————————————————————————————————————————
   DEFAULT DATA
   Used as fallback before CMS content is set up.
   Replace these with your own details via /admin
—————————————————————————————————————————————— */
const DEFAULT_SETTINGS = {
  title:          'Aryan Sharma',
  hero_subtitle:  'Landscape · Portrait · Travel',
  about:          'I am a photographer drawn to the quiet tension between the built world and the wild one — a city in fog, a mountain face at first light, the split second before something changes. Each photograph is a small act of attention: slowing down long enough to notice what is already there. Based between Delhi and the Himalayas, I shoot for editorial clients, conservation organisations, and private collectors who care about images that last.',
  email:          'hello@aryan.photo',
  instagram:      'https://instagram.com',
  hero_image:     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85&auto=format&fit=crop',
};

const DEFAULT_PORTFOLIO = [
  {
    title:    'Mountain Dawn',
    category: 'Landscape',
    image:    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80&auto=format&fit=crop',
    location: 'Rocky Mountains, Colorado',
    aperture: 'f/8',
    shutter:  '1/250s',
    iso:      'ISO 200',
    description: 'First light breaking over the eastern ridge — captured at 5:30 am after a four-hour approach hike through the dark.',
    size: 'wide',
  },
  {
    title:    'Into the Forest',
    category: 'Landscape',
    image:    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80&auto=format&fit=crop',
    location: 'Black Forest, Germany',
    aperture: 'f/4',
    shutter:  '1/60s',
    iso:      'ISO 800',
    description: 'Fog-laden silence between ancient pines on a November morning.',
    size: 'tall',
  },
  {
    title:    'Pacific Horizon',
    category: 'Landscape',
    image:    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80&auto=format&fit=crop',
    location: 'Big Sur, California',
    aperture: 'f/11',
    shutter:  '1/500s',
    iso:      'ISO 100',
    description: '',
    size: 'normal',
  },
  {
    title:    'Desert Light',
    category: 'Travel',
    image:    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1400&q=80&auto=format&fit=crop',
    location: 'Sahara Desert, Morocco',
    aperture: 'f/5.6',
    shutter:  '1/1000s',
    iso:      'ISO 400',
    description: 'The hour before sunset when the dunes cast long blue shadows across the sand.',
    size: 'large',
  },
  {
    title:    'Still Lake',
    category: 'Landscape',
    image:    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80&auto=format&fit=crop',
    location: 'Banff National Park, Canada',
    aperture: 'f/10',
    shutter:  '1/125s',
    iso:      'ISO 100',
    description: '',
    size: 'normal',
  },
  {
    title:    'City After Rain',
    category: 'Street',
    image:    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80&auto=format&fit=crop',
    location: 'New York, USA',
    aperture: 'f/2.0',
    shutter:  '1/30s',
    iso:      'ISO 3200',
    description: 'Reflections on wet asphalt — 2 am, Manhattan.',
    size: 'wide',
  },
  {
    title:    'Volcanic Coast',
    category: 'Landscape',
    image:    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80&auto=format&fit=crop',
    location: 'Iceland',
    aperture: 'f/9',
    shutter:  '1/200s',
    iso:      'ISO 200',
    description: '',
    size: 'normal',
  },
  {
    title:    'Winter Pass',
    category: 'Travel',
    image:    'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1200&q=80&auto=format&fit=crop',
    location: 'Swiss Alps',
    aperture: 'f/8',
    shutter:  '1/320s',
    iso:      'ISO 100',
    description: 'Mid-January. Wind chill −28 °C. Summit reached at noon.',
    size: 'tall',
  },
];

/* ——————————————————————————————————————————————
   STATE
—————————————————————————————————————————————— */
let settings       = {};
let portfolio      = [];
let filteredItems  = [];
let currentIndex   = 0;
let activeFilter   = 'all';
let lightboxOpen   = false;

/* ——————————————————————————————————————————————
   BOOT
—————————————————————————————————————————————— */
document.addEventListener('DOMContentLoaded', init);

async function init() {
  await Promise.all([loadSettings(), loadPortfolio()]);
  applySettings();
  buildGallery();
  setupNav();
  setupMobileMenu();
  setupLightbox();
}

/* ——————————————————————————————————————————————
   DATA LOADING
   Tries to fetch CMS JSON files; uses defaults on
   failure so the page works before CMS is set up.
—————————————————————————————————————————————— */
async function loadSettings() {
  try {
    const res = await fetch('_data/settings.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Settings not found');
    settings = await res.json();
  } catch {
    settings = { ...DEFAULT_SETTINGS };
  }
}

async function loadPortfolio() {
  try {
    const res = await fetch('_data/portfolio.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Portfolio not found');
    const data = await res.json();
    portfolio = Array.isArray(data.items) ? data.items : [];
    if (portfolio.length === 0) throw new Error('Empty portfolio');
  } catch {
    portfolio = DEFAULT_PORTFOLIO;
  }
}

/* ——————————————————————————————————————————————
   APPLY SETTINGS TO THE PAGE
—————————————————————————————————————————————— */
function applySettings() {
  const s = settings;

  // <title>
  document.title = s.title ? `${s.title} — Photography` : 'Photography Portfolio';
  setText('page-title', document.title);

  // Nav logo
  setText('nav-title', s.title || 'Portfolio');

  // Hero
  const bg = document.getElementById('hero-bg');
  if (s.hero_image) {
    bg.style.backgroundImage = `url('${s.hero_image}')`;
    setTimeout(() => bg.classList.add('loaded'), 80);
  }
  document.getElementById('hero-title').innerHTML = formatName(s.title || 'Photography');
  setText('hero-subtitle', s.hero_subtitle || '');

  // About
  setText('about-body', s.about || '');
  setText('stat-photos', portfolio.length);

  // Contact
  const emailEl = document.getElementById('contact-email');
  const igEl    = document.getElementById('contact-instagram');
  if (s.email) {
    emailEl.href        = `mailto:${s.email}`;
    emailEl.textContent = s.email;
  }
  if (s.instagram) {
    igEl.href        = s.instagram;
    igEl.textContent = 'Instagram ↗';
    igEl.target      = '_blank';
    igEl.rel         = 'noopener noreferrer';
  }

  // Footer
  const year = new Date().getFullYear();
  setText('footer-copy', `© ${year} ${s.title || 'Photography Portfolio'}`);
}

/* Split last name into <em> for display in hero */
function formatName(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const last  = parts.pop();
  return `${parts.join(' ')}<br><em>${last}</em>`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ——————————————————————————————————————————————
   GALLERY — BUILD + FILTER
—————————————————————————————————————————————— */
function buildGallery() {
  filteredItems = activeFilter === 'all'
    ? portfolio
    : portfolio.filter(p => p.category === activeFilter);

  renderFilters();
  renderGrid();
}

function renderFilters() {
  const categories = ['all', ...new Set(portfolio.map(p => p.category).filter(Boolean))];
  const filtersEl  = document.getElementById('filters');
  filtersEl.innerHTML = '';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className          = `filter-btn${activeFilter === cat ? ' active' : ''}`;
    btn.dataset.filter     = cat;
    btn.textContent        = cat === 'all' ? 'All' : cat;
    btn.setAttribute('aria-pressed', activeFilter === cat ? 'true' : 'false');
    btn.addEventListener('click', () => {
      activeFilter = cat;
      buildGallery();
    });
    filtersEl.appendChild(btn);
  });
}

const SIZE_PATTERN = ['normal', 'wide', 'tall', 'normal', 'large', 'normal', 'normal', 'tall'];

function renderGrid() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  filteredItems.forEach((item, i) => {
    const size      = item.size || SIZE_PATTERN[i % SIZE_PATTERN.length];
    const sizeClass = size !== 'normal' ? ` gallery-item--${size}` : '';

    const el = document.createElement('article');
    el.className  = `gallery-item${sizeClass}`;
    el.tabIndex   = 0;
    el.role       = 'listitem';
    el.setAttribute('aria-label', `${item.title} — ${item.category}`);

    el.innerHTML = `
      <img
        class="gallery-item__img"
        src="${item.image}"
        alt="${item.title}"
        loading="lazy"
      >
      <div class="gallery-item__meta" aria-hidden="true">
        <p class="gallery-item__cat">${item.category || ''}</p>
        <h3 class="gallery-item__name">${item.title}</h3>
        <div class="gallery-item__exif">
          ${exifTag('ƒ', item.aperture)}
          ${exifTag('S', item.shutter)}
          ${exifTag('ISO', item.iso)}
        </div>
      </div>
    `;

    el.addEventListener('click', ()  => openLightbox(i));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } });

    grid.appendChild(el);
  });
}

function exifTag(label, value) {
  if (!value) return '';
  return `<span class="exif-tag"><span class="exif-tag__key">${label}</span>${value}</span>`;
}

/* ——————————————————————————————————————————————
   LIGHTBOX
—————————————————————————————————————————————— */
function setupLightbox() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', prevPhoto);
  document.getElementById('lightbox-next').addEventListener('click', nextPhoto);
  document.getElementById('lightbox-backdrop').addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  nextPhoto();
    if (e.key === 'ArrowLeft')   prevPhoto();
  });
}

function openLightbox(index) {
  currentIndex = index;
  lightboxOpen = true;
  document.getElementById('lightbox').classList.add('open');
  document.getElementById('lightbox-backdrop').classList.add('open');
  document.getElementById('lightbox').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  populateLightbox();
}

function closeLightbox() {
  lightboxOpen = false;
  document.getElementById('lightbox').classList.remove('open');
  document.getElementById('lightbox-backdrop').classList.remove('open');
  document.getElementById('lightbox').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function nextPhoto() {
  currentIndex = (currentIndex + 1) % filteredItems.length;
  populateLightbox();
}

function prevPhoto() {
  currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
  populateLightbox();
}

function populateLightbox() {
  const item = filteredItems[currentIndex];
  if (!item) return;

  const img = document.getElementById('lightbox-img');
  img.src = item.image;
  img.alt = item.title;

  setText('lightbox-cat',   item.category || '');
  setText('lightbox-title', item.title    || '');
  setText('lightbox-loc',   item.location || '');
  setText('lightbox-desc',  item.description || '');
  setText('lightbox-counter', `${currentIndex + 1} / ${filteredItems.length}`);

  // EXIF rows
  const exifEl = document.getElementById('lightbox-exif');
  const rows   = [
    item.aperture && ['Aperture',  item.aperture],
    item.shutter  && ['Shutter',   item.shutter],
    item.iso      && ['ISO',       item.iso],
    item.location && ['Location',  item.location],
  ].filter(Boolean);

  exifEl.innerHTML = rows.length
    ? rows.map(([k, v]) => `
        <div class="lightbox__exif-row">
          <span>${k}</span><span>${v}</span>
        </div>`).join('')
    : '';
}

/* ——————————————————————————————————————————————
   NAVIGATION — scroll behaviour
—————————————————————————————————————————————— */
function setupNav() {
  const nav = document.getElementById('navbar');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ——————————————————————————————————————————————
   MOBILE MENU
—————————————————————————————————————————————— */
function setupMobileMenu() {
  const menuBtn   = document.getElementById('menu-btn');
  const closeBtn  = document.getElementById('menu-close');
  const menu      = document.getElementById('mobile-menu');
  const links     = menu.querySelectorAll('.mobile-menu__link');

  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', () =>
    menu.classList.contains('open') ? closeMenu() : openMenu()
  );
  closeBtn.addEventListener('click', closeMenu);
  links.forEach(l => l.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}
