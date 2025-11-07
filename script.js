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

// === DOM MANIPULATION & STYLING ===

// === 1. Theme Toggle (Dynamic Style) ===
const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("day-theme");
    if (document.body.classList.contains("day-theme")) {
      themeBtn.textContent = "NIGHT THEME 🌙";
      document.body.style.backgroundColor = "#f5f5f5";
      document.body.style.color = "#222";
    } else {
      themeBtn.textContent = "DAY THEME ☀️";
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "#fff";
    }
  });
}

// === 2. Display Date and Time ===
function updateTime() {
  const now = new Date();
  const dateTimeElement = document.getElementById("dateTime");
  if (dateTimeElement) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    dateTimeElement.textContent = now.toLocaleString("en-US", options);
  }
}
setInterval(updateTime, 1000);
updateTime();

// === 3. Popup Form Logic ===
const popupForm = document.getElementById("popupForm");
const closePopup = document.getElementById("closePopup");

setTimeout(() => {
  popupForm.style.display = "flex";
}, 3000);

closePopup.addEventListener("click", () => {
  popupForm.style.display = "none";
});

// === 4. Read More Button Example (Dynamic Style Change) ===
const faqBodies = document.querySelectorAll(".accordion-body");
faqBodies.forEach((body) => {
  const readMore = document.createElement("button");
  readMore.textContent = "Read More";
  readMore.classList.add("btn", "btn-outline-primary", "btn-sm", "mt-2");
  body.appendChild(readMore);

  readMore.addEventListener("click", () => {
    if (body.style.maxHeight) {
      body.style.maxHeight = null;
      readMore.textContent = "Read More";
    } else {
      body.style.maxHeight = "300px";
      readMore.textContent = "Show Less";
    }
  });
});

// === 5. Keyboard Navigation for Menu ===
const navLinks = document.querySelectorAll(".nav-links li a");
let currentIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % navLinks.length;
    navLinks[currentIndex].focus();
  } else if (e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
    navLinks[currentIndex].focus();
  }
});

// === 6. Event Handling - Contact Form Validation ===
const contactForm = document.getElementById("contactForm");
const errorMsg = document.getElementById("errorMsg");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (pass.length < 6) {
      errorMsg.textContent = "Password must be at least 6 characters!";
    } else if (pass !== confirm) {
      errorMsg.textContent = "Passwords do not match!";
    } else {
      errorMsg.style.color = "green";
      errorMsg.textContent = " Form submitted successfully!";
      contactForm.reset();
    }
  });
}

// === 7. Switch Statement - Greeting by Time of Day ===
const hour = new Date().getHours();
let greeting = "";
switch (true) {
  case hour < 12:
    greeting = "Good Morning, Anime Fan 🌅";
    break;
  case hour < 18:
    greeting = "Good Afternoon, Otaku ☀️";
    break;
  default:
    greeting = "Good Evening, Night Watcher 🌙";
}
const greetingMsg = document.createElement("h3");
greetingMsg.textContent = greeting;
document.querySelector("main").prepend(greetingMsg);



// robust rating code - event delegation + localStorage
document.addEventListener('DOMContentLoaded', () => {
  const storagePrefix = 'animelib:rating:';

  // restore ratings on load
  document.querySelectorAll('.episode-card').forEach(card => {
    const key = storagePrefix + (card.dataset.episodeId || card.querySelector('h3')?.textContent || 'unknown');
    const saved = localStorage.getItem(key);
    if (saved) {
      const value = Number(saved);
      applyRatingToCard(card, value);
    }
  });

  // delegate click to any star
  document.addEventListener('click', (e) => {
    const star = e.target.closest('.star');
    if (!star) return;
    const ratingContainer = star.closest('.rating');
    if (!ratingContainer) return;
    const card = star.closest('.episode-card');
    if (!card) return;

    const selected = Number(star.dataset.value);
    // apply visually
    applyRatingToCard(card, selected);
    // save
    const key = storagePrefix + (card.dataset.episodeId || card.querySelector('h3')?.textContent || 'unknown');
    localStorage.setItem(key, String(selected));
    console.log(`Saved ${selected} for ${key}`);
  });

  // mouseover for hover effect (temporary)
  document.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.star');
    if (!star) return;
    const container = star.closest('.rating');
    if (!container) return;
    const val = Number(star.dataset.value);
    container.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('hovered', Number(s.dataset.value) <= val);
      // hover color via CSS is handled, hovered class not required, but kept harmless
    });
  });

  document.addEventListener('mouseout', (e) => {
    const star = e.target.closest('.star');
    if (!star) return;
    const container = star.closest('.rating');
    if (!container) return;
    container.querySelectorAll('.star').forEach(s => s.classList.remove('hovered'));
  });

  // keyboard support: when a rating container is focused, use left/right and 1-5 to set rating
  document.querySelectorAll('.rating').forEach(rc => rc.setAttribute('tabindex', '0'));
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (!active || !active.classList.contains('rating')) return;
    const stars = Array.from(active.querySelectorAll('.star'));
    const current = stars.filter(s => s.classList.contains('selected')).length;

    if (e.key === 'ArrowRight') {
      const next = Math.min(5, current + 1);
      applyRatingToCard(active.closest('.episode-card'), next);
      localStorage.setItem(storagePrefix + active.closest('.episode-card').dataset.episodeId, String(next));
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const next = Math.max(0, current - 1);
      applyRatingToCard(active.closest('.episode-card'), next);
      localStorage.setItem(storagePrefix + active.closest('.episode-card').dataset.episodeId, String(next));
      e.preventDefault();
    } else if (/^[1-5]$/.test(e.key)) {
      const num = Number(e.key);
      applyRatingToCard(active.closest('.episode-card'), num);
      localStorage.setItem(storagePrefix + active.closest('.episode-card').dataset.episodeId, String(num));
      e.preventDefault();
    }
  });

  // helper to apply visual selected state
  function applyRatingToCard(card, rating) {
    if (!card) return;
    const stars = card.querySelectorAll('.star');
    stars.forEach(s => {
      const v = Number(s.dataset.value);
      s.classList.toggle('selected', v <= rating);
    });
  }
});




// === 10. Animation Example ===
const galleryItems = document.querySelectorAll(".anime-item img");
galleryItems.forEach((img) => {
  img.addEventListener("mouseenter", () => {
    img.style.transform = "scale(1.1)";
    img.style.transition = "transform 0.5s ease-in-out";
  });
  img.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1)";
  });
});


// === Task 11: Play Anime OST on Click ===
const animeItems = document.querySelectorAll('.anime-item');
let currentAudio = null;

animeItems.forEach(item => {
  item.addEventListener('click', () => {
    const audioSrc = item.getAttribute('data-audio');
    if (!audioSrc) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(audioSrc);
    currentAudio.play();
  });
});


// === 12. Popup Form Hover Effect ===
popupForm.style.transition = "opacity 0.6s ease";
popupForm.addEventListener("mouseenter", () => {
  popupForm.style.opacity = "0.95";
});
popupForm.addEventListener("mouseleave", () => {
  popupForm.style.opacity = "0.8";
});

