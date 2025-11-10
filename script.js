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
$(document).ready(function () {
  console.log("jQuery ready!");

  // === Scroll Progress Bar ===
  function updateProgress() {
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const pct = (scrollTop / docHeight) * 100;
    $("#scroll-progress").css("width", pct + "%");
  }
  $(window).on("scroll resize", updateProgress);
  updateProgress();

  // === Theme Switcher ===
  $("#toggleThemeBtn").on("click", function () {
    $("body").toggleClass("dark-theme light-theme");
  });

  // === Show Current Time ===
  $("#timeBtn").on("click", function () {
    const now = new Date();
    $("#currentTime").text("Current time: " + now.toLocaleTimeString());
  });

  // === Scroll To Top Button ===
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 200) {
      $("#scrollTopBtn").fadeIn();
    } else {
      $("#scrollTopBtn").fadeOut();
    }
  });
  $("#scrollTopBtn").click(() => $("html, body").animate({ scrollTop: 0 }, 600));

  // === Toast Notification ===
  function showToast(message) {
    const toast = $('<div class="toast"></div>').text(message);
    $("#toast-container").append(toast);
    toast.fadeIn(200);
    setTimeout(() => toast.fadeOut(400, () => toast.remove()), 1500);
  }

  // === Add to Cart Toast ===
  $(".add-cart").on("click", function () {
    showToast("Item added to cart!");
  });

  // === Search Filter ===
  $("#search-input").on("keyup", function () {
    const q = $(this).val().toLowerCase();
    $(".anime-card").each(function () {
      const title = $(this).data("title").toLowerCase();
      $(this).toggle(title.includes(q));
    });
  });
  $("#clear-search").click(() => $("#search-input").val("").keyup());

  // === Animated Counters ===
  function animateCounters() {
    $(".num").each(function () {
      const el = $(this);
      const target = parseInt(el.attr("data-target"));
      if (!el.data("done") && el.offset().top < $(window).scrollTop() + window.innerHeight) {
        el.data("done", true);
        $({ countNum: 0 }).animate({ countNum: target }, {
          duration: 1500,
          easing: "swing",
          step: function () {
            el.text(Math.floor(this.countNum));
          },
          complete: function () {
            el.text(target);
          }
        });
      }
    });
  }
  $(window).on("scroll", animateCounters);
  animateCounters();

  // === Lazy Loading Images ===
  function lazyLoad() {
    $(".lazy").each(function () {
      const img = $(this);
      if (img.offset().top < $(window).scrollTop() + window.innerHeight && !img.attr("src")) {
        img.attr("src", img.data("src"));
      }
    });
  }
  $(window).on("scroll", lazyLoad);
  lazyLoad();
});
