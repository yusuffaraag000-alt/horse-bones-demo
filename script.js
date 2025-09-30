
let scene, camera, renderer, controls, model;
const boneList = document.getElementById("boneList");
const boneInfo = document.getElementById("boneInfo");
const backButton = document.getElementById("backButton");
const extraInfo = document.getElementById("extraInfo");

const boneObjects = {};
let boneData = {};

// ------ Initialize Scene ------
function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    document.getElementById("viewer").clientWidth /
    document.getElementById("viewer").clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    document.getElementById("viewer").clientWidth,
    document.getElementById("viewer").clientHeight
  );
  document.getElementById("viewer").appendChild(renderer.domElement);

  addLights();

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 1.0;

  window.addEventListener("resize", onWindowResize);

  // Back button now only resets model visibility/colors
  if (backButton) {
    backButton.addEventListener("click", function(event) {
      event.preventDefault(); // يمنع أي سلوك افتراضي
      resetModel();           // يعيد إظهار العظام
    });
  }

  animate();
}

// ------ Add Lights ------
function addLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const dir = new THREE.DirectionalLight(0xffffff, 1.4);
  dir.position.set(5, 10, 7.5);
  dir.castShadow = true;
  scene.add(dir);

  const point = new THREE.PointLight(0xffffff, 0.9);
  camera.add(point);
  scene.add(camera);
}

// ------ Load Bone JSON Data ------
function loadBoneData() {
  fetch("bones.json")
    .then(res => res.json())
    .then(data => (boneData = data))
    .catch(() => (boneData = {}));
}

// ------ Load 3D Model ------
function loadModel() {
  const loader = new THREE.GLTFLoader();
  loader.load(
    "horse_skeleton.glb",
    gltf => {
      model = gltf.scene;
      enableTransparency(model);
      scene.add(model);
      generateBoneList(model);
    },
    undefined,
    err => console.error("❌ Error loading model:", err)
  );
}

// ------ Enable Transparency for Bones ------
function enableTransparency(root) {
  root.traverse(obj => {
    if (obj.isMesh && obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => { m.transparent = true; m.opacity = 1; });
      } else {
        obj.material.transparent = true;
        obj.material.opacity = 1;
      }
    }
  });
}

// ------ Generate Bone List ------
function generateBoneList(root) {
  boneList.innerHTML = "";

  root.traverse(obj => {
    if (obj.isMesh) {
      const li = document.createElement("li");
      li.textContent = obj.name || "(Unnamed)";
      li.addEventListener("click", () => highlightBone(obj));
      li.addEventListener("dblclick", () => isolateBone(obj));
      boneList.appendChild(li);
      boneObjects[obj.name] = obj;
    }
  });
}

// ------ Highlight a Bone ------
function highlightBone(bone) {
  if (!bone || !model) return;
  resetColors();

  if (bone.material) {
    const newMat = Array.isArray(bone.material)
      ? bone.material.map(m => m.clone())
      : bone.material.clone();

    if (Array.isArray(newMat)) {
      newMat.forEach(m => m.color.set(0xffff00));
    } else {
      newMat.color.set(0xffff00);
    }
    bone.material = newMat;
  }

  showBoneInfo(bone.name);
  showExtraInfo(bone.name);
}

// ------ Isolate a Bone ------
function isolateBone(bone) {
  if (!bone || !model) return;
  model.traverse(obj => {
    if (obj.isMesh) {
      if (obj === bone) fadeIn(obj);
      else fadeOut(obj);
    }
  });
  highlightBone(bone);
}

// ------ Reset Model ------
function resetModel() {
  if (!model) return;
  model.traverse(obj => {
    if (obj.isMesh) {
      fadeIn(obj);
      if (obj.material && obj.material.color) obj.material.color.set(0xffffff);
    }
  });
  boneInfo.innerHTML = "<b>Select a bone from the list</b>";
  extraInfo.classList.add("hidden");
}

// ------ Reset Colors ------
function resetColors() {
  if (!model) return;
  model.traverse(obj => {
    if (obj.isMesh && obj.material && obj.material.color) obj.material.color.set(0xffffff);
  });
}

// ------ Fade Animations using GSAP ------
function fadeOut(obj) {
  gsap.to(obj.material, {
    opacity: 0,
    duration: 0.6,
    onUpdate: () => { obj.visible = obj.material.opacity > 0.01; },
    onComplete: () => { obj.visible = false; }
  });
}

function fadeIn(obj) {
  obj.visible = true;
  gsap.to(obj.material, { opacity: 1, duration: 0.6 });
}

// ------ Show Bone Info ------
function showBoneInfo(boneName) {
  const data = boneData[boneName];
  if (data) {
    boneInfo.innerHTML = `
      <b>${boneName}</b><br>
      ${data.desc || ""}<br>
      ${data.img ? `<img src="${data.img}" alt="${boneName}">` : ""}
    `;
  } else {
    boneInfo.innerHTML = `<b>${boneName}</b><br>No additional data.`;
  }
}

// ------ Show Extra Panel with Links ------
function showExtraInfo(boneName) {
  extraInfo.innerHTML = `
    <b>Links for ${boneName}</b><br>
    <ul>
      <li><a href="#" target="_blank">Link 1</a></li>
      <li><a href="#" target="_blank">Link 2</a></li>
    </ul>
  `;
  extraInfo.classList.remove("hidden");
}

// ------ Window Resize ------
function onWindowResize() {
  camera.aspect =
    document.getElementById("viewer").clientWidth /
    document.getElementById("viewer").clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(
    document.getElementById("viewer").clientWidth,
    document.getElementById("viewer").clientHeight
  );
}

// ------ Animation Loop ------
function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}

// ===== Initialize =====
init();
loadBoneData();
loadModel();
function enterSite() {
  let transition = document.querySelector(".page-transition");
  transition.classList.add("active");

  setTimeout(() => {
    window.location.href = "no.html";
  }, 800); // نفس وقت الـ transition في CSS
}

