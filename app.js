// app.js

// ====================
// 🎥 إعداد المشهد والكاميرا والرندر
// ====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020314);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById("container").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ====================
// 💡 الإضاءة العلمية
// ====================
scene.add(new THREE.AmbientLight(0xffffff, 0.45));

const light1 = new THREE.DirectionalLight(0xffffff, 0.6);
light1.position.set(5, 10, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0x00bfff, 0.5);
light2.position.set(0, 3, 5);
scene.add(light2);

// ====================
// 🐴 تحميل الموديل
// ====================
const loader = new THREE.GLTFLoader();
let horseModel;
loader.load(
  "horse body.glb",
  function (gltf) {
    horseModel = gltf.scene;
    horseModel.scale.set(1, 1, 1);
    horseModel.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.1;
        child.material.roughness = 0.7;
      }
    });
    scene.add(horseModel);
    prepareSidebar(horseModel);
  },
  undefined,
  function (error) {
    console.error("حدث خطأ أثناء تحميل الموديل:", error);
  }
);

// ====================
// 🧠 تفاعل مع الأجزاء
// ====================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const label = document.getElementById("label");

const ignoredParts = ["body", "horse body", "body_of_horse"];
let lastSelected = null;
let lastOriginalColor = null;
let glowIntensity = 0;

// تحديد جزء معين
function selectPart(obj) {
  if (!obj || ignoredParts.includes(obj.name)) return;

  // رجع الجزء السابق للونه الأصلي
  if (lastSelected && lastOriginalColor) {
    lastSelected.material.color.copy(lastOriginalColor);
  }

  // تخزين اللون الأصلي وتطبيق لون مميز
  if (obj.material) {
    obj.material = obj.material.clone();
    lastOriginalColor = obj.material.color.clone();
    obj.material.color.set(0xff0033);
  }

  lastSelected = obj;

  // عرض الاسم
  label.textContent = obj.name;
  label.style.display = "block";
  highlightSidebarItem(obj.name);
}

// عند الضغط على الموديل
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
// 📋 إعداد القائمة الجانبية
// ====================
function prepareSidebar(model) {
  const sidebarList = document.querySelector("#sidebar ul");
  model.traverse((child) => {
    if (child.isMesh && !ignoredParts.includes(child.name)) {
      const li = document.createElement("li");
      li.textContent = child.name;
      li.dataset.partName = child.name;
      li.addEventListener("click", () => selectPart(child));
      sidebarList.appendChild(li);
    }
  });
}

function highlightSidebarItem(partName) {
  document.querySelectorAll("#sidebar li").forEach((item) => {
    item.style.background =
      item.dataset.partName === partName
        ? "rgba(255, 0, 50, 0.4)"
        : "transparent";
  });
}

// ====================
// 🧭 زرار Parts
// ====================
const toggleButton = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleButton.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// ====================
// ⚙️ ضبط الحجم
// ====================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ====================
// 🔁 الأنيميشن
// ====================
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // دوران بسيط للموديل لما المستخدم سايب الماوس
  if (horseModel && !controls.userIsInteracting) {
    horseModel.rotation.y += 0.001;
  }

  renderer.render(scene, camera);
}
animate();
