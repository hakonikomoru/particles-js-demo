# particles-js-demo — agent instructions

作業前に **`docs/project-sync.md`** を読むこと。

## 実装時の必須事項

- **`src/`・`public/`・デモカタログ構成**を変えたら、同じ変更で `npm run sync:project-docs` を実行する（`docs/project-sync.md` の自動生成ブロックを更新）。
- 挙動・環境変数の説明は §「実行とデプロイ」以降も必要に応じて手で追記する。

## `docs/project-sync.md` の生成の決まり（2026-11-19）

- 生成した Markdown は **prettier を通してから書き出す**（`scripts/project-sync-core.mjs` の `formatProjectDoc()`）。`--check` も同じ整形結果と比べる。整形せずに書き出すと prettier が表を桁揃えし `<!-- sync:auto:... -->` の内側に空行を入れるため、`npm run sync:project-docs` と `npm run format:check` が互いに書き戻し合い、どちらを後に実行しても片方が必ず失敗する。
- 自動生成部分に **commit ハッシュ・生成日時など、実行のたびに変わる値を入れない**。入れるとコミットしただけで `npm run sync:project-docs:check` が「古いです」と言い続け、チェックが機能しなくなる。生成日時と対象コミットは `git log -1 -- docs/project-sync.md` で分かる。
- この 2 つは `scripts/project-sync-core.test.mjs`（vitest）で固定している。生成処理を変えたらこのテストも通すこと。
- コミット前は `npm run sync:project-docs` → `npm run precommit:check` → `npm run sync:project-docs:check` の順で通す。
