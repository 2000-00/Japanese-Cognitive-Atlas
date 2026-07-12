# Japanese Cognitive Atlas

A single-file Japanese learning system built around cognitive mechanism
first, memorization second. See `docs/` for the full design rationale; this
README is just the quick start.

This repo now ships **two apps**:

1. `index.html` — the Knowledge Atlas (below).
2. `trainer.html` — **Minna Japanese Trainer**（《大家的日语》1～21课综合
   训练系统）: number/time/date/counter/yen reaction drills, listening,
   grammar, reading, adaptive training, error book, reaction-time stats,
   and a data-review workflow that keeps unverified textbook claims out of
   formal training. See `docs/TRAINER_GUIDE.md`. Trainer questions link
   back to real Atlas node ids via `knowledgeMap`.

## Quick start

Open `index.html` (Atlas) or `trainer.html` (Trainer) directly in a
browser (double-click it, or drag it into a browser window). No build
step, no server, no install.

- **学习 (Study)** — browse nodes, read Layer 0/1/2.
- **练习 (Practice)** — run exercises, graded A/B/C.
- **错题本 (Error Book)** — mistakes grouped by root cause, not by question.
- **复习 (Review)** — criterion-based spaced review queue.
- **进度 (Progress)** — per-criterion streaks and internalization state.
- **图谱 (Roadmap)** — the one learning path, with lock/unlock state.
- **数据 (Data)** — export/import your progress as JSON.

## Status

This is the **foundation** — app shell + reusable learning engine, no
grammar content yet. One template node ships purely to demonstrate the
schema and let you smoke-test the engine end to end; it lives in a module
with `status: 'template'` and is hidden from every view by default. Toggle
"开发模式" (top right) to reveal it.

Grammar modules (particles, verb conjugation, adjectives, aspect, ...) are
built one at a time on top of this foundation, in dependency order. See
`docs/DEV_GUIDE.md` to add one.

## Docs

- `docs/ARCHITECTURE.md` — system shape, why single-file, layer breakdown.
- `docs/NODE_SPEC.md` — the data schema every module must follow.
- `docs/GRAPH_SPEC.md` — how `requires`/`invokes`/`contrasts`/`previews` work.
- `docs/DEV_GUIDE.md` — step-by-step guide to adding a module.
