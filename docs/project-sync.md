# Project Sync

## このサイトの目的

このサイトは、tsParticles のデモ表現をカテゴリ別に見比べるためのデモツールです。presets, shapes, plugins, paths, palettes, focused APIs を一覧化し、各デモで粒子数・速度・サイズ・リンク・ホバーなどの値を調整しながら、同じ画面で実装コードも確認できます。

公開先は Vercel を想定しています。Vite で `dist` に静的ビルドし、Vercel が `vercel.json` の設定に従って自動デプロイします。

## 全体構造

```text
.
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
├── .env.example
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.js
│   ├── style.css
│   ├── catalog/
│   │   ├── categories.js
│   │   ├── controls.js
│   │   ├── demos.js
│   │   └── index.js
│   └── lib/
│       ├── codegen.js
│       ├── monetization.js
│       ├── render.js
│       ├── runtime.js
│       └── utils.js
└── docs/
    └── project-sync.md
```

## 実行とデプロイ

- `npm run dev`: ローカル開発サーバーを起動します。
- `npm run build`: Vite が本番用ファイルを `dist` に生成します。
- `npm run preview`: 生成済みの `dist` をローカルで確認します。
- `vercel.json`: Vercel で `npm ci`、`npm run build`、`dist` 配信を明示しています。
- `package.json`: Vercel とローカルの Node 差分を避けるため `engines.node` を `22.x` に固定しています。
- `.env.example`: Google Analytics と Google AdSense の環境変数サンプルです。Vercel では Project Settings の Environment Variables に同じキーを登録します。

## 外部サービス設定

### Google Analytics

`VITE_GA_MEASUREMENT_ID` に GA4 の測定 ID を設定すると、`src/lib/monetization.js` が `gtag.js` を読み込みます。未設定の場合は Analytics タグを挿入しません。

```text
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Google AdSense

`VITE_ADSENSE_CLIENT` と広告ユニットごとの slot ID を設定すると、ページ内の広告枠が AdSense の `<ins class="adsbygoogle">` に差し替わります。未設定の場合、広告枠は DOM から削除されます。

```text
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT_TOP=1234567890
VITE_ADSENSE_SLOT_IN_FEED=0987654321
```

現在の広告枠:

- `top`: 公式リンクセクションの下
- `in-feed`: `Shapes` セクションの後

### tsParticles 公式リンク

画面上の公式リンクは `src/lib/render.js` にあります。現在は公式サイト、Docs、公式プリセットデモ、GitHub へリンクしています。

## 起動時の流れ

1. `index.html` が `src/main.js` を読み込みます。
2. `main.js` が `getCatalog()` でカテゴリとデモ定義を取得します。
3. `createDemoState()` が各デモの初期状態を作ります。
4. `renderPage()` がヒーロー、カテゴリナビ、デモ一覧、操作 UI、コード表示を HTML として生成します。
5. `main.js` が各デモ行にイベントリスナーを設定します。
6. `ensureEngineLoaded()` で tsParticles の engine/bundle を読み込みます。
7. `setupMonetization()` が Analytics と AdSense の環境変数を確認し、設定がある場合だけ外部タグを読み込みます。
8. `IntersectionObserver` により、画面に近いデモだけを遅延レンダリングします。

## 主要ファイルの役割

### `src/main.js`

アプリのエントリーポイントです。カタログ取得、状態作成、HTML 描画、フォーム操作、停止・再開・ランダム・リセットのイベント設定、遅延レンダリングを担当します。

重要な関数:

- `syncRow(demoId)`: デモ状態を UI の入力値とコード表示へ反映します。
- `refreshDemo(demoId)`: 対象デモを再描画します。
- `bindRow(demoId)`: 操作 UI とボタンのイベントを接続します。
- `setupLazyRendering()`: 表示領域に入ったデモだけを再生・描画します。

### `src/lib/render.js`

画面全体の HTML を生成します。公開時に見える冒頭文、カテゴリナビ、各デモ行、プレビュー、コードパネル、操作 UI の構造はここにあります。文言や UI の並びを変えるときは最初に確認するファイルです。

### `src/lib/runtime.js`

tsParticles を実際に動かす処理です。engine ベースのデモと focused API ベースのデモを分けてレンダリングします。

- engine 系: `tsParticles.load()` を使います。
- focused API 系: `particles.create()`, `confetti.create()`, `fireworks.create()` を使います。
- 共通設定: `applyCommonOverrides()` が粒子数、速度、サイズ、リンク距離などを反映します。

### `src/lib/codegen.js`

各デモの右側に表示する実装サンプルコードを生成します。デモ状態が変わると `main.js` 経由で再生成され、現在の設定に近いコードが表示されます。

### `src/lib/monetization.js`

Google Analytics と Google AdSense の読み込みを担当します。Vite の `import.meta.env` から `VITE_GA_MEASUREMENT_ID`, `VITE_ADSENSE_CLIENT`, `VITE_ADSENSE_SLOT_TOP`, `VITE_ADSENSE_SLOT_IN_FEED` を読み取り、値がある場合だけタグを挿入します。

### `src/catalog/categories.js`

カテゴリの ID、表示名、説明文を定義します。カテゴリナビとセクション見出しの元データです。新しいカテゴリを追加する場合は、このファイルに追加し、`demos.js` の `categoryId` と一致させます。

### `src/catalog/demos.js`

各 tsParticles デモの定義一覧です。デモ ID、カテゴリ、表示名、説明文、使用する `@tsparticles/configs` のキー、特徴タグ、設定上書きを管理します。

新しい engine 系デモを追加する基本形:

```js
baseDemo({
  id: 'my-demo',
  categoryId: 'presets',
  label: 'My Demo',
  description: 'デモの説明文。',
  configKey: 'basic',
  features: ['tag'],
  optionOverrides: {
    particles: {
      move: { speed: 2 },
    },
  },
})
```

focused API 系デモは `mode` に `particles-api`, `confetti-api`, `fireworks-api` のいずれかを指定し、`config` に初期値を持たせます。

### `src/catalog/controls.js`

各デモに表示する操作 UI の定義です。`defaultControls` は engine 系、`bundleControls` は focused API 系で使っています。range と checkbox をサポートしています。

### `src/catalog/index.js`

`categories` と `demos` を結合して、カテゴリごとのデモ一覧 `demosByCategory` を作ります。画面描画側はこの集約済みデータを使います。

### `src/lib/utils.js`

深いコピーやランダム値生成など、複数ファイルで使う小さなユーティリティを置いています。

### `src/style.css`

全体レイアウト、ヒーロー、カテゴリナビ、デモ行、プレビュー、コードパネル、操作 UI、レスポンシブ表示のスタイルを管理します。

## データの持ち方

各デモは `demos.js` の定義と、`runtime.js` で作られる状態に分かれます。

- 定義: `id`, `categoryId`, `label`, `description`, `controls`, `features`, `mode`, `options`, `optionOverrides`
- 状態: `config`, `instance`, `initialized`, `rendering`, `error`, `intervalId`

ユーザーが操作 UI を変更すると、`config` が更新されます。その後、プレビュー再描画とコードサンプル更新が走ります。

## 更新時のチェックポイント

- 表示文言を変える: `src/lib/render.js`, `src/catalog/categories.js`, `src/catalog/demos.js`
- 新しいデモを追加する: `src/catalog/demos.js`
- 操作 UI を増やす: `src/catalog/controls.js`, 必要なら `src/lib/runtime.js` と `src/lib/codegen.js`
- レイアウトを変える: `src/lib/render.js`, `src/style.css`
- 公式リンクを変える: `src/lib/render.js`
- 広告枠を変える: `src/lib/render.js`, `src/lib/monetization.js`, `src/style.css`
- 計測タグを変える: `src/lib/monetization.js`
- デプロイ設定を変える: `vercel.json`, `package.json`

変更後は `npm run build` を実行して、Vercel と同じ本番ビルドが通ることを確認します。
