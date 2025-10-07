// app.js - Interactive skeleton viewer (highlight, isolate, reset, and name label)

let scene, camera, renderer, controls, model;
const container = document.getElementById("viewer") || document.getElementById("container");
const boneListEl = document.getElementById("boneList");
const toggleButton = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const backButton = document.getElementById("backButton"); // ✅ زرار العودة

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;
let selected = null;
let nameSprite = null;
let userIsInteracting = false;
let idleRotateTimeout = null;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020314);

  camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  renderer.domElement.addEventListener("pointerdown", () => {
    userIsInteracting = true;
    if (idleRotateTimeout) clearTimeout(idleRotateTimeout);
  });
  window.addEventListener("pointerup", () => {
    if (idleRotateTimeout) clearTimeout(idleRotateTimeout);
    idleRotateTimeout = setTimeout(() => (userIsInteracting = false), 1200);
  });

  window.addEventListener("resize", onWindowResize);

  addLights();

  if (toggleButton && sidebar)
    toggleButton.addEventListener("click", () => sidebar.classList.toggle("active"));

  // ✅ زرار الرجوع لإرجاع الهيكل بالكامل
  if (backButton) {
    backButton.addEventListener("click", resetModel);
  }

  createBoneLabel();
  animate();
}

/* ✅ الإضاءة المحسّنة */
function addLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(6, 10, 6);
  scene.add(key);

  const fill = new THREE.PointLight(0x00bfff, 0.5);
  fill.position.set(-3, 2, 4);
  scene.add(fill);
}

/* تحميل النموذج */
function loadModel(url = "horse_skeleton.glb") {
  const loader = new THREE.GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      model = gltf.scene;
      model.traverse((c) => {
        if (c.isMesh) {
          c.material = c.material.clone();
          c.material.transparent = true;
          c.material.opacity = 1;
          c.material.emissive = new THREE.Color(0x000000);
          c.material.userData._origColor = c.material.color.clone();
        }
      });
      scene.add(model);
      generateBoneList(model);
    },
    undefined,
    (err) => console.error("Model load error:", err)
  );
}

/* إنشاء القائمة */
function generateBoneList(root) {
  if (!boneListEl) return;
  boneListEl.innerHTML = "";
  root.traverse((child) => {
    if (child.isMesh) {
      const li = document.createElement("li");
      li.textContent = child.name || "(unnamed)";
      li.addEventListener("click", () => highlightMesh(child));
      li.addEventListener("dblclick", () => isolateBone(child));
      boneListEl.appendChild(li);
    }
  });
}

/* ✅ دالة إعادة الهيكل بالكامل */
function resetModel() {
  if (!model) return;
  model.traverse((m) => {
    if (m.isMesh && m.material) {
      gsap.to(m.material.color, {
        r: m.material.userData._origColor.r,
        g: m.material.userData._origColor.g,
        b: m.material.userData._origColor.b,
        duration: 0.4,
      });
      gsap.to(m.material, { opacity: 1, duration: 0.4 });
    }
  });
  selected = null;
  updateBoneLabel("");
}

/* تنظيف التحديد */
function clearSelection() {
  if (!model) return;
  model.traverse((m) => {
    if (m.isMesh && m.material) {
      gsap.to(m.material.color, {
        r: m.material.userData._origColor.r,
        g: m.material.userData._origColor.g,
        b: m.material.userData._origColor.b,
        duration: 0.3,
      });
      gsap.to(m.material, { opacity: 1, emissiveIntensity: 0, duration: 0.3 });
    }
  });
  selected = null;
  updateBoneLabel("");
}

/* ✅ التلوين باللون الأزرق الزجاجي */
function highlightMesh(mesh) {
  if (!mesh || !mesh.material) return;
  clearSelection();

  gsap.to(mesh.material.color, { r: 0.2, g: 0.8, b: 1.0, duration: 0.4 });
  gsap.to(mesh.material, { opacity: 0.6, duration: 0.4 });
  mesh.material.emissive = new THREE.Color(0x00bfff);
  gsap.to(mesh.material, { emissiveIntensity: 0.7, duration: 0.3 });

  selected = mesh;
  updateBoneLabel(mesh.name);
}

/* ✅ إنشاء العنصر اللي هيظهر فيه اسم العظمة */
function createBoneLabel() {
  const labelDiv = document.createElement("div");
  labelDiv.id = "boneNameLabel";
  labelDiv.style.position = "absolute";
  labelDiv.style.top = "50px";
  labelDiv.style.right = "30px";
  labelDiv.style.padding = "10px 18px";
  labelDiv.style.background = "rgba(0, 191, 255, 0.12)";
  labelDiv.style.border = "1px solid rgba(0, 191, 255, 0.4)";
  labelDiv.style.color = "#00bfff";
  labelDiv.style.fontSize = "22px";
  labelDiv.style.fontFamily = "Arial, sans-serif";
  labelDiv.style.fontWeight = "600";
  labelDiv.style.borderRadius = "12px";
  labelDiv.style.backdropFilter = "blur(6px)";
  labelDiv.style.boxShadow = "0 0 10px rgba(0,191,255,0.4)";
  labelDiv.style.transition = "opacity 0.3s ease";
  labelDiv.style.opacity = "0";
  labelDiv.style.pointerEvents = "none";
  container.appendChild(labelDiv);
}

/* ✅ تحديث الاسم الظاهر */
function updateBoneLabel(name) {
  const label = document.getElementById("boneNameLabel");
  if (!label) return;
  if (name && name.trim() !== "") {
    label.textContent = name;
    label.style.opacity = "1";
  } else {
    label.style.opacity = "0";
  }
}

/* ✅ العظمة فقط تظهر والباقي يختفي جزئي */
function isolateBone(mesh) {
  if (!model) return;
  model.traverse((m) => {
    if (m.isMesh) {
      if (m === mesh) {
        gsap.to(m.material, { opacity: 1, duration: 0.4 });
      } else {
        gsap.to(m.material, { opacity: 0.05, duration: 0.4 });
      }
    }
  });
  highlightMesh(mesh);
}

/* التقاط الضغط */
function onClick(e) {
  if (!model) return;
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(model.children, true);
  if (intersects.length > 0) {
    const clickedBone = intersects[0].object;
    highlightMesh(clickedBone);
  }
}

/* ✅ الضغط المزدوج للعزل */
function onDoubleClick(e) {
  if (!model) return;
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(model.children, true);
  if (intersects.length > 0) {
    const clickedBone = intersects[0].object;
    isolateBone(clickedBone);
  }
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (model && !userIsInteracting) {
    model.rotation.y += 0.001;
  }
  renderer.render(scene, camera);
}

init();
loadModel();
renderer.domElement.addEventListener("click", onClick);
renderer.domElement.addEventListener("dblclick", onDoubleClick);
