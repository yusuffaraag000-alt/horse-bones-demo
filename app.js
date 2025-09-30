// app.js

// إنشاء المشهد والكاميرا والرندر
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022); // خلفية أزرق غامق

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// أداة التحكم OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ====================
// 🔆 الإضـــــاءة
// ====================
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

// فوق
const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight1.position.set(5, 10, 5);
scene.add(dirLight1);

// يمين/خلف
const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight2.position.set(-5, 10, -5);
scene.add(dirLight2);

// قدام
const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight3.position.set(0, 5, 10);
scene.add(dirLight3);

// ورا
const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight4.position.set(0, 5, -10);
scene.add(dirLight4);

// تحت (إضاءة من تحت لفوق)
const dirLightBottom = new THREE.DirectionalLight(0xffffff, 0.6);
dirLightBottom.position.set(0, -5, 0);
scene.add(dirLightBottom);

// PointLight تحت الموديل
const pointLightBottom = new THREE.PointLight(0xffffff, 0.4);
pointLightBottom.position.set(0, -3, 0);
scene.add(pointLightBottom);

// ====================
// 📦 تحميل موديل الحصان
// ====================
const loader = new THREE.GLTFLoader();
let horseModel;
loader.load("horse body.glb", function (gltf) {
  horseModel = gltf.scene;
  scene.add(horseModel);

  // بعد التحميل: جهز القائمة الجانبية
  prepareSidebar(horseModel);
});

// ====================
// 🎯 التفاعل مع الأجزاء
// ====================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const label = document.getElementById("label");

// أسماء الأجزاء اللي ملغية التفاعل
const ignoredParts = ["body", "horse body", "body of horse", "body_of_horse"];

// تخزين الجزء اللي تم الضغط عليه آخر مرة
let lastSelected = null;
let lastOriginalColor = null;

// وظيفة تلوين جزء معين
function selectPart(obj) {
  if (!obj || ignoredParts.includes(obj.name)) return;

  // رجّع آخر جزء للونه الأصلي
  if (lastSelected && lastSelected.material && lastOriginalColor) {
    lastSelected.material.color.copy(lastOriginalColor);
  }

  // انسخ الماتريال وخزّن اللون الأصلي
  if (obj.material) {
    obj.material = obj.material.clone();
    lastOriginalColor = obj.material.color.clone();
    obj.material.color.set(0xff0000);
  }

  // خزن الجزء الحالي كآخر جزء
  lastSelected = obj;

  // اعرض الاسم
  label.textContent = obj.name;
  label.style.display = "block";

  // حدّد العنصر في القائمة
  highlightSidebarItem(obj.name);
}

// الكليك بالماوس على الحصان
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    selectPart(obj);
  }
});

// ====================
// 📋 القائمة الجانبية
// ====================
function prepareSidebar(model) {
  const sidebar = document.getElementById("sidebar").querySelector("ul");
  const parts = [];

  model.traverse((child) => {
    if (child.isMesh && !ignoredParts.includes(child.name)) {
      parts.push(child);
    }
  });

  // بناء عناصر القائمة
  parts.forEach((part) => {
    const li = document.createElement("li");
    li.textContent = part.name;
    li.dataset.partName = part.name;

    li.addEventListener("click", () => {
      selectPart(part);
    });

    sidebar.appendChild(li);
  });
}

// تمييز الجزء المحدد في القائمة
function highlightSidebarItem(partName) {
  const items = document.querySelectorAll("#sidebar li");
  items.forEach((item) => {
    if (item.dataset.partName === partName) {
      item.style.background = "rgba(255, 0, 0, 0.3)";
    } else {
      item.style.background = "transparent";
    }
  });
}

// ====================
// 🔘 زرار Parts لفتح/غلق القائمة
// ====================
const toggleButton = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleButton.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// ====================
// 📏 تحديث الحجم
// ====================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ====================
// 🎬 حلقة الأنيميشن
// ====================
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();