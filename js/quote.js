// Quote form on /live/. Same anti-spam as the contact modal, same mail backend.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const sendButton = document.getElementById('quote-send');
  const successBox = document.getElementById('quote-success');
  const errorBox = document.getElementById('quote-error');
  const captchaLabel = document.getElementById('q-captcha-label');
  const captchaField = document.getElementById('q-captcha');
  const MIN_FILL_TIME_MS = 4000;
  const openedAt = Date.now();
  let captchaAnswer = null;

  const t = (fr, en) => (document.documentElement.lang === 'fr' ? fr : en);

  function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = a + b;
    captchaLabel.textContent = t(`Combien font ${a} + ${b} ?`, `What is ${a} + ${b}?`);
  }
  generateCaptcha();
  document.addEventListener('languagechange', generateCaptcha);

  function setError(id, msg) {
    const field = document.getElementById(id);
    const box = document.getElementById(id + '-error');
    if (field) field.classList.toggle('error', !!msg);
    if (box) box.textContent = msg || '';
    return !msg;
  }

  function validate() {
    let ok = true;
    const name = document.getElementById('q-name').value.trim();
    const email = document.getElementById('q-email').value.trim();
    const org = document.getElementById('q-org').value.trim();
    const required = t('Champ requis', 'Required');
    ok = setError('q-name', name ? '' : required) && ok;
    ok = setError('q-email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : t('Adresse email invalide', 'Invalid email address')) && ok;
    ok = setError('q-org', org ? '' : required) && ok;
    const msg = document.getElementById('q-msg').value;
    ok = setError('q-msg', /[<>]/.test(msg) || /script/i.test(msg) ? t('Caractères non autorisés', 'Characters not allowed') : '') && ok;
    const captcha = captchaField.value.trim();
    ok = setError('q-captcha', parseInt(captcha, 10) === captchaAnswer ? '' : t('Mauvaise réponse', 'Wrong answer')) && ok;
    return ok;
  }

  function fakeSuccess() {
    successBox.classList.remove('hidden');
    setTimeout(() => successBox.classList.add('hidden'), 6000);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorBox.classList.add('hidden');
    if (document.getElementById('q-website').value.length > 0) return fakeSuccess();
    if (Date.now() - openedAt < MIN_FILL_TIME_MS) return fakeSuccess();
    if (!validate()) return;

    const val = (id) => document.getElementById(id).value.trim();
    const mode = form.querySelector('input[name="mode"]:checked');
    const sources = Array.from(form.querySelectorAll('input[name="src"]:checked')).map(c => c.value).join(', ');
    const lines = [
      `Type : ${mode ? mode.value : ''}`,
      `Dates : ${val('q-dates')}`,
      `Salles : ${val('q-rooms')}`,
      `Langues : ${val('q-langs')}`,
      `Participants : ${val('q-attendees')}`,
      `Sources audio : ${sources}`,
      '',
      val('q-msg')
    ];

    const payload = {
      subject: 'Devis live / événementiel',
      username: val('q-name'),
      email: val('q-email'),
      phone: val('q-phone'),
      society: val('q-org'),
      message: lines.join('\n')
    };

    const label = sendButton.textContent;
    sendButton.textContent = t('Envoi en cours...', 'Sending...');
    sendButton.disabled = true;

    axios.post('https://dl.linto.ai/mail/send', { method: 'post', data: payload })
      .then((response) => {
        if (response.data.status !== 'success') throw response.data;
        successBox.classList.remove('hidden');
        form.reset();
        generateCaptcha();
      })
      .catch((error) => {
        console.error(error);
        errorBox.classList.remove('hidden');
      })
      .finally(() => {
        sendButton.textContent = label;
        sendButton.disabled = false;
      });
  });
});
