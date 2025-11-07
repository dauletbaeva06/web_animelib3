
    // === BACK TO TOP BUTTON ===
    const toTop = document.createElement("button");
    toTop.innerHTML = "⬆";
    toTop.id = "toTopBtn";
    document.body.appendChild(toTop);

    window.addEventListener("scroll", () => {
      toTop.style.display = window.scrollY > 300 ? "block" : "none";
    });

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // === POPUP HANDLING ===
    const openPopup = document.getElementById("openPopup");
    const closePopup = document.getElementById("closePopup");
    const popupForm = document.getElementById("popupForm");
    const subscribeBtn = document.getElementById("subscribeBtn");

    openPopup.addEventListener("click", () => popupForm.classList.remove("d-none"));
    closePopup.addEventListener("click", () => popupForm.classList.add("d-none"));
    subscribeBtn.addEventListener("click", () => {
      const email = document.getElementById("popupEmail").value;
      if (email) {
        alert("Thank you for subscribing, " + email + "!");
        popupForm.classList.add("d-none");
      } else {
        alert("Please enter your email first!");
      }
    });
  
      const navLinks = document.querySelectorAll('.nav-link');
  let currentIndex = 0;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % navLinks.length;
      navLinks[currentIndex].focus();
    } else if (event.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
      navLinks[currentIndex].focus();
    }
  });

    document.getElementById('timeBtn').addEventListener('click', () => {
    const currentTime = new Date().toLocaleTimeString();
    document.getElementById('timeDisplay').textContent = "Current Time: " + currentTime;
    });
    // === SCROLL ANIMATION FOR CARDS ===
    const cards = document.querySelectorAll(".card");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("border", "border-warning", "shadow-lg");
          observer.unobserve(entry.target);
        }
      });
    });
    cards.forEach((card) => observer.observe(card));

    // === LIVE CLOCK IN FOOTER ===
    function updateDate() {
      const now = new Date();
      document.getElementById('currentDate').textContent =
        "Current Date and Time: " + now.toLocaleString('en-GB');
    }
    updateDate();
    setInterval(updateDate, 1000);

    const hour = new Date().getHours();
  let greeting;
  switch (true) {
    case (hour < 12):
      greeting = "🌅 Good morning, dear visitor!";
      break;
    case (hour < 18):
      greeting = "🌞 Good afternoon!";
      break;
    default:
      greeting = "🌙 Good evening!";
    }
    const greetingElement = document.createElement("p");
    greetingElement.className = "text-center text-warning mt-4";
    greetingElement.textContent = greeting;
    document.querySelector("section").prepend(greetingElement);