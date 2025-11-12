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
$(document).ready(function () {
  console.log("script2.js connected successfully!");

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

  // === Scroll To Top ===
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 200) {
      $("#scrollTopBtn").fadeIn();
    } else {
      $("#scrollTopBtn").fadeOut();
    }
  });
  $("#scrollTopBtn").click(() => $("html, body").animate({ scrollTop: 0 }, 600));

  // === Toast Notifications ===
  function showToast(message) {
    const toast = $('<div class="toast"></div>').text(message);
    $("#toast-container").append(toast);
    toast.fadeIn(200);
    setTimeout(() => toast.fadeOut(400, () => toast.remove()), 1500);
  }

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

  // === Lazy Load Images ===
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
$(document).ready(function () {
  $("#readMoreBtn").on("click", function () {
    $("#extraInfo").slideToggle(500); // плавно показывает/скрывает текст
    const isVisible = $("#extraInfo").is(":visible");

    // меняем надпись кнопки
    if (isVisible) {
      $(this).text("Read Less");
    } else {
      $(this).text("Read More");
    }
  });
});
// ===== REVIEWS PAGE SPECIFIC FUNCTIONALITY =====

function initReviewsPage() {
    // Проверяем что мы на странице reviews
    if (!document.getElementById('reviewForm')) {
        return; // Не выполняем код если не на странице reviews
    }

    console.log('🎌 Reviews page scripts loaded');

    // ---------- Form validation + asynchronous submit ----------
    const reviewForm = document.getElementById("reviewForm");
    const reviewsRow = document.getElementById("reviewsRow");
    const extraControls = document.getElementById("extraControls");

    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();
            reviewForm.querySelectorAll(".error-msg").forEach(el => el.remove());
            let valid = true;
            const title = document.getElementById("animeTitle");
            const reviewText = document.getElementById("animeReview");

            [title, reviewText].forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    const error = document.createElement("small");
                    error.textContent = "This field is required.";
                    error.classList.add("text-warning", "error-msg");
                    input.parentNode.appendChild(error);
                }
            });
            if (!valid) return;

            const col = document.createElement("div");
            col.className = "col-lg-4 col-md-6 col-sm-12";
            col.innerHTML = `
                <div class="card bg-secondary text-light h-100">
                    <div class="card-body">
                        <h5 class="card-title text-warning">${escapeHtml(title.value)}</h5>
                        <p><strong>Rating:</strong> ${escapeHtml(document.getElementById("animeRating").value)}</p>
                        <p class="card-text">${escapeHtml(reviewText.value)}</p>
                    </div>
                </div>`;
            if (reviewsRow) reviewsRow.prepend(col);

            // Simulate API call
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title: title.value,
                    body: reviewText.value
                }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(() => {
                alert("✅ Thank you! Your review has been submitted successfully.");
                reviewForm.reset();
            })
            .catch(() => alert("❌ Error sending review."));
        });
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;', 
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    // ---------- FAQ Section ----------
    const faqs = [
        { q: "What is AnimeLIB?", a: "AnimeLIB is a fan-made anime database for reviews and recommendations." },
        { q: "Is it free to use?", a: "Yes! All features are completely free." },
        { q: "Can I submit my own reviews?", a: "Absolutely. Just fill out the review form above!" }
    ];

    const faqContainer = document.createElement("div");
    faqContainer.className = "faq-section mt-5";
    faqs.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("border", "border-warning", "p-3", "mb-2", "rounded", "faq-item", "bg-dark");
        div.innerHTML = `<h5 class="text-warning">${item.q}</h5><p class="text-light answer" style="display:none;">${item.a}</p>`;
        faqContainer.appendChild(div);
    });

    const main = document.querySelector("main");
    if (main) {
        main.appendChild(faqContainer);
        
        // Add FAQ click handlers
        faqContainer.querySelectorAll(".faq-item h5").forEach(q => {
            q.style.cursor = 'pointer';
            q.addEventListener("click", () => {
                const answer = q.nextElementSibling;
                answer.style.display = answer.style.display === "none" ? "block" : "none";
            });
        });
    }

    // ---------- Popup subscription ----------
    if (extraControls) {
        const popupBtn = document.createElement("button");
        popupBtn.id = "subscribeBtn";
        popupBtn.textContent = "Subscribe";
        popupBtn.className = "btn btn-warning mt-4 w-100";
        extraControls.appendChild(popupBtn);

        const popup = document.createElement("div");
        popup.innerHTML = `
            <div id="popupOverlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.85); z-index:2000; justify-content:center; align-items:center;">
                <div style="background:#222; padding:20px; border-radius:10px; width:320px; text-align:center;">
                    <h5 class="text-warning">Subscribe to AnimeLIB</h5>
                    <input type="email" id="emailInput" class="form-control mb-3" placeholder="Enter your email">
                    <button id="submitEmail" class="btn btn-danger w-100 mb-2">Submit</button>
                    <button id="closePopup" class="btn btn-outline-warning w-100">Close</button>
                </div>
            </div>`;
        document.body.appendChild(popup);

        const popupOverlay = document.getElementById("popupOverlay");
        if (popupOverlay) {
            document.getElementById("subscribeBtn").addEventListener("click", () => popupOverlay.style.display = "flex");
            document.getElementById("closePopup").addEventListener("click", () => popupOverlay.style.display = "none");
            document.getElementById("submitEmail").addEventListener("click", () => {
                const email = document.getElementById("emailInput").value;
                if (email && email.includes("@")) {
                    alert("✅ Subscribed successfully!");
                    popupOverlay.style.display = "none";
                } else {
                    alert("⚠️ Please enter a valid email address.");
                }
            });
        }
    }

    // ---------- Background changer ----------
    let currentColor = 0;
    const colors = ["#000000", "#111111", "#1a1a1a", "#2c003e", "#3b0a45", "#5e1742"];
    
    if (extraControls) {
        const colorBtn = document.createElement("button");
        colorBtn.textContent = "Change Background";
        colorBtn.className = "btn btn-outline-warning w-100 mt-3";
        extraControls.appendChild(colorBtn);
        
        colorBtn.addEventListener("click", () => {
            currentColor = (currentColor + 1) % colors.length;
            document.body.style.transition = "background 0.5s";
            document.body.style.background = colors[currentColor];
        });
    }

    // ---------- Time display ----------
    if (extraControls) {
        const dateBlock = document.createElement("div");
        dateBlock.className = "text-center mt-4 p-2 border border-warning rounded";
        dateBlock.innerHTML = `<strong class="text-warning">Current Time:</strong> <span id="currentTime" class="text-light"></span>`;
        extraControls.appendChild(dateBlock);
        
        function updateTime() {
            const now = new Date();
            const timeElement = document.getElementById("currentTime");
            if (timeElement) {
                timeElement.textContent = now.toLocaleString("en-US", {
                    dateStyle: "long", timeStyle: "short"
                });
            }
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    // ---------- Keyboard shortcuts ----------
    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        const activeEl = document.activeElement;
        // prevent shortcuts when typing in inputs/textareas
        if (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") return;
        
        if (key === "b") {
            currentColor = (currentColor + 1) % colors.length;
            document.body.style.background = colors[currentColor];
        } else if (key === "s") {
            const popupOverlay = document.getElementById("popupOverlay");
            if (popupOverlay) popupOverlay.style.display = "flex";
        } else if (key === "t") {
            alert("Current time: " + new Date().toLocaleTimeString());
        }
    });

    // ---------- jQuery functionality ----------
    if (typeof jQuery !== 'undefined') {
        $(document).ready(function($) {
            console.log("jQuery ready on reviews page");

            // TASK 1: Real-time Search
            const searchBar = $('<input type="text" id="searchBar" placeholder="Search anime reviews..." class="form-control my-4">');
            $("main").prepend(searchBar);
            
            $("#searchBar").on("keyup input", function(event) {
                event.stopPropagation();
                let value = $(this).val().toLowerCase();
                $("#reviewsRow .card").filter(function() {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                });
            });

            // TASK 2: Autocomplete
            const animeList = ["Attack on Titan", "Naruto", "Demon Slayer", "Jujutsu Kaisen", "One Piece", "Bleach", "Death Note", "Spy x Family"];
            const suggestionBox = $('<div id="suggestions" class="bg-dark text-warning p-2 rounded mt-1" style="display:none; position:absolute; z-index:1000;"></div>');
            $("#searchBar").after(suggestionBox);
            
            $("#searchBar").on("input", function() {
                const val = $(this).val().toLowerCase();
                suggestionBox.empty();
                if (val.length > 0) {
                    const matches = animeList.filter(item => item.toLowerCase().includes(val));
                    if (matches.length > 0) {
                        matches.forEach(match => suggestionBox.append(`<div class="suggest-item">${match}</div>`));
                        suggestionBox.show();
                    } else suggestionBox.hide();
                } else suggestionBox.hide();
            });
            
            $(document).on("click", ".suggest-item", function() {
                $("#searchBar").val($(this).text());
                suggestionBox.hide();
                $("#searchBar").trigger("keyup");
            });
            
            $(document).click(function(e) {
                if (!$(e.target).closest("#searchBar, #suggestions").length) suggestionBox.hide();
            });

            // TASK 3: Search Highlight
            $("#searchBar").on("keyup", function() {
                let term = $(this).val();
                $(".card-text").each(function() {
                    let text = $(this).text();
                    if (term.length > 0) {
                        let regex = new RegExp("(" + term + ")", "gi");
                        $(this).html(text.replace(regex, "<span style='background-color:yellow; color: black;'>$1</span>"));
                    } else $(this).text(text);
                });
            });

            // TASK 5: Counter
            const statsSection = $(`
                <section class="text-center my-5">
                    <h3 class="text-warning">Our Achievements</h3>
                    <div class="row justify-content-center">
                        <div class="col-md-3"><h2 class="counter text-warning" data-count="2000">0</h2><p>Users</p></div>
                        <div class="col-md-3"><h2 class="counter text-warning" data-count="250">0</h2><p>Reviews</p></div>
                        <div class="col-md-3"><h2 class="counter text-warning" data-count="50">0</h2><p>Anime Titles</p></div>
                    </div>
                </section>`);
            $("main").append(statsSection);
            
            function animateCounters() {
                $(".counter").each(function() {
                    let $this = $(this);
                    let countTo = $this.attr("data-count");
                    $({ countNum: $this.text() }).animate({ countNum: countTo }, {
                        duration: 2000, 
                        easing: "swing",
                        step: function() { $this.text(Math.floor(this.countNum)); },
                        complete: function() { $this.text(this.countNum + "+"); }
                    });
                });
            }
            animateCounters();

            // TASK 6: Spinner on Submit
            $("#reviewForm").on("submit", function(e) {
                // Allow the native form submission to happen first
                setTimeout(() => {
                    const submitBtn = $("#reviewForm button[type='submit']");
                    if (submitBtn.length) {
                        submitBtn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm"></span> Please wait…');
                        setTimeout(function() {
                            submitBtn.prop("disabled", false).text("Submit Review");
                            showToast("✅ Review submitted successfully!");
                        }, 2000);
                    }
                }, 100);
            });

            // TASK 7: Toast
            $("body").append('<div id="toast-container"></div>');
            function showToast(message) {
                const toast = $('<div class="toast">'+ message +'</div>');
                $("#toast-container").append(toast);
                toast.fadeIn(400).delay(2000).fadeOut(400, function(){ $(this).remove(); });
            }

            // TASK 8: Copy to Clipboard
            const snippet = $('<div class="bg-secondary p-3 mt-5 rounded"><code id="copyText">console.log("Hello AnimeLIB");</code> <button id="copyBtn" class="btn btn-outline-warning btn-sm ms-2">Copy</button></div>');
            $("main").append(snippet);
            
            $("#copyBtn").on("click", function() {
                const text = $("#copyText").text();
                navigator.clipboard.writeText(text).then(() => {
                    $(this).text("✔ Copied!");
                    showToast("Copied to clipboard!");
                    setTimeout(() => $(this).text("Copy"), 1500);
                });
            });

            
        });
    }
}

// Initialize reviews page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initReviewsPage();
});
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