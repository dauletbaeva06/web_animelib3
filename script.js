// === Task 4: Change Background Color / Theme Toggle ===
const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("day-theme");
    if (document.body.classList.contains("day-theme")) {
      themeBtn.textContent = "NIGHT THEME";
    } else {
      themeBtn.textContent = "DAY THEME";
    }
  });
}

// === Task 5: Display Current Date and Time ===
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
    dateTimeElement.innerText = now.toLocaleString("en-US", options);
  }
}

setInterval(updateTime, 1000);
updateTime();

// Popup form open/close logic
const popupForm = document.getElementById('popupForm');
const closePopup = document.getElementById('closePopup');

setTimeout(() => {
  popupForm.style.display = 'flex';
}, 3000); // show popup after 3s

closePopup.addEventListener('click', () => {
  popupForm.style.display = 'none';
});
