import { tsParticles } from '@tsparticles/engine'
import { loadAll } from '@tsparticles/all'
import configs from '@tsparticles/configs'
import { particles } from '@tsparticles/particles'
import { confetti } from '@tsparticles/confetti'
import { fireworks } from '@tsparticles/fireworks'
import { cloneValue, deepMerge } from './utils'

let engineLoaded = false

function inferConfigFromOptions(options = {}) {
  return {
    count: options.particles?.number?.value ?? 80,
    speed: options.particles?.move?.speed ?? 2,
    size:
      typeof options.particles?.size?.value === 'object'
        ? options.particles?.size?.value?.max ?? 3
        : options.particles?.size?.value ?? 3,
    linkDistance: options.particles?.links?.distance ?? 140,
    repulseDistance:
      options.interactivity?.modes?.repulse?.distance ??
      options.interactivity?.modes?.bubble?.distance ??
      120,
    linksEnabled: options.particles?.links?.enable ?? true,
    hoverEnabled: options.interactivity?.events?.onHover?.enable ?? true,
    clickEnabled: options.interactivity?.events?.onClick?.enable ?? true,
    background: options.background?.color ?? '#0b1020',
  }
}

export async function ensureEngineLoaded() {
  if (!engineLoaded) {
    await loadAll(tsParticles)
    void configs
    engineLoaded = true
  }
}

export function createDemoState(catalogDemos) {
  const state = new Map()

  for (const demo of catalogDemos) {
    const baseConfig =
      demo.config ?? (demo.mode === 'engine' ? inferConfigFromOptions(demo.options) : {})

    state.set(demo.id, {
      definition: demo,
      config: cloneValue(baseConfig),
      options: demo.options ? cloneValue(demo.options) : undefined,
      instance: undefined,
      intervalId: undefined,
      initialized: false,
      rendering: false,
      error: null,
    })
  }

  return state
}

function applyCommonOverrides(options, config) {
  const next = cloneValue(options)

  if (!next.particles) {
    next.particles = {}
  }

  next.background ??= {}
  next.background.color = config.background ?? next.background.color ?? '#0b1020'

  next.particles.number ??= {}
  next.particles.number.value = config.count ?? next.particles.number.value ?? 80

  next.particles.move ??= {}
  next.particles.move.speed = config.speed ?? next.particles.move.speed ?? 2

  next.particles.size ??= {}
  if (typeof next.particles.size.value === 'object') {
    next.particles.size.value.max = config.size ?? next.particles.size.value.max ?? 3
  } else {
    next.particles.size.value = config.size ?? next.particles.size.value ?? 3
  }

  next.particles.links ??= {}
  next.particles.links.enable = config.linksEnabled ?? next.particles.links.enable ?? false
  next.particles.links.distance =
    config.linkDistance ?? next.particles.links.distance ?? 140

  next.interactivity ??= {}
  next.interactivity.events ??= {}
  next.interactivity.events.onHover ??= {}
  next.interactivity.events.onHover.enable =
    config.hoverEnabled ?? next.interactivity.events.onHover.enable ?? true
  next.interactivity.events.onClick ??= {}
  next.interactivity.events.onClick.enable =
    config.clickEnabled ?? next.interactivity.events.onClick.enable ?? true

  if (next.interactivity.modes?.repulse) {
    next.interactivity.modes.repulse.distance =
      config.repulseDistance ?? next.interactivity.modes.repulse.distance
  }

  if (next.interactivity.modes?.bubble) {
    next.interactivity.modes.bubble.distance =
      config.repulseDistance ?? next.interactivity.modes.bubble.distance
  }

  return next
}

export function buildEngineOptions(demoState) {
  const definition = demoState.definition
  const optionSource = definition.options ?? {}
  const merged = deepMerge(optionSource, definition.optionOverrides ?? {})

  return applyCommonOverrides(merged, demoState.config)
}

export async function renderEngineDemo(demoState, element) {
  await ensureEngineLoaded()

  demoState.instance?.destroy?.()
  element.replaceChildren()

  demoState.instance = await tsParticles.load({
    id: element.id,
    options: buildEngineOptions(demoState),
  })
  demoState.initialized = true
  demoState.error = null
}

export async function renderBundleDemo(demoState, element) {
  if (demoState.intervalId) {
    clearInterval(demoState.intervalId)
    demoState.intervalId = undefined
  }

  element.replaceChildren()

  if (demoState.definition.mode === 'particles-api') {
    const canvas = document.createElement('canvas')
    element.appendChild(canvas)
    demoState.instance?.stop?.()
    demoState.instance = await particles.create(canvas, {
      count: demoState.config.count,
      speed: demoState.config.speed,
      radius: demoState.config.size,
      color: demoState.config.colors?.[0] ?? '#38bdf8',
      shape: ['circle', 'square'],
      links: demoState.config.links ?? true,
      linksColor: demoState.config.linksColor ?? '#a78bfa',
      linksLength: 140,
      opacity: demoState.config.opacity ?? 0.75,
    })
  }

  if (demoState.definition.mode === 'confetti-api') {
    const canvas = document.createElement('canvas')
    element.appendChild(canvas)
    demoState.instance?.stop?.()
    const confettiFn = await confetti.create(canvas)
    const launch = async () =>
      confettiFn({
        count: demoState.config.count,
        colors: demoState.config.colors,
        scalar: demoState.config.size / 4,
        startVelocity: demoState.config.speed * 10,
        disableForReducedMotion: true,
      })

    await launch()

    demoState.intervalId = window.setInterval(() => {
      void launch()
    }, 1600)

    demoState.instance = {
      play: () => {
        if (!demoState.intervalId) {
          void launch()
          demoState.intervalId = window.setInterval(() => {
            void launch()
          }, 1600)
        }
      },
      pause: () => {
        if (demoState.intervalId) {
          clearInterval(demoState.intervalId)
          demoState.intervalId = undefined
        }
      },
      stop: () => {
        if (demoState.intervalId) {
          clearInterval(demoState.intervalId)
          demoState.intervalId = undefined
        }
        canvas.width = canvas.width
      },
    }
  }

  if (demoState.definition.mode === 'fireworks-api') {
    const canvas = document.createElement('canvas')
    element.appendChild(canvas)
    demoState.instance?.stop?.()
    demoState.instance = await fireworks.create(canvas, {
      count: demoState.config.count,
      colors: demoState.config.colors,
      speed: {
        min: Math.max(1, demoState.config.speed * 2),
        max: Math.max(6, demoState.config.speed * 6),
      },
      rate: {
        min: 1,
        max: Math.max(2, Math.round(demoState.config.count / 20)),
      },
      gravity: {
        min: 0.8,
        max: 1.2,
      },
      sounds: false,
      background: demoState.config.background,
    })
    demoState.instance?.play?.()
  }

  demoState.initialized = true
  demoState.error = null
}

export async function renderDemo(demoState, element) {
  try {
    if (demoState.definition.mode === 'engine') {
      await renderEngineDemo(demoState, element)
      return
    }

    await renderBundleDemo(demoState, element)
  } catch (error) {
    demoState.error = error instanceof Error ? error.message : 'Unknown render error'
    demoState.initialized = false
    element.replaceChildren()
  }
}

export function pauseDemo(demoState) {
  demoState.instance?.pause?.()
}

export function playDemo(demoState) {
  demoState.instance?.play?.()
}

export function stopDemo(demoState) {
  if (demoState.intervalId) {
    clearInterval(demoState.intervalId)
    demoState.intervalId = undefined
  }

  demoState.instance?.stop?.()
  demoState.instance?.destroy?.()
}
