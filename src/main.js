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
import { getInitialLocale, getMessages, saveLocale } from './lib/i18n'
import { setupMonetization } from './lib/monetization'
import { cloneValue, randomRange } from './lib/utils'

const app = document.querySelector('#app')
let catalog
let demoStateMap
let currentLocale = getInitialLocale()
let previewObserver

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

try {
  catalog = getCatalog()
  demoStateMap = createDemoState(catalog.demos)
} catch (error) {
  const copy = getMessages(currentLocale)

  app.innerHTML = `
    <main class="layout">
      <section class="hero-panel surface hero-single">
        <div class="hero-copy">
          <span class="eyebrow">Startup Error</span>
          <h1>${copy.startupError}</h1>
          <p class="lead">${error instanceof Error ? error.message : 'Unknown startup error'}</p>
        </div>
      </section>
    </main>
  `
  throw error
}

function resetDemoInstances() {
  if (!demoStateMap) {
    return
  }

  for (const state of demoStateMap.values()) {
    stopDemo(state)
    state.instance = undefined
    state.intervalId = undefined
    state.initialized = false
    state.rendering = false
    state.error = null
  }
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
  const copy = getMessages(currentLocale)

  if (!state || !preview || state.rendering) {
    return
  }

  state.rendering = true
  state.error = null

  preview.innerHTML = `<div class="demo-loading">${copy.loading}</div>`

  try {
    await renderDemo(state, preview)

    if (state.error) {
      preview.innerHTML = `
        <div class="demo-error">
          <strong>${copy.renderErrorTitle}</strong>
          <span>${escapeHtml(state.error)}</span>
          <button class="button secondary compact" data-action="retry" type="button">${copy.retry}</button>
        </div>
      `
    }
  } finally {
    state.rendering = false
  }
}

function needsPageReloadForRetry(error) {
  return error?.includes('Register plugins can only be done before calling tsParticles.load()')
}

function bindRow(demoId) {
  const row = getDemoRow(demoId)
  const state = demoStateMap.get(demoId)
  const copy = getMessages(currentLocale)

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

  row.addEventListener('click', async (event) => {
    if (!(event.target instanceof Element)) {
      return
    }

    const retryButton = event.target.closest('[data-action="retry"]')

    if (!retryButton || !row.contains(retryButton)) {
      return
    }

    retryButton.disabled = true
    retryButton.textContent = copy.retrying

    if (needsPageReloadForRetry(state.error)) {
      window.location.reload()
      return
    }

    await refreshDemo(demoId)
  })
}

function setupLazyRendering() {
  previewObserver?.disconnect()

  previewObserver = new IntersectionObserver(
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

  document.querySelectorAll('.demo-preview').forEach((preview) => previewObserver.observe(preview))
}

function bindLanguageSwitcher() {
  document.querySelector('[data-language-select]')?.addEventListener('change', (event) => {
    if (!(event.target instanceof HTMLSelectElement)) {
      return
    }

    currentLocale = event.target.value
    saveLocale(currentLocale)
    renderApplication()
  })
}

function renderApplication() {
  previewObserver?.disconnect()
  resetDemoInstances()
  document.documentElement.lang = currentLocale
  app.innerHTML = renderPage(catalog, demoStateMap, currentLocale)

  for (const demo of catalog.demos) {
    syncRow(demo.id)
    bindRow(demo.id)
  }

  bindLanguageSwitcher()
  setupMonetization()
  setupLazyRendering()
}

window.addEventListener('beforeunload', () => {
  for (const state of demoStateMap.values()) {
    stopDemo(state)
  }
})

void (async () => {
  await ensureEngineLoaded()
  renderApplication()
})()
