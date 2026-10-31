import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="preloader" role="status" aria-live="polite">
    <div class="preloader-brand">NIKE<span>®</span></div>
    <div class="preloader-status"><span class="preloader-label">Загрузка 0%</span><span class="preloader-value">00 / 100</span></div>
    <div class="preloader-track"><span class="preloader-progress"></span></div>
    <span class="preloader-caption">ПОДГОТАВЛИВАЕМ ТВОЙ СЛЕДУЮЩИЙ ШАГ</span>
  </div>
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

const [THREE, { GLTFLoader }, { DRACOLoader }, { gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
  import('three'),
  import('three/addons/loaders/GLTFLoader.js'),
  import('three/addons/loaders/DRACOLoader.js'),
  import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/index.js'),
  import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger.js'),
  import('https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.mjs'),
])
gsap.registerPlugin(ScrollTrigger)

const app = document.querySelector('#app')
const canvas = document.querySelector('.scene')
const loaderLabel = document.querySelector('.preloader-label')
const loaderValue = document.querySelector('.preloader-value')
const loaderProgress = document.querySelector('.preloader-progress')
const sceneColors = {
  charcoal: new THREE.Color('#242424'),
  history: new THREE.Color('#15566c'),
  night: new THREE.Color('#111111'),
}
let scene = null
let camera = null
let renderer = null
let storyColorTrigger = null
let contactColorTrigger = null
const shoe = new THREE.Group()

function updateSceneBackground() {
  if (!scene) return
  if (contactColorTrigger?.progress > 0) {
    scene.background.copy(sceneColors.history).lerp(sceneColors.night, contactColorTrigger.progress)
  } else {
    scene.background.copy(sceneColors.charcoal).lerp(sceneColors.history, storyColorTrigger?.progress ?? 0)
  }
}

function optimizeTexture(texture) {
  const image = texture.image
  if (!image) return

  const width = image.width || image.videoWidth || 0
  const height = image.height || image.videoHeight || 0
  if (!texture.isCompressedTexture && (width > 2048 || height > 2048)) {
    const ratio = Math.min(2048 / width, 2048 / height)
    const resized = document.createElement('canvas')
    resized.width = Math.max(1, Math.round(width * ratio))
    resized.height = Math.max(1, Math.round(height * ratio))
    resized.getContext('2d').drawImage(image, 0, 0, resized.width, resized.height)
    texture.image = resized
  }

  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true
}

function initializeScene(model) {
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  model.position.sub(center)
  model.scale.setScalar(3.25 / Math.max(size.x, size.y, size.z))
  model.traverse((object) => {
    if (!object.isMesh) return
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    for (const material of materials) {
      if ('envMapIntensity' in material) material.envMapIntensity = 0.5
      for (const value of Object.values(material)) {
        if (value?.isTexture) optimizeTexture(value)
      }
      for (const textureName of ['map', 'emissiveMap', 'sheenColorMap', 'specularColorMap']) {
        const texture = material[textureName]
        if (texture) texture.colorSpace = THREE.SRGBColorSpace
      }
    }
  })

  scene = new THREE.Scene()
  scene.background = sceneColors.charcoal.clone()
  camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 100)
  camera.position.set(0, 0.15, innerWidth < 760 ? 8.4 : 7.3)
  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
  keyLight.position.set(-3, 5, 6)
  scene.add(keyLight)
  const rimLight = new THREE.DirectionalLight(0x9edcff, 0.7)
  rimLight.position.set(4, 2, -4)
  scene.add(rimLight)
  shoe.add(model)
  shoe.rotation.set(-0.12, 0, 0.08)
  scene.add(shoe)
  placeShoe()

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(innerWidth, innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.9
  renderer.setAnimationLoop(() => {
    if (canvas.style.opacity !== '0') renderer.render(scene, camera)
  })

  ScrollTrigger.refresh()
  updateSceneBackground()
  loaderLabel.textContent = 'Готово'
  loaderValue.textContent = '100 / 100'
  loaderProgress.style.width = '100%'
  window.setTimeout(() => app.classList.add('is-loaded'), 500)
}

function updateProgress(event) {
  if (event.total > 0) {
    const percent = Math.min(99, Math.round((event.loaded / event.total) * 100))
    loaderProgress.classList.remove('is-indeterminate')
    loaderLabel.textContent = `Загрузка ${percent}%`
    loaderValue.textContent = `${String(percent).padStart(2, '0')} / 100`
    loaderProgress.style.width = `${percent}%`
  } else {
    const megabytes = (event.loaded / (1024 * 1024)).toFixed(1)
    loaderLabel.textContent = `Загрузка ${megabytes} МБ`
    loaderValue.textContent = '…'
    loaderProgress.classList.add('is-indeterminate')
  }
}

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load('./shoe.glb', ({ scene: model }) => {
  initializeScene(model)
}, updateProgress, (error) => {
  loaderLabel.textContent = 'Не удалось загрузить модель'
  loaderValue.textContent = 'ОШИБКА'
  loaderProgress.classList.add('has-error')
  console.error('Не удалось загрузить public/shoe.glb', error)
})

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
storyColorTrigger = ScrollTrigger.create({
  trigger: '.story', start: 'top bottom', end: 'top top', scrub: 1,
  onUpdate: updateSceneBackground,
})
contactColorTrigger = ScrollTrigger.create({
  trigger: '.contact', start: 'top bottom', end: 'top top', scrub: 1,
  onUpdate: updateSceneBackground,
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

addEventListener('resize', () => {
  if (!camera || !renderer) return
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
  if (camera) camera.position.z = narrow ? 8.4 : 7.3
}
placeShoe()
addEventListener('resize', placeShoe)
