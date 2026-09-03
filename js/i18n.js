// Client-side i18n. The HTML is authored in English; French is applied from
// /locales/fr.json when the browser (or the switcher) asks for it.
const translations = {};
let currentLang = 'en';
// Bump when a locale file changes so browsers do not serve a stale copy.
const LOCALE_VERSION = '2026-09-03';

async function loadTranslations() {
  try {
    const [en, fr] = await Promise.all([
      fetch('/locales/en.json?v=' + LOCALE_VERSION).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
      fetch('/locales/fr.json?v=' + LOCALE_VERSION).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    ]);
    translations.en = en;
    translations.fr = fr;
  } catch (error) {
    console.error('Could not load translation files:', error);
  }
}

function translatePage() {
  if (!translations[currentLang]) return;
  const dict = translations[currentLang];

  document.querySelectorAll('[data-i18n-key]').forEach(element => {
    const key = element.getAttribute('data-i18n-key');
    const translation = dict[key];
    if (translation !== undefined) {
      element.innerHTML = translation;
    } else {
      console.warn(`No translation found for key: ${key}`);
    }
  });

  // Attributes: data-i18n-attr="placeholder:key_a;aria-label:key_b"
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    element.getAttribute('data-i18n-attr').split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      if (attr && key && dict[key] !== undefined) element.setAttribute(attr, dict[key]);
    });
  });

  const page = document.body.getAttribute('data-page') || '';
  const titleKey = page ? `title_${page}` : 'title';
  const descKey = page ? `meta_description_${page}` : 'meta_description';
  if (dict[titleKey]) document.title = dict[titleKey];
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && dict[descKey]) metaDescription.setAttribute('content', dict[descKey]);
}

function setLanguage(lang) {
  if (!['en', 'fr'].includes(lang)) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  translatePage();
  const en = document.getElementById('lang-en');
  const fr = document.getElementById('lang-fr');
  if (en) en.classList.toggle('active', lang === 'en');
  if (fr) fr.classList.toggle('active', lang === 'fr');
  try { localStorage.setItem('linto-lang', lang); } catch (e) {}
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem('linto-lang');
    if (saved === 'en' || saved === 'fr') return saved;
  } catch (e) {}
  const browserLang = (navigator.language || 'en').split('-')[0];
  return ['en', 'fr'].includes(browserLang) ? browserLang : 'en';
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadTranslations();
  setLanguage(getInitialLanguage());
  const en = document.getElementById('lang-en');
  const fr = document.getElementById('lang-fr');
  if (en) en.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
  if (fr) fr.addEventListener('click', (e) => { e.preventDefault(); setLanguage('fr'); });
});
