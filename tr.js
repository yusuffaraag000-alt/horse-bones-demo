// transition.js

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  body.classList.add("fade-in");

  // دالة تنفيذ الترانزيشن قبل الانتقال
  const transitionToPage = (url) => {
    body.classList.remove("fade-in");
    body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = url;
    }, 600); // وقت الترانزيشن قبل التحويل
  };

  // --- روابط الأزرار في الصفحات المختلفة ---
  const projectBtn = document.querySelector("#startProject");
  const experimentBtn = document.querySelector("#startExperiment");
  const cards = document.querySelectorAll(".card");

  // index.html → no.html
  if (projectBtn) {
    projectBtn.addEventListener("click", (e) => {
      e.preventDefault();
      transitionToPage("no.html");
    });
  }

  // no.html → start.html
  if (experimentBtn) {
    experimentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      transitionToPage("start.html");
    });
  }

  // start.html → أي صفحة أخرى حسب الزر
  if (cards.length > 0) {
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const target = card.getAttribute("onclick")?.match(/'(.*?)'/)?.[1];
        if (target) {
          e.preventDefault();
          transitionToPage(target);
        }
      });
    });
  }
});
