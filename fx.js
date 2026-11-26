(() => {
const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
// scroll progress
const pg = document.createElement('div'); pg.id = 'prog'; document.body.append(pg);
let tick = false;
addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { const h = document.documentElement.scrollHeight - innerHeight; pg.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; tick = false; }); }, { passive: true });
// split headline into words
document.querySelectorAll('h1.split').forEach((h) => {
  let i = 0;
  const walk = (n) => [...n.childNodes].forEach((c) => {
    if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((t) => { if (!t) return; if (/^\s+$/.test(t)) f.append(t); else { const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = t; f.append(s); } }); c.replaceWith(f); }
    else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
  });
  walk(h);
});
// count-up
const nums = document.querySelectorAll('[data-to]');
const cio = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; cio.unobserve(e.target); const el = e.target, to = Number(el.dataset.to) || 0, t0 = performance.now(); const step = (t) => { const p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('ar-EG'); if (p < 1) requestAnimationFrame(step); }; rm ? (el.textContent = to.toLocaleString('ar-EG')) : requestAnimationFrame(step); }), { threshold: .4 });
nums.forEach((n) => cio.observe(n));
const vc = document.querySelector('[data-vcount]');
const setV = () => { if (vc && window.STUDXI) vc.dataset.to = STUDXI.videos.length; };
setTimeout(setV, 0); addEventListener('load', () => setTimeout(() => { setV(); }, 400));
// spotlight + tilt
if (fine && !rm) {
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest && e.target.closest('.card.pad,.stat,.slot'); if (!c) return;
    const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
    if (c.classList.contains('tilt')) { c.style.setProperty('--ry', ((x / r.width - .5) * 8).toFixed(2) + 'deg'); c.style.setProperty('--rx', ((.5 - y / r.height) * 8).toFixed(2) + 'deg'); }
  }, { passive: true });
  document.addEventListener('pointerout', (e) => { const c = e.target.closest && e.target.closest('.card.tilt'); if (c) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });
}
// hero orb parallax
const orbs = document.querySelector('.orbs');
if (orbs && !rm) addEventListener('scroll', () => { orbs.style.transform = 'translate3d(0,' + (scrollY * .25) + 'px,0)'; }, { passive: true });
// countdown to next Friday 15:00 Cairo
{
  const parts = (d) => Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23', weekday: 'short' }).formatToParts(d).map((p) => [p.type, p.value]));
  const wall = (d) => { const p = parts(d); return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second); };
  // absolute Date for a Cairo wall time "YYYY-MM-DDTHH:MM" (set from the app)
  const cairoWall = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s || '')); if (!m) return null; const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0); return new Date(guess - (wall(new Date(guess)) - guess)); };
  const nextMeet = () => {
    const o = window.STUDXI_SITE ? cairoWall(window.STUDXI_SITE.meeting_at) : null;
    if (o && o > new Date()) return o;
    const now = new Date();
    for (let i = 0; i < 9; i++) {
      const p = parts(new Date(now.getTime() + i * 864e5));
      if (p.weekday !== 'Fri') continue;
      const guess = Date.UTC(p.year, p.month - 1, p.day, 15, 0, 0);
      const target = new Date(guess - (wall(new Date(guess)) - guess));
      if (target > now) return target;
    }
    return null;
  };
  const draw = () => {
    const els = document.querySelectorAll('[data-cd]'); if (!els.length) return;
    const t = nextMeet(); if (!t) return; let s = Math.max(0, Math.floor((t - Date.now()) / 1000));
    const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60], l = ['يوم', 'ساعة', 'دقيقة', 'ثانية'];
    const html = v.map((n, i) => '<div><b>' + String(n).padStart(2, '0') + '</b><small>' + l[i] + '</small></div>').join('');
    els.forEach((el) => { el.innerHTML = html; });
  };
  draw(); setInterval(draw, 1000);
}
// kit lab (delegated, so it also works inside OS Mode windows)
const JERSEY = '<svg class="jersey" viewBox="0 0 200 200" style="--k1:#b6ff1a;--k2:#000" role="img" aria-label="طقم توضيحي"><path class="body" d="M70 20L25 42l-14 42 28 10 6-18v100h110V76l6 18 28-10-14-42-45-22c-6 14-20 22-30 22S76 34 70 20z"/><rect class="stripe" x="45" y="76" width="110" height="12"/><rect class="stripe" x="45" y="100" width="110" height="6"/><path class="trim" d="M70 20c6 14 20 22 30 22s24-8 30-22l-8-3c-4 10-14 16-22 16s-18-6-22-16z"/><path class="trim" d="M25 42l14 52 6-2-14-48zM175 42l-14 52-6-2 14-48z" opacity=".9"/></svg>';
const COMBOS = [['#b6ff1a', '#000000', 'ليموني وأسود'], ['#000000', '#b6ff1a', 'أسود وليموني'], ['#f5f5f7', '#000000', 'أبيض وأسود'], ['#000000', '#f5f5f7', 'أسود وأبيض'], ['#b6ff1a', '#f5f5f7', 'ليموني وأبيض']];
const SW = COMBOS.map(([a, b, n], i) => '<button class="sw' + (i ? '' : ' on') + '" data-a="' + a + '" data-b="' + b + '" style="--a:' + a + ';--b:' + b + '" aria-label="' + n + '"><i></i></button>').join('');
window.STUDXI_KITS = { lab: '<div class="kitlab">' + JERSEY + '<div class="swatches">' + SW + '</div><span class="tag">رسم توضيحي تفاعلي بألوان القناة، مش طقم حقيقي من القناة</span></div>' };
document.querySelectorAll('[data-kitlab]').forEach((el) => { el.innerHTML = STUDXI_KITS.lab; });
document.addEventListener('click', (e) => {
  const b = e.target.closest && e.target.closest('.sw'); if (!b) return;
  const box = b.closest('.kitlab'), j = box && box.querySelector('.jersey'); if (!j) return;
  j.style.setProperty('--k1', b.dataset.a); j.style.setProperty('--k2', b.dataset.b);
  box.querySelectorAll('.sw').forEach((x) => x.classList.toggle('on', x === b));
});
// keep the chat button from covering content: tuck it to the screen edge while it overlaps text or controls
(() => {
  const fab = document.getElementById('chatfab'), chat = document.getElementById('chat'); if (!fab) return;
  const SEL = '.swatches,.tag,.cd,.lead,.btn,.card,.stat,.chip,.empty,.slot,.sw,h1,h2,h3,p,input,form,.pal div,.ticker';
  let busy = false;
  const run = () => {
    busy = false;
    if (chat && chat.classList.contains('open')) { fab.classList.remove('tuck-r', 'tuck-l'); return; }
    if (document.getElementById('os') && document.getElementById('os').classList.contains('on')) { fab.classList.remove('tuck-r', 'tuck-l'); return; }
    fab.classList.remove('tuck-r', 'tuck-l'); const f = fab.getBoundingClientRect();
    let hit = false;
    for (const e of document.querySelectorAll('main ' + SEL.split(',').join(',main '))) {
      if (e.closest('.ticker') && e.className !== 'ticker' && !e.classList.contains('ticker')) continue;
      const r = e.getBoundingClientRect(); if (r.width && r.bottom > f.top && r.top < f.bottom && r.right > f.left && r.left < f.right) { hit = true; break; }
    }
    if (hit) fab.classList.add(f.left + f.width / 2 > innerWidth / 2 ? 'tuck-r' : 'tuck-l');
  };
  const sched = () => { if (!busy) { busy = true; requestAnimationFrame(run); } };
  addEventListener('scroll', sched, { passive: true }); addEventListener('resize', sched); addEventListener('load', sched); setTimeout(sched, 600);
})();
})();

/* live content from the STUDXI admin app: data/kits.json and data/site.json (both optional) */
(function () {
  var E = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var safeImg = function (p) { return /^kits\/[A-Za-z0-9_-]+\.jpg$/.test(p || ''); };
  function kitCards(list) {
    return list.filter(function (k) { return safeImg(k.image); }).map(function (k) {
      return '<figure class="kitcard"><img loading="lazy" src="' + E(k.image) + '" alt="' + E(k.name) + '"><figcaption><b>' + E(k.name) + '</b><span>' + E(k.type) + (k.season ? ' · ' + E(k.season) : '') + '</span>' + (k.caption ? '<em>' + E(k.caption) + '</em>' : '') + '</figcaption></figure>';
    }).join('');
  }
  window.STUDXI_KITS = window.STUDXI_KITS || {};
  window.STUDXI_KITS.cards = '';
  var get = function (u) { return fetch(u, { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); };
  get('data/kits.json').then(function (d) {
    var html = d && d.kits ? kitCards(d.kits) : '';
    if (!html) return;
    window.STUDXI_KITS.cards = '<div class="kitgrid">' + html + '</div>';
    var gal = document.querySelector('.gal');
    if (gal) {
      var sec = gal.closest('.wrap');
      gal.outerHTML = '<div class="kitgrid">' + html + '</div>';
      if (sec) { sec.querySelectorAll('p.lead').forEach(function (p) { if (/لسه مفيش أطقم/.test(p.textContent)) p.remove(); }); var h = sec.querySelector('h2'); if (h) h.textContent = 'معرض الأطقم.'; }
    }
  });
  var annc = null, meetDef = new WeakMap();
  var applySite = function (s) {
    if (!s) return;
    window.STUDXI_SITE = s;
    if (s.announcement) {
      if (!annc) { annc = document.createElement('div'); annc.className = 'annc'; document.body.insertBefore(annc, document.body.firstChild); }
      if (annc.textContent !== s.announcement) annc.textContent = s.announcement;
      annc.style.display = '';
    } else if (annc) { annc.style.display = 'none'; }
    document.querySelectorAll('p.lead, h2, p.muted').forEach(function (p) {
      if (!meetDef.has(p)) { if (/كل جمعة/.test(p.textContent)) meetDef.set(p, p.textContent); else return; }
      var t = s.meeting || meetDef.get(p); if (p.textContent !== t) p.textContent = t;
    });
    var show = s.show || {}, map = { videos: 'videos.html', kits: 'kits.html', community: 'community.html' };
    Object.keys(map).forEach(function (k) {
      if (show[k] !== false) return;
      document.querySelectorAll('a[href="' + map[k] + '"]').forEach(function (a) { a.style.display = 'none'; });
      if (location.pathname.split('/').pop() === map[k]) { var m = document.querySelector('main'); if (m) m.innerHTML = '<section class="page-h"><h1 class="grad">القسم ده مخفي دلوقتي.</h1><p class="lead">هيرجع قريب.</p></section>'; }
    });
  };
  // poll every 15s so open pages pick up app changes without a refresh;
  // mobile browsers pause timers in background tabs, so also poll the moment
  // the tab becomes visible or regains focus
  var pollSite = function () { get('data/site.json').then(applySite); };
  pollSite(); setInterval(pollSite, 15000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) pollSite(); });
  addEventListener('focus', pollSite);
  addEventListener('pageshow', function (e) { if (e.persisted) pollSite(); });
})();
