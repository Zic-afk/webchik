import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { createMarbleInteraction } from './marbleInteraction.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);
const status = document.createElement('div');
status.className = 'status';
status.textContent = '\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 girl.glb...';
document.body.append(status);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.append(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#171b23');
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.01, 100);
camera.position.set(0, 0, 4);
const cameraRig = new THREE.Group();
cameraRig.add(camera);
scene.add(cameraRig);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// Wheel and vertical touch gestures scroll the document.
controls.enableZoom = false;
controls.enablePan = false;
scene.add(new THREE.HemisphereLight(0xdceaff, 0x625249, 3));
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(3, 5, 4);
scene.add(light);
const pivot = new THREE.Group();
scene.add(pivot);
// Scroll rotates the parent; ambient movement affects the whole model together.
const sway = new THREE.Group();
pivot.add(sway);
let elapsed = 0;
let rotationTween;
let disposed = false;
const interaction = createMarbleInteraction(scene, camera, renderer);
let environmentTarget;
async function loadEnvironment() {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  let texture;
  try {
    texture = await new EXRLoader().loadAsync('/studio_kontrast_04_1k.exr');
    if (disposed) return;
    environmentTarget = pmrem.fromEquirectangular(texture);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.65;
  } catch (error) {
    console.error('HDR environment could not be loaded', error);
  } finally {
    texture?.dispose();
    pmrem.dispose();
  }
}
loadEnvironment();

async function start() {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const model = (await loader.loadAsync('/girl.glb')).scene;
  if (disposed) return;
  sway.add(model);
  const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
  model.scale.multiplyScalar(2 / Math.max(size.x, size.y, size.z));
  model.position.sub(new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3()));

  model.traverse(object => { if (object.isMesh) interaction.apply(object); });
  rotationTween = gsap.to(pivot.rotation, {
    y: Math.PI * 2,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  ScrollTrigger.refresh();
  status.textContent = '\u0414\u0432\u0438\u0433\u0430\u0439\u0442\u0435 \u043a\u0443\u0440\u0441\u043e\u0440\u043e\u043c \u043f\u043e \u0441\u0442\u0430\u0442\u0443\u0435. Scroll to rotate';
}
start().catch(error => { console.error(error); status.textContent = `GLB: ${error.message}`; });
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  elapsed += dt;
  // Rigid motion preserves the spacing between the body and clothing.
  sway.rotation.z = Math.sin(elapsed * 0.65) * 0.024;
  sway.rotation.x = Math.sin(elapsed * 0.45) * 0.012;
  sway.position.y = Math.sin(elapsed * 0.9) * 0.01;
  cameraRig.position.x = Math.sin(elapsed * 0.23) * 0.012;
  cameraRig.position.y = Math.sin(elapsed * 0.31) * 0.006;
  light.position.set(
    3 + Math.sin(elapsed * 0.35) * 0.45,
    5 + Math.sin(elapsed * 0.27) * 0.15,
    4 + Math.sin(elapsed * 0.3) * 0.3,
  );
  controls.update();
  scene.updateMatrixWorld(true);
  interaction.update(dt, elapsed);
  renderer.render(scene, camera);
});
function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
}
window.addEventListener('resize', resize);
if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true;
  rotationTween?.scrollTrigger?.kill();
  rotationTween?.kill();
  window.removeEventListener('resize', resize);
  renderer.setAnimationLoop(null);
  controls.dispose();
  interaction.dispose();
  environmentTarget?.dispose();
  scene.traverse(object => {
    if (!object.isMesh) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach(material => material.dispose());
  });
  renderer.dispose();
  renderer.domElement.remove();
  status.remove();
});
