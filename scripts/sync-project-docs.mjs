import { runSync } from "./project-sync-core.mjs";

const ok = runSync(
  {
    repo: "hakonikomoru/particles-js-demo",
    rootLabel: "particles-js-demo",
    markers: ["meta", "directory-tree"],
    treeEntries: ["docs", "public", "src"],
    treeMaxDepth: 2,
  },
  { check: process.argv.includes("--check") },
);

process.exit(ok ? 0 : 1);
