import './style.css'
import { getCatalog } from './catalog'
import { renderPage } from './lib/render'
import {
  createDemoState,
  ensureEngineLoaded,
  pauseDemo,
  playDemo,
  renderDemo,
  stopDemo,
} from './lib/runtime'
import { getDemoCode } from './lib/codegen'
import { cloneValue, randomRange } from './lib/utils'

const app = document.querySelector('#app')
let catalog
let demoStateMap

try {
  catalog = getCatalog()
  demoStateMap = createDemoState(catalog.demos)
  app.innerHTML = renderPage(catalog, demoStateMap)
} catch (error) {
  app.innerHTML = `
    <main class="layout">
      <section class="hero-panel surface hero-single">
        <div class="hero-copy">
          <span class="eyebrow">Startup Error</span>
          <h1>Catalog の初期化に失敗しました</h1>
          <p class="lead">${error instanceof Error ? error.message : 'Unknown startup error'}</p>
        </div>
      </section>
    </main>
  `
  throw error
}

function getDemoRow(id) {
  return document.querySelector(`[data-demo="${id}"]`)
}

function updateOutputs(demoId) {
  const state = demoStateMap.get(demoId)
  const row = getDemoRow(demoId)

  if (!state || !row) {
    return
  }

  row.querySelectorAll('[data-output]').forEach((output) => {
    const field = output.dataset.output
    output.textContent = String(state.config[field] ?? '')
  })

  const codeNode = row.querySelector(`[data-code="${demoId}"]`)

  if (codeNode) {
    codeNode.textContent = getDemoCode(state)
  }
}

function syncRow(demoId) {
  const state = demoStateMap.get(demoId)
  const row = getDemoRow(demoId)

  if (!state || !row) {
    return
  }

  row.querySelectorAll('[data-field]').forEach((field) => {
    const name = field.dataset.field

    if (field.type === 'checkbox') {
      field.checked = Boolean(state.config[name])
    } else {
      field.value = state.config[name] ?? field.min ?? 0
    }
  })

  updateOutputs(demoId)
}

async function refreshDemo(demoId) {
  const state = demoStateMap.get(demoId)
  const preview = document.querySelector(`#tsparticles-${demoId}`)

  if (!state || !preview || state.rendering) {
    return
  }

  state.rendering = true

  await renderDemo(state, preview)

  if (state.error) {
    preview.innerHTML = `<div class="demo-error">This demo failed to render.<br>${state.error}</div>`
  }

  state.rendering = false
}

function bindRow(demoId) {
  const row = getDemoRow(demoId)
  const state = demoStateMap.get(demoId)

  row.querySelectorAll('[data-field]').forEach((field) => {
    const eventName = field.type === 'checkbox' ? 'change' : 'input'

    field.addEventListener(eventName, async (event) => {
      const name = field.dataset.field
      state.config[name] =
        field.type === 'checkbox' ? event.target.checked : Number(event.target.value)

      if (name === 'linkDistance' && state.config.linksEnabled !== undefined) {
        state.config.linksEnabled =
          state.config.linkDistance > 0 &&
          row.querySelector('[data-field="linksEnabled"]')?.checked
      }

      syncRow(demoId)
      await refreshDemo(demoId)
    })
  })

  row.querySelector('[data-action="pause"]').addEventListener('click', () => {
    pauseDemo(state)
  })

  row.querySelector('[data-action="resume"]').addEventListener('click', () => {
    playDemo(state)
  })

  row.querySelector('[data-action="reset"]').addEventListener('click', async () => {
    const nextState = demoStateMap.get(demoId)
    nextState.config = cloneValue(nextState.definition.config ?? {})
    syncRow(demoId)
    await refreshDemo(demoId)
  })

  row.querySelector('[data-action="randomize"]').addEventListener('click', async () => {
    for (const control of state.definition.controls) {
      if (control.type !== 'range') {
        continue
      }

      state.config[control.field] = randomRange(control.min, control.max, control.step)
    }

    if ('linksEnabled' in state.config && 'linkDistance' in state.config) {
      state.config.linksEnabled = state.config.linkDistance > 0
    }

    syncRow(demoId)
    await refreshDemo(demoId)
  })
}

function setupLazyRendering() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const row = entry.target.closest('[data-demo]')
        const demoId = row?.dataset.demo

        if (!demoId) {
          return
        }

        const state = demoStateMap.get(demoId)

        if (entry.isIntersecting) {
          if (!state.initialized) {
            void refreshDemo(demoId)
          } else {
            playDemo(state)
          }
        } else if (state.initialized) {
          pauseDemo(state)
        }
      })
    },
    {
      rootMargin: '200px 0px',
      threshold: 0.05,
    },
  )

  document.querySelectorAll('.demo-preview').forEach((preview) => observer.observe(preview))
}

for (const demo of catalog.demos) {
  syncRow(demo.id)
  bindRow(demo.id)
}

window.addEventListener('beforeunload', () => {
  for (const state of demoStateMap.values()) {
    stopDemo(state)
  }
})

void (async () => {
  await ensureEngineLoaded()
  setupLazyRendering()
})()
