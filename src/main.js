import './style.css'
import { animate, inView, scroll, stagger } from 'motion'

const experiences = [
  {
    period: '2026.06 — 2026.09',
    company: 'Insta360 影石',
    role: '软件产品实习生',
    title: '从真实场景出发，定义智能飞行体验',
    summary:
      '围绕无人机智能飞行，覆盖市场洞察、用户调研、需求定义、版本验收与体验线索闭环。',
    facts: ['300+ 条骑行素材样本', '10+ 维度标签矩阵', '60+ 条 Jira 问题'],
  },
  {
    period: '2025.11 — 2026.05',
    company: 'Momenta',
    role: '产品项目实习生',
    title: '连接量产交付与 AI Agent 产品落地',
    summary:
      '跟进比亚迪智能驾驶项目量产交付，并搭建车辆配置全生命周期管理 Agent。',
    facts: ['21 个项目', '80+ 款车型', '识别准确率 70% → 95%'],
  },
]

const projects = [
  {
    index: '01',
    category: 'SMART HARDWARE',
    title: '无人机智能飞行功能优化',
    statement: '把场景观察、用户反馈与飞行能力边界，转化为可开发、可验收的产品策略。',
    tags: ['用户调研', '需求定义', '体验评测'],
    accent: 'cobalt',
  },
  {
    index: '02',
    category: 'REVIEW PLATFORM',
    title: 'FlightSync 飞行问题复盘平台',
    statement: '用多视角时间轴、同步预览、Bug 标注与证据片段导出，支持跨团队飞行问题复盘与判断。',
    tags: ['多视角同步', '证据标注', '复盘协作'],
    accent: 'cyan',
    url: 'https://flightsync-review.l6090611.chatgpt.site/?project=7dcf65c3-a5f0-46c2-8ecd-0ac83c098ec4&record=bdfdb9c7-ed3e-474d-9b9c-f79d554d33af',
    linkLabel: '打开 FlightSync',
  },
  {
    index: '03',
    category: 'AI AGENT',
    title: '车辆配置全生命周期管理 Agent',
    statement: '连接配置平台、项目空间、代码仓库与构建流水线，重构跨平台配置流转。',
    tags: ['意图识别', '多 Agent', '上下文管理'],
    accent: 'violet',
    url: 'https://configpilot-agent-lab-20261006.l6090611.chatgpt.site/',
    linkLabel: '打开 ConfigPilot',
  },
  {
    index: '04',
    category: 'EMBODIED AI',
    title: '具身 Agent Harness 与仿真评测',
    statement: '用执行约束、回执核查和对照评测，分析不同模型介入方式的效果与成本。',
    tags: ['LIBERO', 'VLA', 'Isaac Sim'],
    accent: 'cobalt',
  },
]

document.querySelector('#app').innerHTML = `
  <div class="noise" aria-hidden="true"></div>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="返回首页">
      <span class="brand-mark">LH</span>
      <span class="brand-name">楼昊天</span>
    </a>
    <button class="nav-toggle" aria-label="打开导航" aria-expanded="false">
      <span></span><span></span>
    </button>
    <nav class="nav-links" aria-label="主要导航">
      <a href="#work">项目</a>
      <a href="#experience">经历</a>
      <a href="#about">关于</a>
      <a href="#notes">博客</a>
    </nav>
    <a class="header-contact" href="mailto:798427490@qq.com">联系我</a>
  </header>

  <main id="top">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-orbit" aria-hidden="true">
        <canvas id="orbital-canvas"></canvas>
        <div class="orbit-label orbit-label-a">PRODUCT / 01</div>
        <div class="orbit-label orbit-label-b">AGENT / 02</div>
        <div class="orbit-label orbit-label-c">SYSTEM / 03</div>
      </div>
      <div class="hero-copy">
        <p class="eyebrow reveal">PRODUCT MANAGER · AI × INTELLIGENT HARDWARE</p>
        <h1 id="hero-title" class="hero-title" aria-label="把复杂技术，转化为可验证的产品体验">
          <span class="title-line"><span>把复杂技术</span></span>
          <span class="title-line title-line-offset"><span>转化为可验证的</span></span>
          <span class="title-line title-line-blue"><span>产品体验。</span></span>
        </h1>
        <p class="hero-intro reveal">
          我是楼昊天，电子科技大学电子信息硕士在读。关注智能硬件、AI Agent 与具身智能，
          擅长从真实场景和能力边界出发，推动需求、评测与交付形成闭环。
        </p>
        <div class="hero-actions reveal">
          <a class="button button-primary magnetic" href="#work">查看项目</a>
          <a class="button button-ghost" href="#notes">阅读博客</a>
        </div>
      </div>
      <div class="hero-meta" aria-label="个人信息概览">
        <div><span>EDUCATION</span><strong>UESTC</strong></div>
        <div><span>FOCUS</span><strong>AI Product</strong></div>
        <div><span>STAGE</span><strong>MSc Candidate</strong></div>
      </div>
      <a class="scroll-cue" href="#work" aria-label="向下浏览项目">
        <span>SCROLL TO EXPLORE</span><i></i>
      </a>
    </section>

    <section class="signal-strip" aria-label="关键数据">
      <div class="signal-track">
        <span><b>300+</b> 调研样本</span><i></i>
        <span><b>80+</b> 车型覆盖</span><i></i>
        <span><b>95%</b> 意图识别准确率</span><i></i>
        <span><b>40+</b> 产品判断支持</span><i></i>
        <span><b>300+</b> 调研样本</span><i></i>
        <span><b>80+</b> 车型覆盖</span><i></i>
      </div>
    </section>

    <section class="section work-section" id="work">
      <div class="section-head reveal-section">
        <p class="section-kicker">SELECTED WORK / 2025—2026</p>
        <h2>在技术与用户之间，<br />建立可执行的产品路径。</h2>
        <p class="section-note">四项实践，覆盖体验研究、协作复盘、Agent 系统与具身评测。</p>
      </div>
      <div class="project-list">
        ${projects
          .map(
            (project) => `
          <article class="project-card reveal-section" data-tilt data-accent="${project.accent}">
            <div class="project-topline">
              <span>${project.index}</span>
              <span>${project.category}</span>
              <span>2026</span>
            </div>
            <div class="project-visual" aria-hidden="true">
              <div class="visual-grid"></div>
              <div class="visual-core"></div>
              <div class="visual-ring ring-one"></div>
              <div class="visual-ring ring-two"></div>
              <span class="visual-coordinate">X ${project.index}.728 / Y 04.116</span>
            </div>
            <div class="project-body">
              <h3>${project.title}</h3>
              <p>${project.statement}</p>
              <ul>${project.tags.map((tag) => `<li>${tag}</li>`).join('')}</ul>
              ${
                project.url
                  ? `<a class="project-link" href="${project.url}" target="_blank" rel="noreferrer" aria-label="${project.linkLabel}（新窗口打开）">${project.linkLabel}</a>`
                  : ''
              }
            </div>
          </article>
        `,
          )
          .join('')}
      </div>
    </section>

    <section class="section experience-section" id="experience">
      <div class="experience-intro reveal-section">
        <p class="section-kicker">EXPERIENCE</p>
        <h2>让判断进入流程，<br />让流程走向交付。</h2>
      </div>
      <div class="experience-list">
        ${experiences
          .map(
            (item, index) => `
          <article class="experience-item reveal-section">
            <div class="experience-index">0${index + 1}</div>
            <div class="experience-company">
              <span>${item.period}</span>
              <h3>${item.company}</h3>
              <p>${item.role}</p>
            </div>
            <div class="experience-detail">
              <h4>${item.title}</h4>
              <p>${item.summary}</p>
              <ul>${item.facts.map((fact) => `<li>${fact}</li>`).join('')}</ul>
            </div>
          </article>
        `,
          )
          .join('')}
      </div>
    </section>

    <section class="section evidence-section">
      <div class="evidence-sticky reveal-section">
        <p class="section-kicker">HOW I WORK</p>
        <h2>用证据减少模糊，<br />用边界提高决策质量。</h2>
      </div>
      <ol class="method-list">
        <li class="reveal-section"><span>01</span><div><h3>进入场景</h3><p>通过用户调研、真实体验和业务梳理，找到问题发生的具体链路。</p></div></li>
        <li class="reveal-section"><span>02</span><div><h3>定义边界</h3><p>明确能力可做什么、不能做什么，以及异常和人工介入的位置。</p></div></li>
        <li class="reveal-section"><span>03</span><div><h3>建立验证</h3><p>把判断转化为准出要求、评测用例和可复盘的过程证据。</p></div></li>
        <li class="reveal-section"><span>04</span><div><h3>推动闭环</h3><p>连接产品、研发、测试和交付，让问题进入流程并持续跟进。</p></div></li>
      </ol>
    </section>

    <section class="section about-section" id="about">
      <div class="about-copy reveal-section">
        <p class="section-kicker">ABOUT</p>
        <h2>机械工程的系统视角，<br />电子信息的技术纵深。</h2>
        <p>
          本科就读于江南大学机械工程专业，现于电子科技大学攻读电子信息硕士。
          经历横跨智能飞行、智能驾驶、AI Agent 与具身仿真，持续探索复杂技术如何成为清晰、可靠的产品能力。
        </p>
      </div>
      <div class="about-panel reveal-section">
        <div class="education-row"><span>2024—2027</span><strong>电子科技大学</strong><em>电子信息 · 硕士</em></div>
        <div class="education-row"><span>2019—2023</span><strong>江南大学</strong><em>机械工程 · 本科</em></div>
        <div class="capability-cloud" aria-label="能力标签">
          <span>市场洞察</span><span>用户调研</span><span>需求定义</span><span>评测设计</span>
          <span>Prompt</span><span>Agent 编排</span><span>VLA</span><span>Figma</span>
        </div>
      </div>
    </section>

    <section class="section notes-section" id="notes">
      <div class="notes-copy reveal-section">
        <p class="section-kicker">FIELD NOTES</p>
        <h2>把概念拆开，<br />把系统讲清楚。</h2>
        <p>记录关于 AI 产品、Agent 工程、智能硬件体验与具身智能评测的思考。</p>
      </div>
      <div class="article-list">
        <a class="article-card reveal-section" href="/blog/react-to-harness/" aria-label="阅读文章：从 ReAct 到 Harness：一个 Agent 是怎样跑起来的">
          <div class="article-card-topline">
            <span>FIELD NOTE / 01</span>
            <span>AGENT ENGINEERING</span>
          </div>
          <div class="article-card-graphic" aria-hidden="true">
            <span>MODEL</span><i></i><span>HARNESS</span><i></i><span>WORLD</span>
          </div>
          <h3>从 ReAct 到 Harness：<br />一个 Agent 是怎样跑起来的</h3>
          <p>从最小工具循环到生产级系统，理解模型、行动与执行边界。</p>
          <span class="article-card-action">阅读全文 <i>↗</i></span>
        </a>
        <a class="article-card reveal-section" href="/blog/agent-memory/" aria-label="阅读文章：Agent 为什么需要 Memory：从上下文窗口到长期协作">
          <div class="article-card-topline">
            <span>FIELD NOTE / 02</span>
            <span>AGENT SYSTEMS</span>
          </div>
          <div class="article-card-graphic" aria-hidden="true">
            <span>ACTIVE</span><i></i><span>WORKING</span><i></i><span>DURABLE</span>
          </div>
          <h3>Agent 为什么需要 Memory：<br />从上下文窗口到长期协作</h3>
          <p>拆解三层记忆、Agent Loop、工具卫生与多 Agent 协作的系统设计。</p>
          <span class="article-card-action">阅读全文 <i>↗</i></span>
        </a>
      </div>
    </section>

    <section class="contact-section" id="contact">
      <p class="section-kicker">LET'S CONNECT</p>
      <a class="contact-link magnetic" href="mailto:798427490@qq.com">
        <span>聊聊产品与 AI</span>
        <i>↗</i>
      </a>
      <p class="contact-footnote">楼昊天 · 产品经理 · 电子科技大学</p>
    </section>
  </main>

  <footer>
    <span>© 2026 LOU HAOTIAN</span>
    <a href="#top">BACK TO TOP</a>
  </footer>
`

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function initNavigation() {
  const toggle = document.querySelector('.nav-toggle')
  const nav = document.querySelector('.nav-links')
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true'
    toggle.setAttribute('aria-expanded', String(!open))
    nav.classList.toggle('is-open', !open)
  })
  nav.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false')
      nav.classList.remove('is-open')
    }),
  )
}

function initReveal() {
  if (reducedMotion) return

  animate(
    '.title-line > span',
    { transform: ['translateY(110%)', 'translateY(0%)'] },
    { duration: 1.05, delay: stagger(0.12), ease: [0.22, 1, 0.36, 1] },
  )
  animate(
    '.hero .reveal',
    { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0)'] },
    { duration: 0.8, delay: stagger(0.1, { startDelay: 0.45 }), ease: 'easeOut' },
  )

  inView(
    '.reveal-section',
    (element) => {
      animate(
        element,
        { opacity: [0, 1], transform: ['translateY(48px)', 'translateY(0)'] },
        { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      )
    },
    { amount: 0.18 },
  )

  scroll((progress) => {
    document.documentElement.style.setProperty('--page-progress', progress)
  })
}

function initTilt() {
  if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      card.style.setProperty('--tilt-x', `${-y * 4}deg`)
      card.style.setProperty('--tilt-y', `${x * 6}deg`)
      card.style.setProperty('--glow-x', `${(x + 0.5) * 100}%`)
      card.style.setProperty('--glow-y', `${(y + 0.5) * 100}%`)
    })
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg')
      card.style.setProperty('--tilt-y', '0deg')
    })
  })
}

function initMagneticButtons() {
  if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return
  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2
      element.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`
    })
    element.addEventListener('pointerleave', () => {
      element.style.transform = ''
    })
  })
}

async function initOrbitalScene() {
  const THREE = await import('three')
  const canvas = document.querySelector('#orbital-canvas')
  const container = canvas.parentElement
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
  camera.position.z = 5.2

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setClearColor(0x000000, 0)

  const count = window.innerWidth < 720 ? 1200 : 2600
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const colorA = new THREE.Color('#267dff')
  const colorB = new THREE.Color('#9bd6ff')

  for (let i = 0; i < count; i += 1) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const warp = 1 + Math.sin(theta * 0.08) * 0.09
    const radius = (1.56 + Math.sin(phi * 7 + theta * 0.03) * 0.11) * warp
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.92
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    const mixed = colorA.clone().lerp(colorB, (positions[i * 3 + 1] / radius + 1) / 2)
    colors[i * 3] = mixed.r
    colors[i * 3 + 1] = mixed.g
    colors[i * 3 + 2] = mixed.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: window.innerWidth < 720 ? 0.025 : 0.021,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const ringMaterial = new THREE.LineBasicMaterial({
    color: 0x2b7fff,
    transparent: true,
    opacity: 0.22,
  })
  ;[1.95, 2.18].forEach((radius, index) => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius * (index ? 0.56 : 0.38), 0, Math.PI * 2)
    const ringGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(128))
    const ring = new THREE.LineLoop(ringGeometry, ringMaterial)
    ring.rotation.x = index ? 1.08 : 0.82
    ring.rotation.z = index ? -0.35 : 0.5
    scene.add(ring)
  })

  const pointer = { x: 0, y: 0 }
  container.addEventListener('pointermove', (event) => {
    const rect = container.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5
  })

  function resize() {
    const { width, height } = container.getBoundingClientRect()
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  let running = true
  const observer = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting
  })
  observer.observe(container)

  const clock = new THREE.Clock()
  function render() {
    const time = clock.getElapsedTime()
    if (running) {
      if (!reducedMotion) {
        points.rotation.y = time * 0.105 + pointer.x
        points.rotation.x += (pointer.y - points.rotation.x) * 0.025
        points.rotation.z = Math.sin(time * 0.22) * 0.08
      }
      renderer.render(scene, camera)
    }
    requestAnimationFrame(render)
  }
  render()
}

initNavigation()
initReveal()
initTilt()
initMagneticButtons()
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(initOrbitalScene, { timeout: 700 })
} else {
  window.setTimeout(initOrbitalScene, 240)
}
