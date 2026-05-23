import { getEscapedDemoCode } from './codegen'
import {
  getControlLabel,
  getLocalizedCategory,
  getLocalizedDemo,
  getMessages,
  supportedLocales,
} from './i18n'

function renderControl(control, value, locale) {
  const label = getControlLabel(control, locale)

  if (control.type === 'checkbox') {
    return `
      <label class="mini-toggle ${control.field === 'soundActivated' ? 'mini-toggle-stacked' : ''}">
        <span>${label}</span>
        <span class="toggle-control">
          <input data-field="${control.field}" type="checkbox" ${value ? 'checked' : ''} />
          <span class="toggle-switch" aria-hidden="true"></span>
        </span>
      </label>
    `
  }

  return `
    <label class="inline-control">
      <span>${label}</span>
      <input
        data-field="${control.field}"
        type="range"
        min="${control.min}"
        max="${control.max}"
        step="${control.step}"
        value="${value}"
      />
      <strong data-output="${control.field}">${value}</strong>
    </label>
  `
}

function renderLanguageSwitcher(locale, copy) {
  return `
    <label class="language-switcher">
      <span>${copy.languageLabel}</span>
      <select data-language-select aria-label="${copy.languageLabel}">
        ${supportedLocales
          .map(
            (option) =>
              `<option value="${option}" ${option === locale ? 'selected' : ''}>${option.toUpperCase()}</option>`,
          )
          .join('')}
      </select>
    </label>
  `
}

function getControlsForDemo(demo, state) {
  const controls = [...demo.controls]

  if (state.hasSound) {
    controls.push({ field: 'soundActivated', label: 'Sound', type: 'checkbox' })
  }

  return controls
}

export function renderPage(catalog, demoStateMap, locale) {
  const copy = getMessages(locale)
  const categories = catalog.categories.map((category) => getLocalizedCategory(category, locale))
  const demosByCategory = catalog.demosByCategory.map((category) => ({
    ...getLocalizedCategory(category, locale),
    demos: category.demos.map((demo) => getLocalizedDemo(demo, locale)),
  }))

  return `
    <main class="layout">
      <section class="hero-panel surface hero-single">
        <div class="hero-tools">
          ${renderLanguageSwitcher(locale, copy)}
        </div>
        <div class="hero-copy">
          <span class="eyebrow">${copy.heroEyebrow}</span>
          <h1>${copy.heroTitle}</h1>
          <p class="lead">${copy.heroLead}</p>
          <div class="hero-notes hero-notes-single">
            <div class="note">
              <strong>${copy.heroNoteCategoryTitle}</strong>
              <span>${copy.heroNoteCategoryBody}</span>
            </div>
            <div class="note">
              <strong>${copy.heroNoteTuneTitle}</strong>
              <span>${copy.heroNoteTuneBody}</span>
            </div>
          </div>
        </div>
      </section>

      <nav class="category-nav surface">
        ${categories
          .map(
            (category) =>
              `<a href="#category-${category.id}" class="category-link">${category.label}</a>`,
          )
          .join('')}
      </nav>

      <section class="resource-section surface" aria-labelledby="resources-title">
        <div>
          <span class="eyebrow">${copy.resourcesEyebrow}</span>
          <h2 id="resources-title">${copy.resourcesTitle}</h2>
          <p>${copy.resourcesBody}</p>
        </div>
        <div class="resource-grid">
          <a href="https://particles.js.org/" target="_blank" rel="noreferrer" class="resource-link">
            <strong>Website</strong>
            <span>particles.js.org</span>
          </a>
          <a href="https://particles.js.org/docs/" target="_blank" rel="noreferrer" class="resource-link">
            <strong>Docs</strong>
            <span>${copy.docsLabel}</span>
          </a>
          <a href="https://particles.js.org/demos/presets" target="_blank" rel="noreferrer" class="resource-link">
            <strong>Demos</strong>
            <span>${copy.demosLabel}</span>
          </a>
          <a href="https://github.com/tsparticles/tsparticles" target="_blank" rel="noreferrer" class="resource-link">
            <strong>GitHub</strong>
            <span>tsparticles/tsparticles</span>
          </a>
        </div>
      </section>

      <aside class="ad-placement" data-ad-unit="top" aria-label="${copy.adLabel}"></aside>

      ${demosByCategory
        .map(
          (category, index) => `
            <section class="category-section" id="category-${category.id}">
              <div class="category-header surface">
                <div>
                  <span class="eyebrow">${category.label}</span>
                  <h2>${category.label}</h2>
                </div>
                <p>${category.description}</p>
              </div>
              <div class="demo-list">
                ${category.demos
                  .map((demo) => {
                    const state = demoStateMap.get(demo.id)
                    const controls = getControlsForDemo(demo, state)

                    return `
                      <article class="demo-row surface" data-demo="${demo.id}">
                        <div class="demo-meta">
                          <div class="demo-title-row">
                            <div>
                              <span class="eyebrow">${category.label}</span>
                              <h3>${demo.label}</h3>
                            </div>
                            <div class="demo-stats">
                              ${
                                demo.features?.length
                                  ? demo.features
                                      .map((feature) => `<div class="chip small">${feature}</div>`)
                                      .join('')
                                  : ''
                              }
                            </div>
                          </div>
                          <p>${demo.description}</p>
                        </div>

                        <div class="demo-main">
                          <div class="demo-preview-shell">
                            <div class="preview-toolbar">
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-label">${demo.label}</span>
                            </div>
                            <div class="demo-preview" id="tsparticles-${demo.id}"></div>
                          </div>

                          <details class="code-panel">
                            <summary class="preview-toolbar code-summary">
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-label">${copy.codeSample}</span>
                            </summary>
                            <pre class="code-block"><code data-code="${demo.id}">${getEscapedDemoCode(state)}</code></pre>
                          </details>
                        </div>

                        <div class="demo-controls-row">
                          ${controls
                            .map((control) =>
                              renderControl(
                                control,
                                control.field in state.config
                                  ? state.config[control.field]
                                  : state[control.field],
                                locale,
                              ),
                            )
                            .join('')}
                        </div>

                        <div class="demo-actions">
                          <button class="button secondary" data-action="pause" type="button">${copy.pause}</button>
                          <button class="button secondary" data-action="resume" type="button">${copy.resume}</button>
                          <button class="button secondary" data-action="randomize" type="button">${copy.randomize}</button>
                          <button class="button primary" data-action="reset" type="button">${copy.reset}</button>
                        </div>
                      </article>
                    `
                  })
                  .join('')}
              </div>
            </section>
            ${index === 1 ? `<aside class="ad-placement" data-ad-unit="in-feed" aria-label="${copy.adLabel}"></aside>` : ''}
          `,
        )
        .join('')}

      <footer class="site-footer surface">
        <div class="footer-copy">
          <span class="footer-credit-label">${copy.footerCreditLabel}</span>
          <span class="footer-credit-name">${copy.footerCreditName}</span>
        </div>
        <div class="footer-meta">
          <span class="footer-hashtags">${copy.footerHashtags}</span>
        </div>
      </footer>
    </main>
  `
}
