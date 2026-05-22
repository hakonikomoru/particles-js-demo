export const supportedLocales = ['ja', 'en']

const storageKey = 'tsparticles-demo-locale'

const messages = {
  ja: {
    languageLabel: 'Language',
    heroEyebrow: 'tsParticles Demo Tool',
    heroTitle: 'tsParticles の表現をカテゴリ別に試せるデモカタログ',
    heroLead:
      'presets, shapes, plugins, paths, palettes, focused APIs を一画面で見比べながら、粒子数・速度・サイズなどの設定をその場で調整できます。',
    heroNoteCategoryTitle: 'Explore by category',
    heroNoteCategoryBody: 'tsParticles の主要な表現を用途ごとのカテゴリで整理しています。',
    heroNoteTuneTitle: 'Tune each demo',
    heroNoteTuneBody: 'デモごとの操作パネルと実装コードを並べて確認できます。',
    resourcesEyebrow: 'Official resources',
    resourcesTitle: 'tsParticles 公式リンク',
    resourcesBody:
      'このデモカタログは tsParticles の設定や API を試すための補助ツールです。詳細な仕様、最新のガイド、公式デモは公式リソースを参照してください。',
    docsLabel: '公式ドキュメント',
    demosLabel: '公式プリセット一覧',
    codeSample: 'Code sample',
    pause: '停止',
    resume: '再開',
    randomize: 'ランダム',
    reset: 'この行を初期値に戻す',
    retry: '再生',
    retrying: '再生中...',
    loading: 'Loading demo...',
    renderErrorTitle: 'This demo failed to render.',
    startupError: 'Catalog の初期化に失敗しました',
    adLabel: 'Advertisement',
  },
  en: {
    languageLabel: 'Language',
    heroEyebrow: 'tsParticles Demo Tool',
    heroTitle: 'A category-based demo catalog for tsParticles effects',
    heroLead:
      'Compare presets, shapes, plugins, paths, palettes, and focused APIs in one place while tuning particle count, speed, size, and interactions live.',
    heroNoteCategoryTitle: 'Explore by category',
    heroNoteCategoryBody: 'Major tsParticles effects are grouped by use case and implementation style.',
    heroNoteTuneTitle: 'Tune each demo',
    heroNoteTuneBody: 'Each demo includes its own controls and a matching code sample.',
    resourcesEyebrow: 'Official resources',
    resourcesTitle: 'tsParticles official links',
    resourcesBody:
      'This catalog is a companion tool for trying tsParticles options and APIs. For complete specs, current guides, and official demos, refer to the official resources.',
    docsLabel: 'Official documentation',
    demosLabel: 'Official presets',
    codeSample: 'Code sample',
    pause: 'Pause',
    resume: 'Resume',
    randomize: 'Randomize',
    reset: 'Reset this demo',
    retry: 'Play',
    retrying: 'Playing...',
    loading: 'Loading demo...',
    renderErrorTitle: 'This demo failed to render.',
    startupError: 'Failed to initialize the catalog',
    adLabel: 'Advertisement',
  },
}

const categoryText = {
  ja: {
    presets: 'すぐに背景や演出として使いやすい、完成形に近い tsParticles 設定集。',
    shapes:
      'circle, image, text, polygon など、粒子の shape type ごとの見え方を比較できます。',
    plugins:
      'emitters, absorbers, polygon mask, mouse interactions などの拡張表現を試せます。',
    'paths-effects': 'Brownian, grid, spiral などの移動 path と effect 系の違いを確認できます。',
    palettes: '色、グラデーション、スタイル設定による印象の違いを比較できます。',
    bundles: 'particles(), confetti(), fireworks() など、目的別 API の最小構成を試せます。',
  },
  en: {
    presets: 'Ready-to-use tsParticles configurations for backgrounds and visual effects.',
    shapes: 'Compare particle shape types such as circle, image, text, and polygon.',
    plugins:
      'Try extended effects such as emitters, absorbers, polygon masks, and mouse interactions.',
    'paths-effects':
      'Compare movement paths and effects including Brownian, grid, and spiral motion.',
    palettes: 'Compare how colors, gradients, and style options change the overall mood.',
    bundles: 'Try minimal examples for focused APIs such as particles(), confetti(), and fireworks().',
  },
}

const demoDescriptions = {
  en: {
    ambient: 'A soft ambient background with gently drifting particles.',
    basic: 'A minimal particles background.',
    'big-circles': 'A preset-style effect with large floating circles.',
    'bubbles-preset': 'A combination of bubble interactions and round particles.',
    'confetti-preset': 'A colorful preset with a confetti-like feel.',
    'confetti-cannon': 'A confetti cannon style effect launching from the center.',
    snow: 'A slow falling snow preset.',
    fire: 'Warm particles with a fire-like mood.',
    firefly: 'A glowing firefly effect for dark backgrounds.',
    'sea-anemone': 'An organic preset with soft, flowing movement.',
    'fountain-preset': 'A fountain-style preset that emits particles from the bottom.',
    hyperspace: 'A fast preset with a strong sense of depth.',
    links: 'A classic connected-particle network background.',
    stars: 'A space-like star field preset.',
    'fireworks-config': 'A fireworks effect built from configuration options.',
    squares: 'A preset that brings square particles to the foreground.',
    'falling-confetti': 'A preset with continuously falling confetti.',
    matrix: 'A digital matrix-style configuration.',
    triangles: 'A triangle particle preset.',
    'shape-arrow': 'Preview how the arrow shape is rendered.',
    'shape-cards': 'Preview how the card shape is rendered.',
    'shape-image': 'Preview how image particles are rendered.',
    'shape-line': 'Compare line and polygon-style shapes.',
    'shape-cog': 'Preview how the cog shape is rendered.',
    'shape-emoji': 'Preview how emoji particles are rendered.',
    'shape-heart': 'Preview how the heart shape is rendered.',
    'shape-rounded-rect': 'Preview how the rounded rectangle shape is rendered.',
    'shape-rounded-polygon': 'Preview how the rounded polygon shape is rendered.',
    'shape-spiral': 'Preview how the spiral shape is rendered.',
    'shape-squircle': 'Preview how the squircle shape is rendered.',
    'shape-path': 'Preview how path-based shapes are rendered.',
    'shape-text': 'Preview text and multiline text particle shapes.',
    absorbers: 'A standard demo for the absorber plugin.',
    emitter: 'A standard demo for the emitters plugin.',
    'emitter-absorber': 'A combination of particle emitters and absorbers.',
    'polygon-mask': 'A configuration using the polygon mask plugin.',
    bubble: 'Preview the hover bubble interaction behavior.',
    repulse: 'Preview the standard repulse interaction behavior.',
    'light-hover': 'A light-style hover interaction.',
    'mouse-trail': 'An interaction based on the mouse trail.',
    'mouse-cannon': 'A mouse cannon interaction effect.',
    infection: 'A plugin demo that spreads like an infection.',
    'path-brownian': 'Movement from the Brownian path generator.',
    'path-grid': 'Movement from the grid path generator.',
    'path-spiral': 'Movement from the spiral path generator.',
    'path-zigzag': 'Movement from the zig-zag path generator.',
    'effect-bubble': 'Preview the bubble effect.',
    'effect-particles': 'Preview the particles effect.',
    'effect-trail': 'Preview the trail effect.',
    gradients: 'Compare palette and gradient colors.',
    'named-colors': 'A palette/configuration based on named colors.',
    style: 'Preview style and palette-based options.',
    'bundle-particles': 'A simple background built with the focused particles() API.',
    'bundle-confetti': 'A celebration effect built with the focused confetti() API.',
    'bundle-fireworks': 'A fireworks launch effect built with the focused fireworks() API.',
  },
}

const controlLabels = {
  ja: {
    count: '粒子数',
    speed: '速度',
    size: 'サイズ',
    linkDistance: '接続距離',
    repulseDistance: 'ホバー強度',
    linksEnabled: '線',
    soundActivated: 'サウンド',
    hoverEnabled: 'Hover',
    clickEnabled: 'Click',
  },
  en: {
    count: 'Count',
    speed: 'Speed',
    size: 'Size',
    linkDistance: 'Link distance',
    repulseDistance: 'Hover strength',
    linksEnabled: 'Links',
    soundActivated: 'Sound',
    hoverEnabled: 'Hover',
    clickEnabled: 'Click',
  },
}

function normalizeLocale(locale) {
  return supportedLocales.includes(locale) ? locale : 'ja'
}

export function getInitialLocale() {
  let storedLocale

  try {
    storedLocale = window.localStorage.getItem(storageKey)
  } catch {
    storedLocale = undefined
  }

  if (storedLocale) {
    return normalizeLocale(storedLocale)
  }

  return normalizeLocale(window.navigator.language?.slice(0, 2))
}

export function saveLocale(locale) {
  try {
    window.localStorage.setItem(storageKey, normalizeLocale(locale))
  } catch {
    // Language switching still works for the current session when storage is unavailable.
  }
}

export function getMessages(locale) {
  return messages[normalizeLocale(locale)]
}

export function getLocalizedCategory(category, locale) {
  const normalizedLocale = normalizeLocale(locale)

  return {
    ...category,
    description: categoryText[normalizedLocale]?.[category.id] ?? category.description,
  }
}

export function getLocalizedDemo(demo, locale) {
  const normalizedLocale = normalizeLocale(locale)

  return {
    ...demo,
    description: demoDescriptions[normalizedLocale]?.[demo.id] ?? demo.description,
  }
}

export function getControlLabel(control, locale) {
  const normalizedLocale = normalizeLocale(locale)

  return controlLabels[normalizedLocale]?.[control.field] ?? control.label
}
