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
          <span class="eyebrow">tsParticles Demo Tool</span>
          <h1>tsParticles の表現をカテゴリ別に試せるデモカタログ</h1>
          <p class="lead">
            presets, shapes, plugins, paths, palettes, focused APIs を一画面で見比べながら、
            粒子数・速度・サイズなどの設定をその場で調整できます。
          </p>
          <div class="hero-notes hero-notes-single">
            <div class="note">
              <strong>Explore by category</strong>
              <span>tsParticles の主要な表現を用途ごとのカテゴリで整理しています。</span>
            </div>
            <div class="note">
              <strong>Tune each demo</strong>
              <span>デモごとの操作パネルと実装コードを並べて確認できます。</span>
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

      <section class="resource-section surface" aria-labelledby="resources-title">
        <div>
          <span class="eyebrow">Official resources</span>
          <h2 id="resources-title">tsParticles 公式リンク</h2>
          <p>
            このデモカタログは tsParticles の設定や API を試すための補助ツールです。
            詳細な仕様、最新のガイド、公式デモは公式リソースを参照してください。
          </p>
        </div>
        <div class="resource-grid">
          <a href="https://particles.js.org/" target="_blank" rel="noreferrer" class="resource-link">
            <strong>Website</strong>
            <span>particles.js.org</span>
          </a>
          <a href="https://particles.js.org/docs/" target="_blank" rel="noreferrer" class="resource-link">
            <strong>Docs</strong>
            <span>公式ドキュメント</span>
          </a>
          <a href="https://particles.js.org/demos/presets" target="_blank" rel="noreferrer" class="resource-link">
            <strong>Demos</strong>
            <span>公式プリセット一覧</span>
          </a>
          <a href="https://github.com/tsparticles/tsparticles" target="_blank" rel="noreferrer" class="resource-link">
            <strong>GitHub</strong>
            <span>tsparticles/tsparticles</span>
          </a>
        </div>
      </section>

      <aside class="ad-placement" data-ad-unit="top" aria-label="Advertisement"></aside>

      ${catalog.demosByCategory
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
                              <span class="toolbar-label">Code sample</span>
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
            ${index === 1 ? '<aside class="ad-placement" data-ad-unit="in-feed" aria-label="Advertisement"></aside>' : ''}
          `,
        )
        .join('')}
    </main>
  `
}
