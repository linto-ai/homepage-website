// Case studies. A card or tile with data-case="<id>" opens a <dialog> built from
// CASES below; every text comes from the locale files (keys cm_<id>_*).
(() => {
  const CASES = {
    eye2025: {
      logo: '/images/logo-ep.svg', logoAlt: 'European Parliament',
      media: [
        { type: 'image', src: '/images/cases/eye2025.jpg' },
      ],
      stats: [['9 000', 's1'], ['160', 's2'], ['24', 's3'], ['2 000+', 's4']],
      paras: 3, survey: 5, did: 4,
      source: 'https://www.linkedin.com/posts/damienlaine_accessibility-ai-opensource-activity-7345360282027753474-MnjZ',
    },
    wikimania: {
      logo: '/images/logo-wikimania.svg', logoAlt: 'Wikimania 2026', logoTall: true,
      media: [
        { type: 'image', src: '/images/cases/wikimania-hero.jpg' },
        { type: 'video', src: '/images/cases/wikimania-benjamin.mp4', poster: '/images/cases/wikimania-benjamin-poster.jpg' },
        { type: 'image', src: '/images/cases/wikimania-1.jpg' },
        { type: 'image', src: '/images/cases/wikimania-2.jpg' },
        { type: 'image', src: '/images/cases/wikimania-3.jpg' },
      ],
      stats: [['8', 's1'], ['5', 's2'], ['5', 's3']],
      paras: 2, did: 4,
      source: 'https://commons.wikimedia.org/wiki/File:Benjamin_(linagora).webm',
    },
    wrd2026: {
      media: [
        { type: 'image', src: '/images/cases/wrd26-1.jpg' },
        { type: 'image', src: '/images/cases/wrd26-2.jpg' },
        { type: 'image', src: '/images/cases/wrd26-3.jpg' },
        { type: 'image', src: '/images/cases/wrd26-4.jpg' },
      ],
      paras: 2, did: 3, quote: true,
      source: 'https://www.linkedin.com/posts/linagora_worldradioday-linto-worldradioday-ugcPost-7428106331766685696--q3J',
    },
    gpsm2025: {
      media: [
        { type: 'image', src: '/images/cases/gpsm-1.jpg' },
        { type: 'image', src: '/images/cases/gpsm-2.jpg' },
        { type: 'image', src: '/images/cases/gpsm-3.jpg' },
      ],
      stats: [['160+', 's1'], ['6', 's2'], ['2', 's3']],
      paras: 2, did: 4,
      source: 'https://www.linkedin.com/posts/damienlaine_gpsm-linto-en-pleine-action-activity-7402628783981277184-FW-5',
    },
    eonax2025: {
      media: [
        { type: 'video', src: '/images/cases/eona-x-clip.mp4', poster: '/images/cases/eona-x.jpg', loop: true },
        { type: 'image', src: '/images/cases/eona-x.jpg' },
      ],
      paras: 2, did: 3,
      source: 'https://www.linkedin.com/posts/eona-x_smartmobility-intermodalitaez-datacollaboration-ugcPost-7379530810711818241-f5Ok',
    },
    posais2026: {
      media: [
        { type: 'image', src: '/images/cases/posais26-1.jpg' },
      ],
      stats: [['800', 's1'], ['2', 's2'], ['1', 's3']],
      paras: 2, did: 3,
      source: 'https://opensourceaisummit.eu/',
    },
    prs2026: {
      media: [
        { type: 'image', src: '/images/cases/prs26-1.jpg' },
      ],
      stats: [['7 000', 's1'], ['100', 's2'], ['2', 's3']],
      paras: 2, did: 3,
      source: 'https://linagora.com/linagora-au-paris-radio-show-2026',
    },
    sofins2023: {
      label: 'SOFINS', year: '2023',
      media: [],
      stats: [['16 M', 's1'], ['53 000', 's2'], ['< 1 %', 's3']],
      paras: 2, did: 4, credit: false,
      source: { fr: 'https://linagora.com/fr/customer-success/sofins', en: 'https://linagora.com/en/customer-success/sofins' },
    },
  };

  const range = (n, fn) => Array.from({ length: n || 0 }, (_, i) => fn(i + 1)).join('');

  let dialog = null;
  let current = null;

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'cm';
    dialog.setAttribute('aria-labelledby', 'cm-title');
    dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('cm-open');
      dialog.querySelectorAll('video').forEach(v => v.pause());
    });
    document.body.appendChild(dialog);
    return dialog;
  }

  function mediaHtml(id, m, i) {
    const alt = `data-i18n-attr="alt:cm_${id}_alt${i + 1}"`;
    if (m.type === 'video') {
      const auto = m.loop ? ' autoplay muted loop' : ' controls';
      return `<img class="cm-bg" src="${m.poster}" alt="" aria-hidden="true">`
        + `<video class="cm-main" src="${m.src}" poster="${m.poster}" playsinline preload="metadata"${auto} ${alt}></video>`
        + (m.loop ? `<span class="cm-clip-note" data-i18n-key="cm_clip"></span>` : '');
    }
    return `<img class="cm-bg" src="${m.src}" alt="" aria-hidden="true"><img class="cm-main" src="${m.src}" ${alt}>`;
  }

  function showMedia(index) {
    const c = CASES[current];
    const hero = dialog.querySelector('.cm-hero');
    hero.querySelectorAll('video').forEach(v => v.pause());
    hero.innerHTML = mediaHtml(current, c.media[index], index);
    dialog.querySelectorAll('.cm-thumb').forEach((t, i) => t.classList.toggle('active', i === index));
    if (typeof translatePage === 'function') translatePage();
    const v = hero.querySelector('video[autoplay]');
    if (v) v.play().catch(() => {});
  }

  function build(id) {
    const c = CASES[id];
    const k = (s) => `cm_${id}_${s}`;
    const thumbs = c.media.length > 1
      ? `<div class="cm-thumbs">${c.media.map((m, i) =>
          `<button type="button" class="cm-thumb${m.type === 'video' ? ' cm-thumb--video' : ''}" data-index="${i}">`
          + `<img src="${m.poster || m.src}" alt="" loading="lazy"></button>`).join('')}</div>`
      : '';
    const logo = c.logo
      ? `<img class="cm-logo${c.logoTall ? ' cm-logo--tall' : ''}" src="${c.logo}" alt="${c.logoAlt}">`
      : '';
    const stats = c.stats
      ? `<div class="cm-stats">${c.stats.map(([n, s]) =>
          `<div class="stat"><b>${n}</b><span data-i18n-key="${k(s)}"></span></div>`).join('')}</div>`
      : '';
    const survey = c.survey
      ? `<h3 class="cm-sub" data-i18n-key="cm_survey"></h3><ul class="cm-list">${range(c.survey, i => `<li data-i18n-key="${k('sv' + i)}"></li>`)}</ul>`
      : '';
    const quote = c.quote
      ? `<blockquote class="cm-quote"><span data-i18n-key="${k('quote')}"></span><cite data-i18n-key="${k('quote_by')}"></cite></blockquote>`
      : '';
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    const sourceUrl = c.source && typeof c.source === 'object' ? (c.source[lang] || c.source.en) : c.source;
    const source = sourceUrl
      ? `<a class="cm-source" href="${sourceUrl}" target="_blank" rel="noopener"><span data-i18n-key="cm_source"></span> ↗</a>`
      : '';
    const media = c.media.length
      ? `<div class="cm-hero"></div>${thumbs}`
      : `<div class="cm-nomedia"><span class="event-word">${c.label}<small>${c.year}</small></span></div>`;
    const credit = c.credit === false ? '' : `<p class="cm-credit" data-i18n-key="${k('credit')}"></p>`;
    return `
      <div class="cm-inner${c.media.length ? '' : ' cm-inner--nomedia'}">
        <button type="button" class="cm-close" data-i18n-attr="aria-label:cm_close">&times;</button>
        <div class="cm-media">
          ${media}
        </div>
        <div class="cm-body">
          <div class="cm-head">${logo}<span class="cm-kicker" data-i18n-key="${k('kicker')}"></span></div>
          <h2 id="cm-title" data-i18n-key="${k('title')}"></h2>
          <p class="cm-lead" data-i18n-key="${k('lead')}"></p>
          ${stats}
          <div class="cm-text">${range(c.paras, i => `<p data-i18n-key="${k('p' + i)}"></p>`)}</div>
          ${survey}
          <h3 class="cm-sub" data-i18n-key="cm_did"></h3>
          <ul class="cm-list">${range(c.did, i => `<li data-i18n-key="${k('li' + i)}"></li>`)}</ul>
          ${quote}
          ${credit}
          <div class="cm-foot">
            <a href="#" class="btn cm-cta" data-i18n-key="cm_cta"></a>
            ${source}
          </div>
        </div>
      </div>`;
  }

  function open(id) {
    if (!CASES[id]) return;
    const c = CASES[id];
    ensureDialog();
    current = id;
    dialog.innerHTML = build(id);
    dialog.querySelector('.cm-close').addEventListener('click', close);
    dialog.querySelectorAll('.cm-thumb').forEach(t => t.addEventListener('click', () => showMedia(+t.dataset.index)));
    dialog.querySelector('.cm-cta').addEventListener('click', (e) => {
      e.preventDefault();
      close();
      const contact = document.getElementById('contact-modal');
      if (contact) {
        contact.style.display = 'block';
        document.dispatchEvent(new CustomEvent('contactmodalopen'));
      }
    });
    if (c.media.length) showMedia(0); else if (typeof translatePage === 'function') translatePage();
    document.body.classList.add('cm-open');
    dialog.showModal();
    dialog.querySelector('.cm-body').scrollTop = 0;
    dialog.querySelector('.cm-close').focus();
  }

  function close() {
    if (dialog && dialog.open) dialog.close();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-case]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        open(el.getAttribute('data-case'));
      });
    });
    // Deep link: /#case-eye2025 opens the case directly.
    const m = /^#case-([a-z0-9]+)$/.exec(location.hash);
    if (m && CASES[m[1]]) {
      const tryOpen = () => (typeof translations !== 'undefined' && translations.en) ? open(m[1]) : setTimeout(tryOpen, 100);
      tryOpen();
    }
  });
})();
