'use strict';

const CATEGORIES = [
  {
    id: 'hybrid',
    label: 'Hybrid / Commuter',
    icon: '🚲',
    sizes: [
      { maxInches: 61, size: 'XS', ctc: '13–15"', ctcCm: '33–38 cm', note: 'Compact and nimble — great for getting around town.' },
      { maxInches: 65, size: 'S',  ctc: '15–17"', ctcCm: '38–43 cm', note: 'Agile and easy to handle in traffic.' },
      { maxInches: 69, size: 'M',  ctc: '17–19"', ctcCm: '43–48 cm', note: 'Right in the sweet spot — most riders land here.' },
      { maxInches: 72, size: 'L',  ctc: '19–21"', ctcCm: '48–53 cm', note: 'Long legs, long reach — a natural fit.' },
      { maxInches: Infinity, size: 'XL', ctc: '21"+', ctcCm: '53+ cm', note: 'Built for tall riders who want room to breathe.' },
    ],
  },
  {
    id: 'mtb',
    label: 'Mountain Bike',
    icon: '🏔️',
    sizes: [
      { maxInches: 61, size: 'XS', ctc: '13–14"', ctcCm: '33–35 cm', note: 'Low and tight — easy to throw around the trail.' },
      { maxInches: 65, size: 'S',  ctc: '15–16"', ctcCm: '38–41 cm', note: 'Quick handling on tight singletrack.' },
      { maxInches: 69, size: 'M',  ctc: '17–18"', ctcCm: '43–46 cm', note: 'The most versatile size on the trail.' },
      { maxInches: 73, size: 'L',  ctc: '19–20"', ctcCm: '48–51 cm', note: 'Great stability at speed.' },
      { maxInches: Infinity, size: 'XL', ctc: '21–22"', ctcCm: '53–56 cm', note: 'Big bike, big trails, big fun.' },
    ],
  },
  {
    id: 'road',
    label: 'Road Bike',
    icon: '🚴',
    sizes: [
      { maxInches: 62, size: 'XS', ctc: '47–49 cm', ctcCm: '47–49 cm', note: 'Lightweight and quick off the line.' },
      { maxInches: 65, size: 'S',  ctc: '50–52 cm', ctcCm: '50–52 cm', note: 'Snappy and efficient on the road.' },
      { maxInches: 68, size: 'M',  ctc: '53–55 cm', ctcCm: '53–55 cm', note: 'Where most recreational riders end up.' },
      { maxInches: 72, size: 'L',  ctc: '56–58 cm', ctcCm: '56–58 cm', note: 'A longer top tube for an aggressive tuck.' },
      { maxInches: Infinity, size: 'XL', ctc: '59–61 cm', ctcCm: '59–61 cm', note: 'Full reach for tall riders, no compromises.' },
    ],
  },
  {
    id: 'gravel',
    label: 'Gravel / CX',
    icon: '🌾',
    sizes: [
      { maxInches: 62, size: 'XS', ctc: '47–49 cm', ctcCm: '47–49 cm', note: 'Tight and responsive on loose surfaces.' },
      { maxInches: 65, size: 'S',  ctc: '50–52 cm', ctcCm: '50–52 cm', note: 'A versatile all-rounder for mixed terrain.' },
      { maxInches: 68, size: 'M',  ctc: '53–55 cm', ctcCm: '53–55 cm', note: 'Comfortable on long adventure days.' },
      { maxInches: 72, size: 'L',  ctc: '56–58 cm', ctcCm: '56–58 cm', note: 'More clearance, more tyre options.' },
      { maxInches: Infinity, size: 'XL', ctc: '59–61 cm', ctcCm: '59–61 cm', note: 'Room for all the bags and gadgets.' },
    ],
  },
  {
    id: 'bmx',
    label: 'BMX',
    icon: '🔥',
    sizes: [
      { maxInches: 63, size: 'Expert',   ctc: '18.5–19.5"', ctcCm: '47–50 cm', note: 'Nimble and snappy for smaller riders.' },
      { maxInches: 67, size: 'Pro',      ctc: '20–20.5"',   ctcCm: '51–52 cm', note: 'The most popular BMX size worldwide.' },
      { maxInches: 71, size: 'Pro XL',   ctc: '20.5–21"',   ctcCm: '52–53 cm', note: 'A touch more room without losing feel.' },
      { maxInches: Infinity, size: 'Pro XXL', ctc: '21"+',  ctcCm: '53+ cm',   note: 'For tall riders who still love to shred.' },
    ],
  },
];

const SIZE_COLORS = {
  'XS':      '#06b6d4',
  'S':       '#10b981',
  'M':       '#f97316',
  'L':       '#ef4444',
  'XL':      '#a855f7',
  'Expert':  '#06b6d4',
  'Pro':     '#10b981',
  'Pro XL':  '#f97316',
  'Pro XXL': '#a855f7',
};

const MIN_INCHES = 54;
const MAX_INCHES = 80;
let currentUnit    = 'imperial';
let currentHeight  = 67;
let hasInteracted  = false;

const slider           = document.getElementById('height-slider');
const primaryDisplay   = document.getElementById('height-primary');
const secondaryDisplay = document.getElementById('height-secondary');
const resultsGrid      = document.getElementById('results-grid');
const resultsIntro     = document.getElementById('results-intro');
const emptyState       = document.getElementById('empty-state');
const toggleImperial   = document.getElementById('toggle-imperial');
const toggleMetric     = document.getElementById('toggle-metric');
const labelMin         = document.getElementById('slider-label-min');
const labelMax         = document.getElementById('slider-label-max');
const brandInput       = document.getElementById('brand-input');
const brandBtn         = document.getElementById('brand-btn');
const brandNote        = document.getElementById('brand-note');

function feetInches(totalInches) {
  const ft  = Math.floor(totalInches / 12);
  const inc = totalInches % 12;
  return `${ft}′${inc}″`;
}

function toCm(totalInches) {
  return Math.round(totalInches * 2.54);
}

function updateDisplay() {
  if (currentUnit === 'imperial') {
    primaryDisplay.textContent    = feetInches(currentHeight);
    secondaryDisplay.textContent  = `(${toCm(currentHeight)} cm)`;
    labelMin.textContent = feetInches(MIN_INCHES);
    labelMax.textContent = feetInches(MAX_INCHES);
  } else {
    primaryDisplay.textContent    = `${toCm(currentHeight)} cm`;
    secondaryDisplay.textContent  = `(${feetInches(currentHeight)})`;
    labelMin.textContent = `${toCm(MIN_INCHES)} cm`;
    labelMax.textContent = `${toCm(MAX_INCHES)} cm`;
  }
}

function updateSliderFill() {
  const pct = ((currentHeight - MIN_INCHES) / (MAX_INCHES - MIN_INCHES)) * 100;
  slider.style.background =
    `linear-gradient(to right, #f97316 0%, #f97316 ${pct}%, #1e2d45 ${pct}%, #1e2d45 100%)`;
}

function getSize(heightInches, category) {
  for (const s of category.sizes) {
    if (heightInches <= s.maxInches) return s;
  }
  return category.sizes[category.sizes.length - 1];
}

function renderCards() {
  resultsGrid.innerHTML = '';
  CATEGORIES.forEach((cat, i) => {
    const s     = getSize(currentHeight, cat);
    const color = SIZE_COLORS[s.size] || '#94a3b8';
    const ctc   = currentUnit === 'imperial' ? s.ctc : s.ctcCm;

    const card = document.createElement('article');
    card.className = 'bike-card';
    card.style.cssText = `--accent:${color};animation-delay:${i * 50}ms`;
    card.innerHTML = `
      <div class="card-header">
        <span class="card-icon">${cat.icon}</span>
        <span class="card-label">${cat.label}</span>
      </div>
      <div class="card-size-badge" style="color:${color}">${s.size}</div>
      <div class="card-ctc">
        <span class="ctc-label">Frame size</span>
        <span class="ctc-value">${ctc}</span>
      </div>
      <p class="card-note">${s.note}</p>
    `;
    resultsGrid.appendChild(card);
  });
}

let debounceTimer;
slider.addEventListener('input', () => {
  currentHeight = parseInt(slider.value, 10);
  updateDisplay();
  updateSliderFill();
  if (!hasInteracted) {
    hasInteracted = true;
    emptyState.style.display = 'none';
    resultsIntro.style.display = 'block';
  }
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(renderCards, 120);
});

toggleImperial.addEventListener('click', () => {
  currentUnit = 'imperial';
  toggleImperial.classList.add('active');
  toggleMetric.classList.remove('active');
  updateDisplay();
  renderCards();
});

toggleMetric.addEventListener('click', () => {
  currentUnit = 'metric';
  toggleMetric.classList.add('active');
  toggleImperial.classList.remove('active');
  updateDisplay();
  renderCards();
});

brandBtn.addEventListener('click', () => {
  const brand = brandInput.value.trim();
  if (!brand) return;
  brandNote.innerHTML =
    `<strong>${brand}</strong> may use its own geometry. These ranges are a great starting point — then check ${brand}’s official size guide for your exact model.`;
  brandNote.style.display = 'block';
});

brandInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') brandBtn.click();
});

updateDisplay();
updateSliderFill();

// Install banner
(function () {
  const banner   = document.getElementById('install-banner');
  const sub      = document.getElementById('install-banner-sub');
  const btn      = document.getElementById('install-btn');
  const dismiss  = document.getElementById('install-dismiss');

  if (!banner) return;
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) return;
  if (sessionStorage.getItem('install-dismissed')) return;

  const isIOS     = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    sub.textContent = 'Works offline, lives on your home screen.';
    banner.style.display = 'flex';
  });

  if (isIOS) {
    sub.textContent = 'Tap Share then "Add to Home Screen".';
    banner.style.display = 'flex';
    btn.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => { deferredPrompt = null; banner.style.display = 'none'; });
    }
  });

  dismiss.addEventListener('click', () => {
    banner.style.display = 'none';
    sessionStorage.setItem('install-dismissed', '1');
  });
}());
