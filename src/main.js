import './style.css'
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/index.js'
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger.js'
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.mjs'

gsap.registerPlugin(ScrollTrigger)

document.querySelector('#app').innerHTML = `
  <canvas class="scene" aria-label="Интерактивная 3D-модель кроссовка Nike"></canvas>
  <header class="topbar"><a class="wordmark" href="#home" aria-label="Nike — на главную">NIKE<span>®</span></a><nav><a href="#story">История</a><a href="#contact">Контакты</a></nav><a class="menu-cta" href="#contact">Связаться <span>↗</span></a></header>
  <main>
    <section class="hero section" id="home">
      <div class="hero-copy">
        <div class="eyebrow"><span class="live-dot"></span> NEXT IN MOTION <span>— 2025 / 01</span></div>
        <div class="hero-title-wrap"><h1>Твоя скорость<br><span>Твой стиль</span></h1><div class="hero-index">01<br><i>—</i><br>03</div></div>
        <p class="hero-sub">Созданы двигать вперёд.<br>Спроектированы для твоего ритма.</p>
        <div class="feature feature-left"><span class="feature-no">01 / MATERIAL</span><strong>Легче<br>воздуха</strong><span class="feature-line"></span></div>
      </div>
      <div class="feature feature-right"><span class="feature-no">02 / RESPONSE</span><strong>Реактивная<br>амортизация</strong><span class="feature-line"></span></div>
      <a class="scroll-cue" href="#story"><span>ЛИСТАЙ ВНИЗ</span><i>↓</i></a>
      <div class="hero-side-note">AIR TECHNOLOGY<br>MADE TO MOVE</div>
      <div class="hero-bottom"><span>NIKE AIR / 2025</span><span>MOVE WITH PURPOSE&nbsp; ↗</span></div>
    </section>
    <section class="story section" id="story">
      <div class="section-kicker"><span>02 / НАСЛЕДИЕ</span><span>ОТ ТРЕКОВ ДО УЛИЦ</span></div>
      <div class="story-head"><h2>История<br><em>Nike</em></h2><div class="story-intro"><span class="asterisk">✳</span><p>Всё началось с идеи изменить бег — и веры в то, что лучшее всегда впереди.</p></div></div>
      <div class="story-grid">
        <figure class="story-image image-one"><img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1000&q=85" alt="Беговая дорожка на стадионе"><figcaption>1964 — ПЕРВЫЙ ШАГ</figcaption></figure>
        <div class="story-copy"><span class="copy-label">ОТ BLUE RIBBON К NIKE</span><p>В 1964 году бегун Фил Найт и его тренер Билл Бауэрман основали Blue Ribbon Sports. Их объединяла простая цель: дать каждому атлету обувь, которая поможет раскрыть свой потенциал.</p><p>В 1971 году компания получила имя Nike — в честь древнегреческой богини победы. Так началась история движения, которое стало больше спорта.</p><a href="#contact" class="text-link">ПОЧУВСТВУЙ ИСТОРИЮ <span>↗</span></a></div>
        <figure class="story-image image-two"><img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85" alt="Атлеты на пробежке"><figcaption>JUST DO IT. SINCE 1971.</figcaption></figure>
      </div>
      <div class="story-stat"><strong>01<span> /</span></strong><span>ИДЕЯ, КОТОРАЯ<br>СТАЛА ДВИЖЕНИЕМ</span><span>BEAVERTON, OREGON&nbsp; · &nbsp;С 1964</span></div>
    </section>
    <section class="contact section" id="contact">
      <div class="section-kicker"><span>03 / БУДЬ НА СВЯЗИ</span><span>ДВИЖЕНИЕ ПРОДОЛЖАЕТСЯ</span></div>
      <div class="contact-content"><div><p class="contact-overline">ТВОЙ СЛЕДУЮЩИЙ ШАГ</p><h2>Давай<br><em>двигаться</em></h2></div><form class="signup"><label for="email">ОСТАВЬ EMAIL — БУДЬ ПЕРВЫМ В КУРСЕ</label><div class="input-row"><input id="email" name="email" type="email" placeholder="Твой email" required><button type="submit" aria-label="Подписаться">↗</button></div><p class="form-message" aria-live="polite">Никакого спама. Только то, что приводит в движение.</p></form></div>
      <div class="social-row"><span>НАЙДИ НАС В ДВИЖЕНИИ</span><div><a href="https://instagram.com/nike" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="https://tiktok.com/@nike" target="_blank" rel="noreferrer">TIKTOK ↗</a><a href="https://youtube.com/nike" target="_blank" rel="noreferrer">YOUTUBE ↗</a></div></div>
      <footer><a class="wordmark" href="#home">NIKE<span>®</span></a><span>© 2025 NIKE, INC. ВСЕ ПРАВА ЗАЩИЩЕНЫ</span><a href="#home">НАВЕРХ ↑</a></footer>
    </section>
  </main>
`

const canvas = document.querySelector('.scene')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#242424')
const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 0.15, 7.3)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.9
scene.add(new THREE.AmbientLight(0xffffff, 0.4))
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
keyLight.position.set(-3, 5, 6)
scene.add(keyLight)
const rimLight = new THREE.DirectionalLight(0x9edcff, 0.7)
rimLight.position.set(4, 2, -4)
scene.add(rimLight)
const sceneColors = {
  charcoal: new THREE.Color('#242424'),
  history: new THREE.Color('#15566c'),
  night: new THREE.Color('#111111'),
}
const shoe = new THREE.Group()
scene.add(shoe)
const controls = new OrbitControls(camera, canvas)
controls.enableZoom = false
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.enabled = false
controls.enableRotate = false

new GLTFLoader().load('./shoe.glb', ({ scene: model }) => {
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  model.position.sub(center)
  const scale = 3.25 / Math.max(size.x, size.y, size.z)
  model.scale.setScalar(scale)
  model.traverse((object) => {
    if (!object.isMesh) return
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    for (const material of materials) {
      if ('envMapIntensity' in material) material.envMapIntensity = 0.5
      for (const textureName of ['map', 'emissiveMap', 'sheenColorMap', 'specularColorMap']) {
        const texture = material[textureName]
        if (texture && texture.colorSpace !== THREE.SRGBColorSpace) {
          texture.colorSpace = THREE.SRGBColorSpace
          texture.needsUpdate = true
        }
      }
    }
  })
  shoe.add(model)
shoe.rotation.set(-0.12, 0, 0.08)
}, undefined, (error) => console.error('Не удалось загрузить public/shoe.glb', error))

const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.85 })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

gsap.to(shoe.rotation, {
  y: Math.PI * 2,
  scrollTrigger: { trigger: document.body, endTrigger: '.story', start: 'top top', end: 'top center', scrub: 1 },
})
gsap.to(shoe.scale, {
  x: 0.58, y: 0.58, z: 0.58,
  scrollTrigger: { trigger: document.body, endTrigger: '.story', start: 'top top', end: 'top center', scrub: 1 },
})
ScrollTrigger.create({
  trigger: '.story', start: 'top bottom', end: 'top top', scrub: 1,
  onUpdate: (self) => {
    scene.background.copy(sceneColors.charcoal).lerp(sceneColors.history, self.progress)
  },
})
ScrollTrigger.create({
  trigger: '.contact', start: 'top bottom', end: 'top top', scrub: 1,
  onUpdate: (self) => {
    scene.background.copy(sceneColors.history).lerp(sceneColors.night, self.progress)
  },
})
// Fade the 3D layer with the History scroll; the sneaker remains stationary underneath.
gsap.to(canvas, {
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.story',
    start: 'top bottom',
    end: 'top center',
    scrub: 1,
    onEnter: () => {
      canvas.style.willChange = 'opacity'
      gsap.set(canvas, { opacity: 1 })
    },
    onLeaveBack: () => {
      gsap.set(canvas, { opacity: 1 })
      canvas.style.willChange = 'auto'
    },
  },
})

function animate() {
  requestAnimationFrame(animate)
  if (canvas.style.opacity !== '0') renderer.render(scene, camera)
}
animate()
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

document.querySelector('.signup').addEventListener('submit', (event) => {
  event.preventDefault()
  document.querySelector('.form-message').textContent = 'Спасибо! Ты в списке — скоро будем на связи.'
  event.currentTarget.reset()
})

// The shoe stays centered on wide screens and moves lower on compact screens.
function placeShoe() {
  const narrow = innerWidth < 760
  shoe.position.set(narrow ? 0.35 : 1.35, narrow ? -0.2 : 0.25, 0)
  camera.position.z = narrow ? 8.4 : 7.3
}
placeShoe()
addEventListener('resize', placeShoe)
