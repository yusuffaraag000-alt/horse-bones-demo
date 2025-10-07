// enhancer.js — شاشة تحميل احترافية مستقلة
(function() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "radial-gradient(circle at center, #001220, #000)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.color = "#00ffff";
  overlay.style.fontSize = "1.5rem";
  overlay.style.fontFamily = "Poppins, sans-serif";
  overlay.style.zIndex = 99999;
  overlay.innerHTML = `<div class="loader-text">Nwe Update.....</div>`;
  document.body.appendChild(overlay);

  // أنيميشن خفيفة
  overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1500, delay: 800 });
  setTimeout(() => overlay.remove(), 2300);
})();
