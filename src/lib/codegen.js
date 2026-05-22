function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function bool(value) {
  return value ? 'true' : 'false'
}

function quote(value) {
  return JSON.stringify(value)
}

function engineSnippet(state) {
  const { definition, config } = state
  const configKey = definition.configKey ?? 'basic'

  return `import { tsParticles } from "@tsparticles/engine";
import { loadAll } from "@tsparticles/all";
import configs from "@tsparticles/configs";

await loadAll(tsParticles);

const base = configs.${configKey};

await tsParticles.load({
  id: "tsparticles",
  options: {
    ...base,
    background: { color: ${quote(config.background ?? '#0b1020')} },
    particles: {
      ...base.particles,
      number: { value: ${config.count} },
      move: { ...base.particles?.move, speed: ${config.speed} },
      size: { value: ${config.size} },
      links: {
        ...base.particles?.links,
        enable: ${bool(config.linksEnabled)},
        distance: ${config.linkDistance},
      },
    },
    interactivity: {
      ...base.interactivity,
      events: {
        ...base.interactivity?.events,
        onHover: { ...base.interactivity?.events?.onHover, enable: ${bool(config.hoverEnabled)} },
        onClick: { ...base.interactivity?.events?.onClick, enable: ${bool(config.clickEnabled)} },
      },
      modes: {
        ...base.interactivity?.modes,
        repulse: { ...base.interactivity?.modes?.repulse, distance: ${config.repulseDistance} },
        bubble: { ...base.interactivity?.modes?.bubble, distance: ${config.repulseDistance} },
      },
    },
  },
});`
}

function particlesSnippet(state) {
  const { config } = state

  return `import { particles } from "@tsparticles/particles";

const canvas = document.querySelector("canvas");

await particles.create(canvas, {
  count: ${config.count},
  speed: ${config.speed},
  radius: ${config.size},
  color: ${quote(config.colors?.[0] ?? '#38bdf8')},
  shape: ["circle", "square"],
  links: ${bool(config.links ?? true)},
  linksColor: ${quote(config.linksColor ?? '#a78bfa')},
  linksLength: 140,
  opacity: ${config.opacity ?? 0.75},
});`
}

function confettiSnippet(state) {
  const { config } = state

  return `import { confetti } from "@tsparticles/confetti";

const canvas = document.querySelector("canvas");
const launch = await confetti.create(canvas, {
  count: ${config.count},
  colors: ${JSON.stringify(config.colors ?? [], null, 2)},
  scalar: ${config.size / 4},
  startVelocity: ${config.speed * 10},
  disableForReducedMotion: true,
});

await launch();`
}

function fireworksSnippet(state) {
  const { config } = state

  return `import { fireworks } from "@tsparticles/fireworks";

const canvas = document.querySelector("canvas");

await fireworks.create(canvas, {
  colors: ${JSON.stringify(config.colors ?? [], null, 2)},
  speed: ${config.speed},
  rate: ${Math.max(1, Math.round(config.count / 20))},
  gravity: 1,
  sounds: false,
  background: {
    color: ${quote(config.background ?? '#12051f')},
  },
});`
}

export function getDemoCode(state) {
  if (state.definition.mode === 'particles-api') {
    return particlesSnippet(state)
  }

  if (state.definition.mode === 'confetti-api') {
    return confettiSnippet(state)
  }

  if (state.definition.mode === 'fireworks-api') {
    return fireworksSnippet(state)
  }

  return engineSnippet(state)
}

export function getEscapedDemoCode(state) {
  return escapeHtml(getDemoCode(state))
}
