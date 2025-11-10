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
