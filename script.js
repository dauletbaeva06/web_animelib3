/* ===================================================================================
   script.js - final version
   - All features preserved
   - Counters support decimal rating display (data-decimals)
   - Progress bar gradient updated in CSS (script just sets width)
   =================================================================================== */

/* small helpers */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* Notification helper */
function showNotification(msg, timeout = 1800) {
  const el = document.getElementById('notification');
  if (!el) { console.log('Notification:', msg); return; }
  el.textContent = msg;
  el.style.display = 'block';
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.transition = 'opacity .35s';
    el.style.opacity = '0';
    setTimeout(() => el.style.display = 'none', 350);
  }, timeout);
}

/* THEME toggle (global) */
(function initTheme() {
  const KEY = 'anime_theme';
  const saved = localStorage.getItem(KEY) || 'dark';
  function apply(theme) {
    if (theme === 'day') document.body.classList.add('day-theme'); else document.body.classList.remove('day-theme');
    $$('.theme-toggle').forEach(btn => { btn.textContent = (theme === 'day') ? 'Switch to Dark' : 'Switch to Light'; });
  }
  apply(saved);
  $$('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.body.classList.contains('day-theme') ? 'day' : 'dark';
      const next = current === 'day' ? 'dark' : 'day';
      localStorage.setItem(KEY, next);
      apply(next);
      showNotification(`Theme switched to ${next === 'day' ? 'Light' : 'Dark'}`);
    });
  });
})();

/* SIDEBAR collapse behavior */
(function initSidebar() {
  const sidebar = document.getElementById('sidebarMenu');
  if (!sidebar || typeof bootstrap === 'undefined') return;
  sidebar.addEventListener('shown.bs.collapse', () => document.body.classList.remove('sidebar-hidden'));
  sidebar.addEventListener('hidden.bs.collapse', () => document.body.classList.add('sidebar-hidden'));
  if (!sidebar.classList.contains('show')) document.body.classList.add('sidebar-hidden');
})();

/* Keyboard navigation for sidebar links */
(function initSidebarKeyboardNav() {
  const sidebar = document.getElementById('sidebarMenu');
  if (!sidebar) return;
  function getLinks(){ return Array.from(sidebar.querySelectorAll('.sidebar-link')); }
  sidebar.addEventListener('keydown', (e) => {
    const links = getLinks();
    if (!links.length) return;
    const idx = links.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); links[(idx+1)%links.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); links[(idx-1+links.length)%links.length].focus(); }
  });
  getLinks().forEach(l => l.setAttribute('tabindex','0'));
})();

/* Progress bar: set width on scroll */
(function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  function onScroll(){
    const sc = document.documentElement.scrollTop || document.body.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = h > 0 ? (sc / h) * 100 : 0;
    bar.style.width = pct + '%';
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

/* FAQ search: realtime, suggestions, highlight, hide non-matching */
(function initFaqSearch() {
  const search = $('#searchBar');
  const suggestions = $('#suggestions');
  const faqBlocks = $$('.faq-block');
  if (!search || !suggestions || faqBlocks.length === 0) return;

  const titles = faqBlocks.map(b => {
    const q = b.querySelector('.faq-question');
    const t = (b.dataset.title || (q && q.textContent) || '').trim();
    return { node: b, title: t };
  });

  function clearHighlights(){ faqBlocks.forEach(b => { const q = b.querySelector('.faq-question'); if (q) q.innerHTML = q.textContent; }); }
  function highlight(node, term){
    if (!term) return;
    const q = node.querySelector('.faq-question');
    if (!q) return;
    const text = q.textContent;
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const re = new RegExp('('+esc+')','gi');
    q.innerHTML = text.replace(re, '<span class="highlight">$1</span>');
  }

  search.addEventListener('input', () => {
    const v = search.value.trim();
    suggestions.innerHTML = '';
    suggestions.style.display = 'none';
    clearHighlights();
    if (v === '') { faqBlocks.forEach(b => b.style.display = ''); return; }
    const matches = titles.filter(t => t.title.toLowerCase().includes(v.toLowerCase()));
    if (matches.length) {
      matches.forEach(m => { const li = document.createElement('li'); li.className = 'suggestion-item p-1'; li.textContent = m.title; suggestions.appendChild(li); });
      suggestions.style.display = 'block';
    }
    faqBlocks.forEach(b => {
      const title = (b.dataset.title || '').toLowerCase();
      if (title.includes(v.toLowerCase())) { b.style.display = ''; highlight(b, v); } else { b.style.display = 'none'; }
    });
  });

  suggestions.addEventListener('click', (e)=> {
    if (e.target && e.target.matches('.suggestion-item')) {
      const text = e.target.textContent;
      search.value = text;
      suggestions.innerHTML = '';
      suggestions.style.display = 'none';
      faqBlocks.forEach(b => {
        const title = (b.dataset.title || '').toLowerCase();
        if (title.includes(text.toLowerCase())) { b.style.display = ''; highlight(b, text); } else { b.style.display = 'none'; }
      });
    }
  });
  document.addEventListener('click', (e) => { if (!search.contains(e.target) && !suggestions.contains(e.target)){ suggestions.innerHTML=''; suggestions.style.display='none'; }});
})();

/* FAQ accordion */
(function initFaqAccordion() {
  const questions = $$('.faq-question');
  if (!questions.length) return;
  questions.forEach(q => {
    q.style.cursor = 'pointer';
    q.addEventListener('click', () => {
      const ans = q.nextElementSibling;
      if (!ans) return;
      const open = ans.style.display === 'block';
      $$('.faq-answer').forEach(a => a.style.display = 'none');
      $$('.faq-question').forEach(h => h.classList.remove('active'));
      if (!open) { ans.style.display = 'block'; q.classList.add('active'); }
    });
  });
})();

/* NEWS filters */
(function initNewsFilters() {
  const cards = $$('.news-card');
  const items = $$('.filter-option');
  if (!cards.length || !items.length) return;
  function apply(filter){
    items.forEach(it => it.classList.toggle('active', it.dataset.filter === filter));
    if (filter === 'all') { cards.forEach(c => { c.style.display = ''; c.style.opacity = '1'; }); return; }
    cards.forEach(c => {
      if (c.dataset.category === filter) { c.style.display = ''; setTimeout(()=> c.style.opacity='1',20); }
      else { c.style.opacity = '0'; setTimeout(()=> c.style.display='none',300); }
    });
  }
  items.forEach(it => it.addEventListener('click', (e)=>{ e.preventDefault(); apply(it.dataset.filter); }));
  apply('all');
})();

/* Subscribe modal */
(function initSubscribe() {
  const form = $('#subscribeForm');
  if (!form) return;
  const email = $('#email'), pw = $('#password');
  const emailError = $('#emailError'), pwError = $('#passwordError');
  const btn = $('#subscribeBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (emailError) emailError.textContent = '';
    if (pwError) pwError.textContent = '';
    const em = (email && email.value || '').trim();
    const pass = (pw && pw.value || '').trim();
    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { if (emailError) emailError.textContent = 'Please enter a valid email address.'; ok = false; }
    if (pass.length < 6) { if (pwError) pwError.textContent = 'Password must be at least 6 characters long.'; ok = false; }
    if (!ok) return;

    if (btn) {
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = `<span class="spinner"></span> Please wait…`;
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        form.reset();
        const modalEl = document.getElementById('subscribeModal');
        if (modalEl) {
          const m = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          m.hide();
        }
        showNotification('Subscribed successfully!');
      }, 1500);
    }
  });
})();

/* Useful tools (calendar, random anime, top airing, quote) */
(function initTools() {
  const animeList = ['Attack on Titan','Jujutsu Kaisen','One Piece','Naruto','Demon Slayer','My Hero Academia','Chainsaw Man','Spy x Family','Hunter x Hunter','Fullmetal Alchemist','Death Note','Your Name'];
  const topAiringPool = ['Jujutsu Kaisen','One Piece','Spy x Family','Demon Slayer','Chainsaw Man','My Hero Academia'];
  const quotes = [
    "People's lives don't end when they die, it ends when they lose faith. — Itachi",
    "A lesson without pain is meaningless. — Naruto",
    "No matter how deep the night, it always turns to day, eventually. — Brook",
    "If you don’t take risks, you can’t create a future. — Monkey D. Luffy",
    "Power comes in response to a need, not a desire. — Tsunade"
  ];

  // calendar
  const today = new Date();
  const todayStr = today.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
  const rcToday = $('#rc-today'), rcUpcoming = $('#rc-upcoming'), rcTodayNews = $('#rc-today-news'), rcUpcomingNews = $('#rc-upcoming-news');
  if (rcToday) rcToday.textContent = todayStr;
  if (rcTodayNews) rcTodayNews.textContent = todayStr;
  const upcomingSample = 'Attack on Titan Final Season (Nov 10)';
  if (rcUpcoming) rcUpcoming.textContent = upcomingSample;
  if (rcUpcomingNews) rcUpcomingNews.textContent = upcomingSample;

  // random anime
  const randBtn = $('#randAnimeBtn'), result = $('#randAnimeResult');
  if (randBtn && result) randBtn.addEventListener('click', ()=> result.textContent = animeList[Math.floor(Math.random()*animeList.length)]);
  const randBtnNews = $('#randAnimeBtnNews'), resultNews = $('#randAnimeResultNews');
  if (randBtnNews && resultNews) randBtnNews.addEventListener('click', ()=> resultNews.textContent = animeList[Math.floor(Math.random()*animeList.length)]);

  // top airing lists
  function populateTopAiring(container, pool) {
    if (!container) return;
    container.innerHTML = '';
    const shuffled = pool.slice().sort(()=>0.5 - Math.random()).slice(0,4);
    shuffled.forEach(title => { const li = document.createElement('li'); li.textContent = title; container.appendChild(li); });
  }
  populateTopAiring($('#topAiringList'), topAiringPool);
  const refreshBtn = $('#refreshTopAiring'); if (refreshBtn) refreshBtn.addEventListener('click', ()=> populateTopAiring($('#topAiringList'), topAiringPool));
  populateTopAiring($('#topAiringListNews'), topAiringPool);
  const refreshNews = $('#refreshTopAiringNews'); if (refreshNews) refreshNews.addEventListener('click', ()=> populateTopAiring($('#topAiringListNews'), topAiringPool));

  // quotes
  const qPick = quotes[Math.floor(Math.random()*quotes.length)];
  if ($('#randomQuote')) $('#randomQuote').textContent = qPick;
  if ($('#randomQuoteNews')) $('#randomQuoteNews').textContent = qPick;
})();

/* Animated counters (supports decimals via data-decimals attr) */
(function initCounters() {
  const elms = $$('.stat-number');
  if (!elms.length) return;

  function animateNumber(el, target, decimals=0, duration=1400) {
    const start = 0;
    const end = parseFloat(target);
    const isFloat = decimals > 0;
    const frames = Math.max(1, Math.floor(duration / 20));
    let frame = 0;
    const step = (end - start) / frames;
    const timer = setInterval(() => {
      frame++;
      let val = start + step * frame;
      if (frame >= frames) {
        val = end;
        clearInterval(timer);
      }
      el.textContent = isFloat ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
    }, 20);
  }

  // animate on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    elms.forEach(el => {
      const target = el.getAttribute('data-target') || el.dataset.target || '0';
      const decimals = parseInt(el.getAttribute('data-decimals') || el.dataset.decimals || '0', 10);
      animateNumber(el, target, decimals, 1500);
    });
  });
})();

/* Small inits: logos circular and top navbar keyboard nav (left/right) */
document.addEventListener('DOMContentLoaded', () => {
  $$('#animated-logo, #animated-logo-news').forEach(img => {
    if (!img) return;
    img.style.borderRadius = '50%';
    img.style.background = 'transparent';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
  });

  // top nav left/right keyboard nav
  ['#mainNav', '#mainNavNews'].forEach(sel => {
    const nav = document.querySelector(sel);
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll('a'));
    links.forEach(a => a.setAttribute('tabindex','0'));
    document.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      if (!nav.contains(active)) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const i = links.indexOf(active);
        links[(i+1)%links.length].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const i = links.indexOf(active);
        links[(i-1+links.length)%links.length].focus();
      }
    });
  });
});
