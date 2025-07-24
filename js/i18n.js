const translations = {};
let currentLang = 'en';

async function loadTranslations() {
  try {
    const enResponse = await fetch('locales/en.json');
    if (!enResponse.ok) {
      throw new Error(`HTTP error! status: ${enResponse.status}`);
    }
    translations.en = await enResponse.json();

    const frResponse = await fetch('locales/fr.json');
    if (!frResponse.ok) {
      throw new Error(`HTTP error! status: ${frResponse.status}`);
    }
    translations.fr = await frResponse.json();
  } catch (error) {
    console.error("Could not load translation files:", error);
  }
}

function translatePage() {
  if (!translations[currentLang]) {
    console.error(`Translations for language "${currentLang}" not loaded.`);
    return;
  }

  document.querySelectorAll('[data-i18n-key]').forEach(element => {
    const key = element.getAttribute('data-i18n-key');
    const translation = translations[currentLang][key];
    if (translation !== undefined) {
      element.innerHTML = translation;
    } else {
      console.warn(`No translation found for key: ${key}`);
    }
  });

  if (translations[currentLang].title) {
    document.title = translations[currentLang].title;
  }
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && translations[currentLang].meta_description) {
    metaDescription.setAttribute('content', translations[currentLang].meta_description);
  }
}

function setLanguage(lang) {
  if (['en', 'fr'].includes(lang)) {
    currentLang = lang;
    document.documentElement.lang = lang;
    translatePage();
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-fr').classList.toggle('active', lang === 'fr');
  } else {
    console.warn(`Language "${lang}" is not supported.`);
  }
}

function getInitialLanguage() {
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'fr'].includes(browserLang) ? browserLang : 'en';
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadTranslations();
  const initialLang = getInitialLanguage();
  setLanguage(initialLang);

  document.getElementById('lang-en').addEventListener('click', (e) => {
    e.preventDefault();
    setLanguage('en');
  });
  document.getElementById('lang-fr').addEventListener('click', (e) => {
    e.preventDefault();
    setLanguage('fr');
  });
});
