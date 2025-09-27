document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector(".enter-button");

  if (startBtn) {
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // إضافة كلاس أنيميشن خروج
      document.body.classList.add("page-exit");

      // بعد الانيميشن ينتقل للتانية
      setTimeout(() => {
        window.location.href = "viewer.html";
      }, 500); // لازم يكون مساوي لمدة الأنيميشن في CSS
    });
  }
});