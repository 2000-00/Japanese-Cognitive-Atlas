# Architecture (V1 — frozen)

This is the V1 architecture. Per Part II Principle 1 of the design prompt,
**do not redesign this** unless real learning practice (a logged study
session, not a reading of this document) has surfaced a concrete problem
this architecture cannot handle. "This could be cleaner" is not a concrete
problem.

## Shape of the system

One artifact: `index.html`. Inline CSS, inline JS, no external CDN, no
build step, no framework. It must open by double-click in iPad Safari and
desktop browsers. Everything else in this repo (`docs/`) is developer-facing
and never shipped to the learner.

```
index.html          <- the entire product: data + engine + UI, single file
docs/
  ARCHITECTURE.md    <- this file
  NODE_SPEC.md       <- data schema (Node/Criterion/ErrorRoot/Exercise/Module/State)
  GRAPH_SPEC.md       <- edge semantics, unlock rules, validation
  DEV_GUIDE.md       <- how to add a module, step by step
README.md            <- entry point, quick start
```

There is deliberately no `src/`, no `modules/*.js`, no bundler. New content
is added by editing the `DATA` section of `index.html` directly — appending
to the `NODES`, `CRITERIA`, `ERROR_ROOTS`, `MODULES`, and `EXERCISES`
arrays. This is the "plug-in" mechanism: a module is a set of array entries
sharing a `module` id, not a separate app.

Why one file and not one file per module loaded via `<script src>`: `file://`
script loading is inconsistent enough across mobile Safari/security contexts
that Part IV requires the single-file guarantee to be literal, not "mostly
one file." The cost is a growing `index.html`; that cost is accepted
knowingly, not an oversight.

## Layers inside `index.html`

1. **DATA** — `MODULES`, `CRITERIA`, `ERROR_ROOTS`, `NODES`, `EXERCISES`.
   Pure data, no functions. This is what content authors touch.
2. **STORAGE** — versioned localStorage read/write, JSON export/import,
   schema migration hook (`schemaVersion`). One store for the whole app;
   never per-module storage (Part IV: "never create a parallel schema").
3. **ENGINE** — pure functions operating on DATA + STORAGE:
   - node rendering (Layer 0/1/2)
   - exercise grading (A/B/C certainty rules)
   - error-book classification (by root)
   - SRS scheduling (by criterion, streak-based)
   - graph traversal/validation (see GRAPH_SPEC.md)

   Built on top of the frozen engine, as separate read-only sections
   (added later, each justified by an explicit product requirement):
   - **3b PRESENTATION HELPERS** — derived view values (estimates,
     confidence labels, progress rollups). Never mutate STATE.
   - **3c KNOWLEDGE GRAPH LAYER** — `knowledgePosition` metadata rendering,
     derived relations (`getKnowledgeRelations`), trust badges, Source
     Library (`SOURCES`, mirrors `resources/sources.json`).
   - **3d GRAPH INTELLIGENCE ENGINE** — reasoning over graph + SRS state:
     `computeNodeIntelligence` (state/weak/review-due flags + priority
     **with human-readable reasons** — the engine must always be able to
     explain a recommendation, never just emit a score),
     `recommendNextNodes`, `learningPathTo`, `whyNodeMatters`,
     reverse-edge lookups (`downstreamNodeIds`, `citedByNodeIds`,
     `previewedByNodeIds`). Drives the Study hero, the graph flags, and
     the side panel. Read-only over STATE.
   - **3e TEXT ANALYZER** — the deterministic scaffold of the future AI
     parsing layer: surface-pattern detectors (`TEXT_DETECTORS`, one per
     node, honestly labeled 教学简化) feeding `analyzeText`, which does the
     permanent part — graph reasoning (mastery lookup, missing-prerequisite
     detection, dependency-ordered study plan). The detector layer is
     designed to be replaced by a real parser/LLM backend; everything
     downstream of the detection result already is the final architecture.
4. **UI** — tab router + DOM rendering built on top of ENGINE. No virtual
   DOM, no reactive framework — direct `innerHTML`/DOM calls, because the
   whole app is small enough that this stays legible.

Every module (particles, verb conjugation, adjectives, aspect, ...) is
DATA-only. It reuses layers 2–4 unchanged. If a future module seems to need
a new UI paradigm, that is exactly the kind of decision Part II says must
wait for a concrete, logged learning problem — raise it, don't build it
speculatively.

## Visual language (already established — do not redesign, Part IV)

CSS custom properties for particle colors are defined even though no
particle content ships in this foundation, so the first particle module can
consume them without touching CSS architecture:

```
--particle-wa: #BE3A2B;  /* は */
--particle-ga: #2563A8;  /* が */
--particle-wo: #2E7D5B;  /* を */
--particle-ni: #6D4FA3;  /* に */
--particle-de: #A8641C;  /* で */
```

Washi-paper background, Mincho serif (`.jp` class) for Japanese example
text. Color encodes function category, never correctness — correctness
uses a separate semantic (success/error) that must never reuse a particle
hue.

## What is explicitly NOT in the foundation

- No particle/verb/adjective/aspect content — those are future modules,
  built one at a time per Part II Principle 3 (MVP route).
- No visual force-directed graph — see GRAPH_SPEC.md rendering note.
- No server, no accounts, no sync beyond JSON export/import.
- No test framework/build tooling — Part IV forbids a build step for the
  shipped artifact; manual smoke-testing (open the file, click through) is
  the verification method, documented per change in DEV_GUIDE.md.
