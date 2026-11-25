(() => {
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (d) => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
const CH = 'https://www.youtube.com/@STUDXIGAMING', FB = 'https://www.facebook.com/share/1B4jHh57b9/';
window.STUDXI = { CH, FB, esc, fmt, videos: [], updated: null };
const card = (v, os) => `<a class="card" ${os ? `href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener"` : `href="videos.html?v=${v.id}"`}><img loading="lazy" src="${esc(v.thumb || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`)}" alt=""><div class="b"><h3>${esc(v.title)}</h3><div class="muted">${fmt(v.published)}${v.views != null ? ' · ' + v.views.toLocaleString('ar-EG') + ' مشاهدة' : ''}</div></div></a>`;
const empty = `<div class="empty">لسه مفيش فيديوهات منشورة على القناة.<br>أول ما ينزل فيديو هيظهر هنا لوحده <br><a class="btn" href="${CH}" target="_blank" rel="noopener">افتح القناة على يوتيوب</a></div>`;
STUDXI.videoGrid = (n = 999, os = false) => STUDXI.videos.length ? `<div class="grid">${STUDXI.videos.slice(0, n).map((v) => card(v, os)).join('')}</div>` : empty;

// reveal + parallax
const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: .15 });
const observe = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
const bn = document.querySelector('.banner');
addEventListener('scroll', () => { if (bn) { const r = bn.getBoundingClientRect(); const t = Math.min(1, Math.max(0, 1 - r.top / innerHeight)); bn.style.setProperty('--s', (0.92 + 0.08 * t).toFixed(3)); } }, { passive: true });

const render = () => {
  document.querySelectorAll('[data-videos]').forEach((el) => (el.innerHTML = STUDXI.videoGrid(Number(el.dataset.videos) || 999)));
  document.querySelectorAll('[data-count]').forEach((el) => (el.textContent = STUDXI.videos.length));
  const q = new URLSearchParams(location.search).get('v'), p = document.getElementById('player');
  if (p && q && /^[\w-]{11}$/.test(q)) { const v = STUDXI.videos.find((x) => x.id === q); p.innerHTML = `<iframe class="player" src="https://www.youtube-nocookie.com/embed/${q}" allowfullscreen></iframe><h2 style="margin-top:20px">${esc(v ? v.title : '')}</h2><p class="muted">${esc(v ? v.description : '')}</p>`; }
  const u = document.getElementById('updated'); if (u && STUDXI.updated) u.textContent = 'آخر تحديث للفيديوهات: ' + new Date(STUDXI.updated).toLocaleString('ar-EG');
  observe();
};
fetch('data/videos.json', { cache: 'no-store' }).then((r) => r.json()).then((d) => { STUDXI.videos = d.videos || []; STUDXI.updated = d.updated; }).catch(() => {}).finally(render);
observe();

// chatbot (rule-based, runs in the browser, no external service)
const fab = document.createElement('button'); fab.id = 'chatfab'; fab.innerHTML = window.STUDXI_ICONS('chat', 26); fab.setAttribute('aria-label', 'شات بوت');
const box = document.createElement('div'); box.id = 'chat';
box.innerHTML = '<div class="hd"><span>مساعد STUDXI</span><span id="cx" style="cursor:pointer"></span></div><div class="ms" id="cm"></div><div class="chips" id="cc"></div><form id="cf"><input id="ci" placeholder="اسأل عن القناة..." autocomplete="off"><button>إرسال</button></form>';
document.body.append(fab, box);
const cm = box.querySelector('#cm');
const say = (t, me) => { const d = document.createElement('div'); d.className = 'm ' + (me ? 'me' : 'bot'); d.innerHTML = t; cm.append(d); cm.scrollTop = cm.scrollHeight; };
const KB = [
  [/فيديو|جديد|اخر|آخر|نزل|video|latest/i, () => STUDXI.videos.length ? 'آخر فيديو: <a href="videos.html?v=' + STUDXI.videos[0].id + '">' + esc(STUDXI.videos[0].title) + '</a>' : 'لسه مفيش فيديوهات منشورة. أول ما ينزل فيديو هيظهر في صفحة <a href="videos.html">الفيديوهات</a> تلقائي.'],
  [/لعب|لعبة|بتلعب|pes|football|فوتبول|بيس|master/i, () => 'المحتوى مبني على PES 2017: Master League ومسيرات الأندية والتحديات والباتشات.'],
  [/اجتماع|جمعة|ميعاد|موعد|meeting/i, () => 'الاجتماع الأسبوعي للقناة كل جمعة 3 العصر بتوقيت القاهرة (حسب وصف القناة).'],
  [/اطلاق|إطلاق|يناير|launch|بداية|ستود|student/i, () => 'STUDXI = Student XI: روح الطلبة وشغف الكورة وعالم الجيمينج.'],
  [/طقم|اطقم|أطقم|تصميم|kit/i, () => 'بنصمم أطقم كورة  شوف قسم <a href="kits.html">الأطقم</a>.'],
  [/لون|ألوان|الوان|color/i, () => 'ألواننا: أسود  وليموني  وأبيض.'],
  [/تواصل|فيسبوك|facebook|اتواصل|contact/i, () => 'تقدر تتواصل معانا من <a href="' + FB + '" target="_blank" rel="noopener">فيسبوك</a> أو في تعليقات يوتيوب.'],
  [/اشترك|subscribe|يوتيوب|youtube|قناة/i, () => '<a href="' + CH + '?sub_confirmation=1" target="_blank" rel="noopener">اشترك في القناة من هنا</a> '],
  [/os|ماك|ايفون|آيفون|ios|mac/i, () => 'اضغط زر <b>OS Mode</b> في الأعلى وجرّب واجهة ماك على الكمبيوتر وآيفون على الموبايل.'],
  [/مين|عن|about|ايه ده/i, () => 'STUDXI GAMING: كورة بروح طالب ولمسة مصرية  فيديوهات جيمنج وتحديات وتصميم أطقم.'],
  [/اهلا|أهلا|مرحبا|سلام|هاي|hi|hello/i, () => 'أهلاً بيك في STUDXI!  اسألني عن الفيديوهات أو الاجتماع أو الأطقم.'],
];
const ask = (t) => { say(esc(t), 1); const hit = KB.find(([re]) => re.test(t)); setTimeout(() => say(hit ? hit[1]() : 'مش متأكد من إجابة السؤال ده. جرّب: فيديوهات، الاجتماع، الأطقم، أو تواصل. أنا بوت بسيط بيرد على أسئلة عن القناة بس.'), 350); };
say('أهلاً! أنا مساعد STUDXI بجاوب على أسئلة بسيطة عن القناة.');
const chips = box.querySelector('#cc'); ['آخر فيديو', 'ميعاد الاجتماع', 'الأطقم', 'تواصل'].forEach((c) => { const b = document.createElement('button'); b.textContent = c; b.onclick = () => ask(c); chips.append(b); });
fab.onclick = () => box.classList.toggle('open'); box.querySelector('#cx').onclick = () => box.classList.remove('open');
box.querySelector('#cf').onsubmit = (e) => { e.preventDefault(); const i = box.querySelector('#ci'); if (i.value.trim()) ask(i.value.trim()); i.value = ''; };
})();
