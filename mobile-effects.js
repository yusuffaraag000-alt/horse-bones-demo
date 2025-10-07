// mobile-effects.js
// ✨ تأثيرات احترافية خاصة بالموبايل فقط

document.addEventListener("DOMContentLoaded", () => {
  // نتحقق الأول إن المستخدم على موبايل
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) return; // نوقف الكود لو على كمبيوتر

  console.log("📱 Mobile enhancements active");

  /* ============ 1. تأثير اللمسة الزجاجية ============ */
  document.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const dot = document.createElement("div");
    dot.className = "touch-effect";
    dot.style.left = `${touch.clientX}px`;
    dot.style.top = `${touch.clientY}px`;
    document.body.appendChild(dot);

    setTimeout(() => {
      dot.style.transform = "scale(2)";
      dot.style.opacity = "0";
    }, 10);

    setTimeout(() => dot.remove(), 600);
  });

  /* ============ 2. شاشة تحميل بسيطة ============ */
  const loader = document.createElement("div");
  loader.className = "mobile-loader";
  loader.innerHTML = `<div class="spinner"></div><p>Loading...</p>`;
  document.body.appendChild(loader);

  window.addEventListener("load", () => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 800);
  });
});
