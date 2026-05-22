import { getEscapedDemoCode } from './codegen'

function renderControl(control, value) {
  if (control.type === 'checkbox') {
    return `
      <label class="mini-toggle">
        <span>${control.label}</span>
        <input data-field="${control.field}" type="checkbox" ${value ? 'checked' : ''} />
      </label>
    `
  }

  return `
    <label class="inline-control">
      <span>${control.label}</span>
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

export function renderPage(catalog, demoStateMap) {
  return `
    <main class="layout">
      <section class="hero-panel surface hero-single">
        <div class="hero-copy">
          <span class="eyebrow">Live tsParticles catalog</span>
          <h1>カテゴリごとに demo を縦並びで網羅したローカル catalog</h1>
          <p class="lead">
            公式サイトで見える demo の考え方に合わせて、presets / shapes / plugins /
            paths / palettes / focused APIs をカテゴリ分けして並べています。
          </p>
          <div class="hero-notes hero-notes-single">
            <div class="note">
              <strong>Category-based</strong>
              <span>official site の見せ方に近い単位で整理しています。</span>
            </div>
            <div class="note">
              <strong>Per-row controls</strong>
              <span>各 row ごとに個別設定して差分を確認できます。</span>
            </div>
          </div>
        </div>
      </section>

      <nav class="category-nav surface">
        ${catalog.categories
          .map(
            (category) =>
              `<a href="#category-${category.id}" class="category-link">${category.label}</a>`,
          )
          .join('')}
      </nav>

      ${catalog.demosByCategory
        .map(
          (category) => `
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

                          <aside class="code-panel">
                            <div class="preview-toolbar">
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-dot"></span>
                              <span class="toolbar-label">Implementation</span>
                            </div>
                            <pre class="code-block"><code data-code="${demo.id}">${getEscapedDemoCode(state)}</code></pre>
                          </aside>
                        </div>

                        <div class="demo-controls-row">
                          ${demo.controls
                            .map((control) => renderControl(control, state.config[control.field]))
                            .join('')}
                        </div>

                        <div class="demo-actions">
                          <button class="button secondary" data-action="pause" type="button">停止</button>
                          <button class="button secondary" data-action="resume" type="button">再開</button>
                          <button class="button secondary" data-action="randomize" type="button">ランダム</button>
                          <button class="button primary" data-action="reset" type="button">この行を初期値に戻す</button>
                        </div>
                      </article>
                    `
                  })
                  .join('')}
              </div>
            </section>
          `,
        )
        .join('')}
    </main>
  `
}
