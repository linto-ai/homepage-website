// Feature explorer on the landing: a list of features on the left, a panel on
// the right with a short description, three facts and a small animated mock.
// Rotates on its own every 6 s until the visitor clicks a feature.
(function () {
  const FEATURES = [
    { k: 'live', icon: 'microphone', mock: 'live' },
    { k: 'diar', icon: 'users', mock: 'diar' },
    { k: 'voice', icon: 'waveform', mock: 'voice' },
    { k: 'align', icon: 'clock', mock: 'align' },
    { k: 'collab', icon: 'three', mock: 'collab' },
    { k: 'subs', icon: 'caption', mock: 'subs' },
    { k: 'summary', icon: 'text', mock: 'doc' },
    { k: 'chat', icon: 'robot', mock: 'chat' },
    { k: 'templates', icon: 'file', mock: 'template' },
    { k: 'lang', icon: 'globe', mock: 'lang' },
    { k: 'bots', icon: 'robot', mock: 'bots' },
    { k: 'media', icon: 'film-strip', mock: 'media' },
    { k: 'api', icon: 'code', mock: 'api' },
    { k: 'selfhost', icon: 'server', mock: 'selfhost' }
  ];
  const ROTATE_MS = 6000;

  const bar = (w, extra) => `<span class="bar${extra ? ' ' + extra : ''}" style="width:${w}%"></span>`;
  const line = (i, chip, color, w, extra) =>
    `<div class="mline" style="animation-delay:${i * 0.45}s"><span class="chip c${color}">${chip}</span>${bar(w, extra)}</div>`;

  const MOCKS = {
    live: () => `<div class="mock mock-transcript">
      <div class="mhead"><span class="dot-live"></span>LIVE <span class="mtime">00:04:12</span></div>
      ${line(0, 'Marie', 1, 78)}${line(1, 'Karim', 2, 62)}${line(2, 'Marie', 1, 40, 'typing')}
    </div>`,
    diar: () => `<div class="mock mock-transcript">
      <div class="mhead"><span class="mtime">00:12:40</span></div>
      ${line(0, 'Speaker 1', 1, 70)}${line(1, 'Speaker 2', 2, 55)}${line(2, 'Speaker 3', 3, 66)}${line(3, 'Speaker 1', 1, 48)}
    </div>`,
    voice: () => `<div class="mock mock-transcript">
      <div class="mhead"><span class="mtime">00:02:05</span></div>
      <div class="mline" style="animation-delay:0s"><span class="chip c1 swap"><span>Speaker 1</span><span>Marie L.</span></span>${bar(72)}</div>
      <div class="mline" style="animation-delay:.45s"><span class="chip c2 swap"><span>Speaker 2</span><span>Karim B.</span></span>${bar(58)}</div>
      <div class="mline" style="animation-delay:.9s"><span class="chip c1 swap"><span>Speaker 1</span><span>Marie L.</span></span>${bar(64)}</div>
      <div class="mfoot"><span class="tag">voice signature ✓</span></div>
    </div>`,
    align: () => `<div class="mock mock-transcript">
      <div class="mwords">${'▇ '.repeat(0)}<span class="w">Lorem</span> <span class="w">ipsum</span> <span class="w">dolor</span> <span class="w">sit</span> <span class="w">amet</span> <span class="w">consectetur</span> <span class="w">adipiscing</span> <span class="w">elit</span> <span class="w">sed</span> <span class="w">do</span> <span class="w">eiusmod</span> <span class="w">tempor</span></div>
      <div class="mwave"><span class="playhead"></span>${Array.from({length: 40}, (_, i) => `<i style="height:${20 + Math.round(60 * Math.abs(Math.sin(i * 0.7)))}%"></i>`).join('')}</div>
    </div>`,
    collab: () => `<div class="mock mock-transcript">
      ${line(0, 'Marie', 1, 74)}${line(1, 'Karim', 2, 60)}${line(2, 'Marie', 1, 68)}
      <span class="cursor cu1" style="--x:58%;--y:30%">Léa</span>
      <span class="cursor cu2" style="--x:22%;--y:66%">Tom</span>
    </div>`,
    subs: () => `<div class="mock mock-video">
      <div class="scene"></div>
      <div class="banner"><span class="sub sub1">Bonjour à tous, et merci d'être là.</span><span class="sub sub2">On commence par le bilan du trimestre.</span></div>
      <div class="mfoot"><span class="tag">SRT</span><span class="tag">VTT</span></div>
    </div>`,
    lang: () => `<div class="mock mock-video">
      <div class="scene"></div>
      <div class="langs"><span class="lg on">FR</span><span class="lg">EN</span><span class="lg">DE</span><span class="lg">ES</span></div>
      <div class="banner"><span class="sub sub1">Bonjour à tous, et merci d'être là.</span><span class="sub sub2">Hello everyone, and thank you for coming.</span></div>
    </div>`,
    doc: () => `<div class="mock mock-doc">
      <div class="page">
        <span class="bar t" style="width:55%"></span>
        <span class="bar h" style="width:30%"></span>${bar(92)}${bar(84)}${bar(70)}
        <span class="bar h" style="width:36%"></span>${bar(88)}${bar(60)}
        <span class="bar h" style="width:26%"></span><span class="bar li" style="width:70%"></span><span class="bar li" style="width:52%"></span>
      </div>
      <div class="mfoot"><span class="tag">DOCX</span><span class="tag">PDF</span><span class="tag">TXT</span></div>
    </div>`,
    template: () => `<div class="mock mock-doc">
      <div class="page branded">
        <div class="logo-block"><span class="sq"></span><span class="bar" style="width:34%"></span></div>
        <span class="bar t" style="width:60%"></span>
        <span class="ph">{{output}}</span>
        <div class="fill">${bar(90)}${bar(76)}${bar(82)}${bar(58)}</div>
        <span class="bar li" style="width:40%"></span>
      </div>
      <div class="mfoot"><span class="tag">your .docx</span></div>
    </div>`,
    chat: () => `<div class="mock mock-chat">
      <div class="bubble q" style="animation-delay:0s">${bar(70)}</div>
      <div class="bubble a" style="animation-delay:.9s">${bar(88)}${bar(64)}<span class="ref">↳ 00:14:32</span></div>
      <div class="bubble q" style="animation-delay:1.8s">${bar(46)}</div>
      <div class="bubble a typing" style="animation-delay:2.6s"><span></span><span></span><span></span></div>
    </div>`,
    bots: () => `<div class="mock mock-meet">
      <div class="tiles"><span class="tile"></span><span class="tile"></span><span class="tile"></span><span class="tile bot"><i></i>LinTO</span></div>
      <div class="mlines">${line(0, 'Marie', 1, 66)}${line(1, 'Karim', 2, 52, 'typing')}</div>
    </div>`,
    media: () => `<div class="mock mock-media">
      ${['done', 'done', 'run', 'wait'].map((s, i) => `<div class="row" style="animation-delay:${i * 0.35}s"><span class="ico"></span>${bar(38 + i * 9)}<span class="st ${s}"></span></div>`).join('')}
    </div>`,
    api: () => `<div class="mock mock-code"><pre><span class="ln">$ curl -X POST https://studio.linto.ai/api/…/media \\</span>
<span class="ln">    -H "Authorization: Bearer $TOKEN" \\</span>
<span class="ln">    -F file=@meeting.mp3</span>
<span class="ln out">{ "status": "queued", "id": "66f1…" }</span></pre></div>`,
    selfhost: () => `<div class="mock mock-code"><pre><span class="ln">$ helm install linto-studio linto/linto-studio \\</span>
<span class="ln">    --set ingress.host=studio.example.org</span>
<span class="ln out">NAME: linto-studio   STATUS: deployed</span>
<span class="ln out">GPU: whisper, diarization, llm ✓</span></pre></div>`
  };

  function tr(key) {
    try {
      const dict = translations[currentLang] || {};
      return dict[key] !== undefined ? dict[key] : key;
    } catch (e) { return key; }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('feature-explorer');
    if (!root) return;
    const tabs = root.querySelector('.fx-tabs');
    const visual = root.querySelector('.fx-visual');
    const title = root.querySelector('.fx-title');
    const desc = root.querySelector('.fx-desc');
    const facts = root.querySelector('.fx-facts');
    let current = 0, timer = null, auto = true;

    FEATURES.forEach((f, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'fx-tab';
      b.setAttribute('role', 'tab');
      b.innerHTML = `<span class="icon ${f.icon}"></span><span class="fx-tab-label" data-i18n-key="fx_${f.k}_title"></span><span class="fx-progress"></span>`;
      b.addEventListener('click', () => { auto = false; clearInterval(timer); root.classList.remove('auto'); show(i); });
      tabs.appendChild(b);
      f.el = b;
    });

    function show(i) {
      current = i;
      const f = FEATURES[i];
      FEATURES.forEach((x, j) => x.el.classList.toggle('active', j === i));
      title.textContent = tr(`fx_${f.k}_title`);
      desc.textContent = tr(`fx_${f.k}_desc`);
      facts.innerHTML = [1, 2, 3].map(n => `<li>${tr(`fx_${f.k}_f${n}`)}</li>`).join('');
      visual.innerHTML = MOCKS[f.mock]();
      root.querySelector('.fx-body').classList.remove('in');
      void root.querySelector('.fx-body').offsetWidth;
      root.querySelector('.fx-body').classList.add('in');
      if (window.innerWidth < 960) {
        f.el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    }

    function start() {
      root.classList.add('auto');
      timer = setInterval(() => show((current + 1) % FEATURES.length), ROTATE_MS);
    }
    root.addEventListener('mouseenter', () => { if (auto) clearInterval(timer); });
    root.addEventListener('mouseleave', () => { if (auto) { clearInterval(timer); timer = setInterval(() => show((current + 1) % FEATURES.length), ROTATE_MS); } });

    document.addEventListener('languagechange', () => show(current));
    show(0);
    start();
  });
})();
