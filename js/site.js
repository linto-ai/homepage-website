// Shared page behaviour: mobile menu, logo wink, demo video, contact modal loading.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  const lintoLogo = document.getElementById('linto-logo');
  if (lintoLogo) {
    const wink = () => {
      lintoLogo.classList.add('wink');
      setTimeout(() => lintoLogo.classList.remove('wink'), 400);
    };
    setTimeout(() => { wink(); setInterval(wink, 10000); }, 1000);
  }

  const video = document.getElementById('video');
  const playButton = document.getElementById('playButton');
  const screenshot = document.querySelector('.screenshot');
  if (video && playButton && screenshot) {
    const playVideo = () => {
      video.play();
      playButton.style.display = 'none';
    };
    playButton.addEventListener('click', (e) => { e.stopPropagation(); playVideo(); });
    screenshot.addEventListener('click', playVideo);
    video.addEventListener('ended', () => {
      playButton.style.display = 'flex';
      video.load();
    });
  }

  // Contact modal is shared by every page; it is fetched once and translated.
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) {
    fetch('/contact.html')
      .then(response => response.text())
      .then(data => {
        modalContainer.innerHTML = data;
        if (typeof initializeContactForm === 'function') initializeContactForm();
        if (typeof translatePage === 'function') translatePage();
        document.querySelectorAll('[data-open-contact]').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('contact-modal');
            if (modal) {
              modal.style.display = 'block';
              document.dispatchEvent(new CustomEvent('contactmodalopen'));
            }
          });
        });
      });
  }

  // Pricing: monthly / annual toggle.
  const toggles = document.querySelectorAll('[data-billing]');
  if (toggles.length) {
    const apply = (mode) => {
      toggles.forEach(b => b.classList.toggle('active', b.getAttribute('data-billing') === mode));
      document.querySelectorAll('[data-month]').forEach(el => {
        el.textContent = mode === 'year' ? el.getAttribute('data-year') : el.getAttribute('data-month');
      });
      document.querySelectorAll('[data-show-billing]').forEach(el => {
        el.hidden = el.getAttribute('data-show-billing') !== mode;
      });
    };
    toggles.forEach(b => b.addEventListener('click', () => apply(b.getAttribute('data-billing'))));
    apply('year');
    document.addEventListener('languagechange', () => {
      const active = document.querySelector('[data-billing].active');
      apply(active ? active.getAttribute('data-billing') : 'year');
    });
  }
});
