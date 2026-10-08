import './style.css'
import './article.css'
import { marked } from 'marked'
import reactToHarnessSource from './content/react-to-harness.md?raw'
import agentMemorySource from './content/agent-memory.md?raw'

const articles = {
  '/blog/react-to-harness/': {
    source: reactToHarnessSource,
    number: '01',
    kicker: 'AGENT ENGINEERING · CONCEPTS & SYSTEMS',
    deck: '从一个最小工具循环出发，理解模型如何采取行动，以及 Harness 如何让行动变得安全、持续、可恢复。',
    closing: '模型决定能想到什么，<br />Harness 决定能否抵达现实。',
  },
  '/blog/agent-memory/': {
    source: agentMemorySource,
    number: '02',
    kicker: 'AGENT SYSTEMS · MEMORY & LOOPS',
    deck: '从上下文窗口、工作状态到长期记忆，理解 Agent 如何在长任务和多 Agent 协作中保持连续、可控与可验证。',
    closing: '上下文窗口再大，<br />也不能代替记忆设计。',
  },
}

const normalizedPath = window.location.pathname.endsWith('/')
  ? window.location.pathname
  : `${window.location.pathname}/`
const article = articles[normalizedPath] ?? articles['/blog/react-to-harness/']
const { source } = article

const lines = source.trim().split('\n')
const title = lines[0].replace(/^#\s+/, '').trim()
const bodySource = lines.slice(1).join('\n').trim()

marked.setOptions({
  gfm: true,
  breaks: false,
})

document.querySelector('#article-app').innerHTML = `
  <header class="article-header">
    <a class="brand" href="/" aria-label="返回个人网站首页">
      <span class="brand-mark">LH</span>
      <span class="brand-name">楼昊天</span>
    </a>
    <span class="article-header-label">FIELD NOTES / ${article.number}</span>
    <a class="article-back" href="/#notes">返回博客</a>
  </header>

  <main>
    <section class="article-hero">
      <div class="article-hero-grid" aria-hidden="true"></div>
      <div class="article-hero-orbit" aria-hidden="true">
        <i></i><i></i><i></i>
      </div>
      <div class="article-hero-inner">
        <p class="article-kicker">${article.kicker}</p>
        <h1>${title}</h1>
        <p class="article-deck">${article.deck}</p>
        <div class="article-meta">
          <span>楼昊天</span>
          <span>FIELD NOTE / ${article.number}</span>
          <span>长文</span>
        </div>
      </div>
    </section>

    <div class="article-surface">
      <div class="article-layout">
        <aside class="article-toc" aria-label="文章目录">
          <p>ON THIS PAGE</p>
          <nav id="toc"></nav>
        </aside>
        <article class="markdown-body" id="article-content">${marked.parse(bodySource)}</article>
      </div>

      <section class="article-end">
        <p>END OF FIELD NOTE / ${article.number}</p>
        <h2>${article.closing}</h2>
        <a href="/#notes">返回所有笔记</a>
      </section>
    </div>
  </main>

  <footer class="article-footer">
    <span>© 2026 LOU HAOTIAN</span>
    <a href="#article-app">BACK TO TOP</a>
  </footer>
`

const content = document.querySelector('#article-content')
const headings = [...content.querySelectorAll('h2, h3')]
const usedSlugs = new Map()

function createSlug(text) {
  const base = text
    .toLowerCase()
    .replace(/[：:，,。.!！?？“”"'’‘（）()]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  const count = usedSlugs.get(base) ?? 0
  usedSlugs.set(base, count + 1)
  return count ? `${base}-${count + 1}` : base
}

headings.forEach((heading) => {
  heading.id = createSlug(heading.textContent)
})

document.querySelector('#toc').innerHTML = headings
  .filter((heading) => heading.tagName === 'H2')
  .map(
    (heading, index) =>
      `<a href="#${heading.id}" data-target="${heading.id}"><span>${String(index + 1).padStart(2, '0')}</span>${heading.textContent}</a>`,
  )
  .join('')

content.querySelectorAll('a').forEach((link) => {
  if (link.hostname && link.hostname !== window.location.hostname) {
    link.target = '_blank'
    link.rel = 'noreferrer'
  }
})

content.querySelectorAll('table').forEach((table) => {
  const wrapper = document.createElement('div')
  wrapper.className = 'table-scroll'
  table.parentNode.insertBefore(wrapper, table)
  wrapper.appendChild(table)
})

content.querySelectorAll('pre').forEach((pre) => {
  const button = document.createElement('button')
  button.className = 'copy-code'
  button.type = 'button'
  button.textContent = '复制'
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(pre.querySelector('code')?.textContent ?? pre.textContent)
    button.textContent = '已复制'
    window.setTimeout(() => {
      button.textContent = '复制'
    }, 1400)
  })
  pre.appendChild(button)
})

const tocLinks = [...document.querySelectorAll('#toc a')]
const majorHeadings = headings.filter((heading) => heading.tagName === 'H2')
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries.find((entry) => entry.isIntersecting)
    if (!visible) return
    tocLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.target === visible.target.id))
  },
  { rootMargin: '-18% 0px -70% 0px' },
)
majorHeadings.forEach((heading) => observer.observe(heading))

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
  document.documentElement.style.setProperty('--page-progress', progress)
}

window.addEventListener('scroll', updateProgress, { passive: true })
updateProgress()
