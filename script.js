/* ===== GUARANTEED PROGRESS BAR ===== */
(function createProgressBar() {
    // Создаем прогресс бар если его нет
    if (!document.getElementById('progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            width: 0%;
            background: linear-gradient(90deg, #ff2d55, #ff4d6d, #ffd54f);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        console.log('✅ Progress bar created successfully!');
    }
    
    // Функция обновления прогресса
    function updateProgress() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
        
        console.log('Progress:', progress + '%'); // Можно удалить после проверки
    }
    
    // Запускаем
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress(); // начальное состояние
    
    console.log('🎯 Progress bar system activated!');
})();
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Notification system
function showNotification(msg, timeout = 1800) {
  const el = document.getElementById('notification');
  if (!el) { 
    console.log('Notification:', msg); 
    return; 
  }
  el.textContent = msg;
  el.style.display = 'block';
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.style.display = 'none', 350);
  }, timeout);
}

// === THEME SYSTEM (Unified) ===
(function initTheme() {
  const KEY = 'anime_theme';
  const saved = localStorage.getItem(KEY) || 'dark';
  
  function applyTheme(theme) {
    const isDay = theme === 'day';
    document.body.classList.toggle('day-theme', isDay);
    
    // Update all theme buttons
    $$('#themeBtn, .theme-toggle').forEach(btn => {
      if (btn.id === 'themeBtn') {
        btn.textContent = isDay ? 'NIGHT THEME 🌙' : 'DAY THEME ☀️';
      } else {
        btn.textContent = isDay ? 'Switch to Dark' : 'Switch to Light';
      }
    });
    
    // Update body styles
    document.body.style.backgroundColor = isDay ? '#f5f5f5' : '#121212';
    document.body.style.color = isDay ? '#222' : '#fff';
  }

  // Apply saved theme
  applyTheme(saved);

  // Add event listeners to all theme buttons
  $$('#themeBtn, .theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.body.classList.contains('day-theme') ? 'day' : 'dark';
      const next = current === 'day' ? 'dark' : 'day';
      localStorage.setItem(KEY, next);
      applyTheme(next);
      showNotification(`Theme switched to ${next === 'day' ? 'Light' : 'Dark'} mode`);
    });
  });
})();

// === DATE & TIME DISPLAY ===
function initDateTime() {
  function updateTime() {
    const now = new Date();
    const dateTimeElements = $$('#dateTime, #currentDate, #currentTime, #timeDisplay');
    
    dateTimeElements.forEach(el => {
      if (!el) return;
      
      if (el.id === 'dateTime' || el.id === 'currentDate') {
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        el.textContent = now.toLocaleString("en-US", options);
      } else {
        el.textContent = now.toLocaleTimeString();
      }
    });
  }
  
  updateTime();
  setInterval(updateTime, 1000);
}

// === PROGRESS BAR ===
function initProgressBar() {
  const bar = $('#progress-bar');
  if (!bar) return;
  
  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }
  
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

// === SCROLL TO TOP ===
function initScrollToTop() {
  // Create button if it doesn't exist
  let topBtn = $('#scrollTopBtn');
  if (!topBtn) {
    topBtn = document.createElement('button');
    topBtn.id = 'scrollTopBtn';
    topBtn.className = 'btn btn-primary position-fixed';
    topBtn.style.cssText = 'bottom: 20px; right: 20px; display: none; z-index: 1000;';
    topBtn.innerHTML = '⬆';
    document.body.appendChild(topBtn);
  }

  window.addEventListener('scroll', () => {
    topBtn.style.display = (window.scrollY > 300) ? 'block' : 'none';
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// === SEARCH FUNCTIONALITY ===
function initSearch() {
  const searchInput = $('#search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    $$('.anime-card').forEach(card => {
      const title = card.dataset.title?.toLowerCase() || '';
      card.style.display = title.includes(query) ? '' : 'none';
    });
  });

  const clearBtn = $('#clear-search');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      $$('.anime-card').forEach(card => card.style.display = '');
    });
  }
}

// === FAQ FUNCTIONALITY ===
function initFAQ() {
  // FAQ Search
  const searchBar = $('#searchBar');
  const suggestions = $('#suggestions');
  const faqBlocks = $$('.faq-block');
  
  if (searchBar && suggestions && faqBlocks.length) {
    searchBar.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      suggestions.innerHTML = '';
      suggestions.style.display = 'none';
      
      faqBlocks.forEach(block => {
        const title = block.dataset.title?.toLowerCase() || '';
        const matches = title.includes(query);
        block.style.display = matches ? '' : 'none';
        
        if (matches && query) {
          const li = document.createElement('li');
          li.className = 'suggestion-item';
          li.textContent = block.dataset.title;
          suggestions.appendChild(li);
        }
      });
    });
  }

  // FAQ Accordion
  $$('.faq-question').forEach(question => {
    question.style.cursor = 'pointer';
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      if (!answer || !answer.classList.contains('faq-answer')) return;
      
      const isOpen = answer.style.display === 'block';
      
      // Close all answers
      $$('.faq-answer').forEach(ans => ans.style.display = 'none');
      $$('.faq-question').forEach(q => q.classList.remove('active'));
      
      // Open current if closed
      if (!isOpen) {
        answer.style.display = 'block';
        this.classList.add('active');
      }
    });
  });
}

// === ANIME RATING SYSTEM ===
function initRatingSystem() {
  const storagePrefix = 'animelib:rating:';

  // Restore saved ratings
  $$('.episode-card').forEach(card => {
    const key = storagePrefix + (card.dataset.episodeId || 'unknown');
    const saved = localStorage.getItem(key);
    if (saved) {
      applyRatingToCard(card, parseInt(saved));
    }
  });

  // Star click handler
  document.addEventListener('click', (e) => {
    const star = e.target.closest('.star');
    if (!star) return;
    
    const ratingContainer = star.closest('.rating');
    const card = star.closest('.episode-card');
    if (!ratingContainer || !card) return;

    const selectedRating = parseInt(star.dataset.value);
    applyRatingToCard(card, selectedRating);
    
    const key = storagePrefix + (card.dataset.episodeId || 'unknown');
    localStorage.setItem(key, selectedRating.toString());
  });

  function applyRatingToCard(card, rating) {
    const stars = card.querySelectorAll('.star');
    stars.forEach((star, index) => {
      star.classList.toggle('selected', index < rating);
    });
  }
}

// === ANIMATIONS AND INTERACTIONS ===
function initAnimations() {
  // Image hover effects
  $$('.anime-item img, .anime-card img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.05)';
      img.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });

  // Intersection Observer for cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  });

  $$('.card, .anime-item').forEach(el => observer.observe(el));
}

// === FORM VALIDATION ===
function initForms() {
  // Contact form validation
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const password = $('#password')?.value || '';
      const confirmPassword = $('#confirmPassword')?.value || '';
      const errorMsg = $('#errorMsg');
      
      if (!errorMsg) return;
      
      if (password.length < 6) {
        errorMsg.textContent = 'Password must be at least 6 characters!';
        errorMsg.style.color = 'var(--accent-primary)';
      } else if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match!';
        errorMsg.style.color = 'var(--accent-primary)';
      } else {
        errorMsg.textContent = 'Form submitted successfully!';
        errorMsg.style.color = 'green';
        this.reset();
        
        setTimeout(() => {
          errorMsg.textContent = '';
        }, 3000);
      }
    });
  }

  // Subscribe form
  const subscribeForm = $('#subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Thank you for subscribing!');
      this.reset();
    });
  }
}


  // Add greeting to main content
  const main = $('main');
  if (main && !$('.greeting-message')) {
    const greetingEl = document.createElement('div');
    greetingEl.className = 'greeting-message text-center mb-4';
    greetingEl.innerHTML = `<h3 class="text-warning">${greeting}</h3>`;
    main.prepend(greetingEl);
  }


// === INITIALIZE EVERYTHING WHEN DOM LOADS ===
document.addEventListener('DOMContentLoaded', function() {
  console.log('AnimeLIB - Initializing all features...');
  
  initDateTime();
  initProgressBar();
  initScrollToTop();
  initSearch();
  initFAQ();
  initRatingSystem();
  initAnimations();
  initForms();
  initGreeting();
  
  // Remove duplicate theme buttons
  $$('#themeBtn').forEach((btn, index) => {
    if (index > 0) btn.remove();
  });
});

// Fallback for jQuery code if needed
if (typeof jQuery !== 'undefined') {
  jQuery(document).ready(function($) {
    // jQuery specific code can go here if absolutely necessary
    console.log('jQuery loaded - AnimeLIB ready!');
  });
}
// === THEME SYSTEM (Improved) ===
(function initTheme() {
  const KEY = 'anime_theme';
  const saved = localStorage.getItem(KEY) || 'dark';
  
  function applyTheme(theme) {
    const isDay = theme === 'day';
    document.body.classList.toggle('day-theme', isDay);
    
    // Update theme button
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      const icon = themeBtn.querySelector('.theme-icon');
      const text = themeBtn.querySelector('.theme-text');
      
      if (isDay) {
        icon.textContent = '☀️';
        themeBtn.innerHTML = '<span class="theme-icon">☀️</span> Day';
        themeBtn.classList.remove('btn-outline-danger');
        themeBtn.classList.add('btn-outline-warning');
      } else {
        icon.textContent = '🌙';
        themeBtn.innerHTML = '<span class="theme-icon">🌙</span> Night';
        themeBtn.classList.remove('btn-outline-warning');
        themeBtn.classList.add('btn-outline-danger');
      }
    }
    
    // Update body styles
    document.body.style.backgroundColor = isDay ? '#f5f5f5' : '#121212';
    document.body.style.color = isDay ? '#222' : '#fff';
    
    // Save to localStorage
    localStorage.setItem(KEY, theme);
  }

  // Apply saved theme on page load
  applyTheme(saved);

  // Add event listener to theme button
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.body.classList.contains('day-theme') ? 'day' : 'dark';
      const next = current === 'day' ? 'dark' : 'day';
      applyTheme(next);
      
      // Show notification
      if (typeof showNotification === 'function') {
        showNotification(`Theme switched to ${next === 'day' ? 'Light' : 'Dark'} mode`);
      }
    });
  }
})();