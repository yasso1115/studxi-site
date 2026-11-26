(() => {
const S = window.STUDXI, esc = S.esc, IC = (n, z = 30) => window.STUDXI_ICONS(n, z);
const APPS = [
  { id: 'videos', n: 'الفيديوهات', i: 'play', c: 'c1', h: () => `<h2>الفيديوهات</h2>${S.videoGrid(999, true)}` },
  { id: 'about', n: 'عن القناة', i: 'ball', c: 'c2', h: () => `<h2>STUDXI GAMING</h2><img src="assets/logo.jpg" style="width:90px;border-radius:50%;float:left;margin:0 14px"><p>STUDXI = Student XI: روح الطلبة وشغف الكورة وعالم الجيمينج. محتوى كروي مبني على PES 2017 (Master League وقصص الأندية)، وتصميم أطقم وهوية بصرية.</p><p class="muted">الاجتماع الأسبوعي: كل جمعة 3 العصر بتوقيت القاهرة (حسب وصف القناة).</p>` },
  { id: 'community', n: 'المجتمع', i: 'news', c: 'c4', h: () => `<h2>المجتمع</h2><p>بيانات وأخبار القناة بأسلوب بيانات الأندية الرسمية.</p><p class="muted">الاجتماع الجاي بعد:</p><div data-cd class="cd"></div><p class="muted" data-meet>كل جمعة 3 العصر بتوقيت القاهرة (حسب وصف القناة).</p><a class="btn" href="${S.CH}?sub_confirmation=1" target="_blank" rel="noopener">اشترك في القناة</a><a class="btn ghost" href="${S.CH}/community" target="_blank" rel="noopener">منشورات يوتيوب</a><a class="btn ghost" href="${S.FB}" target="_blank" rel="noopener">فيسبوك</a><p class="muted">منشورات المجتمع الرسمية على يوتيوب وفيسبوك. الموقع مش بيعرض منشورات من عنده.</p>` },
  { id: 'kits', n: 'الأطقم', i: 'shirt', c: 'c5', h: () => `<h2>الأطقم</h2><p>تصميم أطقم الأندية وهوياتها البصرية، جزء أساسي من القناة.</p>${(window.STUDXI_KITS || {}).lab || ''}${(window.STUDXI_KITS || {}).cards || '<p class="muted">لسه مفيش أطقم منشورة على الموقع. هتتضاف لما تتجهز.</p>'}` },
  { id: 'chat', n: 'المساعد', i: 'chat', c: 'c7', act: () => { document.getElementById('os').classList.remove('on'); document.getElementById('chat').classList.add('open'); } },
  { id: 'contact', n: 'تواصل', i: 'mail', c: 'c3', h: () => `<h2>تواصل معانا</h2><a class="btn" href="${S.FB}" target="_blank" rel="noopener">فيسبوك</a><a class="btn ghost" href="${S.CH}" target="_blank" rel="noopener">يوتيوب</a>` },
  { id: 'site', n: 'الموقع', i: 'globe', c: 'c6', act: () => document.getElementById('os').classList.remove('on') },
];
const os = document.createElement('div'); os.id = 'os'; document.body.append(os);
const isMobile = () => matchMedia('(max-width:820px)').matches || /iPhone|Android.*Mobile/i.test(navigator.userAgent);
const clock = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
let z = 10;

function mac() {
  os.innerHTML = `<div class="wall"></div><div id="mac"><div class="menubar"><img src="assets/logo.jpg" style="width:16px;height:16px;border-radius:50%"><b>STUDXI</b><span>ملف</span><span>عرض</span><span>نافذة</span><span class="sp"></span><span id="mclk">${clock()}</span><span class="x" id="osx">خروج OS Mode</span></div><div class="desk-ico">${APPS.filter((a) => a.h).slice(0, 3).map((a) => `<div data-a="${a.id}"><div class="ico ${a.c}">${IC(a.i)}</div>${a.n}</div>`).join('')}</div><div class="dock">${APPS.map((a) => `<div class="ico di ${a.c}" data-a="${a.id}" data-t="${a.n}">${IC(a.i)}</div>`).join('')}</div></div>`;
  const dock = os.querySelector('.dock'), items = [...dock.querySelectorAll('.di')];
  dock.onmousemove = (e) => items.forEach((it) => { const r = it.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)); it.style.transform = `scale(${1 + Math.max(0, 1 - d / 110) * .6})`; });
  dock.onmouseleave = () => items.forEach((it) => (it.style.transform = ''));
  os.querySelector('#osx').onclick = close;
  os.querySelectorAll('[data-a]').forEach((el) => (el.onclick = () => openWin(el.dataset.a)));
  setInterval(() => { const c = os.querySelector('#mclk'); if (c) c.textContent = clock(); }, 30000);
  openWin('about');
}
function openWin(id) {
  const a = APPS.find((x) => x.id === id); if (!a) return; if (a.act) return a.act();
  const ex = os.querySelector(`.win[data-w="${id}"]`); if (ex) { ex.style.zIndex = ++z; return; }
  const w = document.createElement('div'); w.className = 'win'; w.dataset.w = id; const k = os.querySelectorAll('.win').length;
  w.style.cssText = `width:min(720px,80vw);height:min(460px,62vh);left:${120 + k * 36}px;top:${60 + k * 30}px;z-index:${++z}`;
  w.innerHTML = `<div class="tb"><button class="tl r"></button><button class="tl y"></button><button class="tl g"></button><span class="t">${a.n}</span></div><div class="win-body">${a.h()}</div>`;
  os.querySelector('#mac').append(w); os.querySelector(`.di[data-a="${id}"]`)?.classList.add('run');
  const closeW = () => { w.classList.add('closing'); setTimeout(() => { w.remove(); os.querySelector(`.di[data-a="${id}"]`)?.classList.remove('run'); }, 240); };
  w.querySelector('.r').onclick = closeW; w.querySelector('.y').onclick = closeW;
  w.querySelector('.g').onclick = () => { const f = w.dataset.f; if (f) { w.style.cssText = f; delete w.dataset.f; } else { w.dataset.f = w.style.cssText; w.style.cssText = `left:0;top:26px;width:100vw;height:calc(100vh - 26px);z-index:${++z}`; } };
  w.onmousedown = () => (w.style.zIndex = ++z);
  const tb = w.querySelector('.tb'); tb.onmousedown = (e) => { if (e.target.tagName === 'BUTTON') return; const dx = e.clientX - w.offsetLeft, dy = e.clientY - w.offsetTop; const mv = (m) => { w.style.left = m.clientX - dx + 'px'; w.style.top = Math.max(26, m.clientY - dy) + 'px'; }; const up = () => { removeEventListener('mousemove', mv); removeEventListener('mouseup', up); }; addEventListener('mousemove', mv); addEventListener('mouseup', up); };
}
function ios() {
  const d = new Date();
  os.innerHTML = `<div class="wall"></div><div id="ios" style="display:block"><div class="sbar"><span id="iclk">${clock()}</span><span style="display:flex;gap:6px;align-items:center">5G ${IC('battery',22)}</span></div><div class="island"></div><div class="home"><div class="clockw"><div class="tm" id="itm">${clock().replace(/ ?[AP]M/, '')}</div><div class="dt">${d.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}</div></div><div class="igrid">${APPS.slice(0, 4).map((a) => `<div class="app" data-a="${a.id}"><div class="ico ${a.c}">${IC(a.i)}</div>${a.n}</div>`).join('')}</div></div><div class="idock">${[APPS[4], APPS[5], APPS[6]].map((a) => `<div class="ico ${a.c}" data-a="${a.id}">${IC(a.i)}</div>`).join('')}</div><div class="hind" id="osx"></div></div>`;
  os.querySelectorAll('[data-a]').forEach((el) => (el.onclick = () => {
    const a = APPS.find((x) => x.id === el.dataset.a); if (a.act) return a.act();
    const p = document.createElement('div'); p.className = 'iapp'; p.innerHTML = `<div class="nv">${a.n}</div><div class="win-body">${a.h()}</div>`;
    const r = el.getBoundingClientRect(); p.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    os.querySelector('#ios').append(p);
  }));
  os.querySelector('#osx').onclick = () => { const p = os.querySelector('.iapp:last-of-type'); const open = [...os.querySelectorAll('.iapp')].pop(); if (open) { open.classList.add('closing'); setTimeout(() => open.remove(), 280); } else close(); };
  let y0; os.addEventListener('touchstart', (e) => (y0 = e.touches[0].clientY), { passive: true });
  os.addEventListener('touchend', (e) => { if (y0 > innerHeight - 70 && y0 - e.changedTouches[0].clientY > 60) os.querySelector('#osx').click(); }, { passive: true });
}
function open() { os.classList.add('on'); document.body.style.overflow = 'hidden'; isMobile() ? ios() : mac(); }
function close() { os.classList.remove('on'); document.body.style.overflow = ''; os.innerHTML = ''; }
window.addEventListener('keydown', (e) => e.key === 'Escape' && os.classList.contains('on') && close());
document.querySelectorAll('.osbtn').forEach((b) => (b.onclick = (e) => { e.preventDefault(); open(); }));
if (new URLSearchParams(location.search).get('os') === '1') setTimeout(open, 500);
})();

