// enhancer.js — مؤشر احترافي متفاعل
(function() {
  const circle = document.createElement("div");
  circle.style.position = "fixed";
  circle.style.width = "40px";
  circle.style.height = "40px";
  circle.style.border = "2px solid rgba(0, 200, 255, 0.6)";
  circle.style.borderRadius = "50%";
  circle.style.pointerEvents = "none";
  circle.style.transition = "transform 0.15s ease-out, opacity 0.3s";
  circle.style.zIndex = 9999;
  document.body.appendChild(circle);

  document.addEventListener("mousemove", e => {
    circle.style.left = e.clientX - 20 + "px";
    circle.style.top = e.clientY - 20 + "px";
  });

  // تأثير عند المرور على العناصر التفاعلية
  ["button", "a", ".card", "li"].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener("mouseenter", () => {
        circle.style.transform = "scale(1.8)";
        circle.style.borderColor = "rgba(0,255,180,0.9)";
      });
      el.addEventListener("mouseleave", () => {
        circle.style.transform = "scale(1)";
        circle.style.borderColor = "rgba(0,200,255,0.6)";
      });
    });
  });
})();
