# Developer Guide — Adding a Module

This walks through plugging a new grammar module (e.g. Verb Conjugation)
into the foundation. Read NODE_SPEC.md and GRAPH_SPEC.md first — this is
the "how", those are the "what".

## 0. Confirm it's actually next

Check Part I §4's roadmap and Part IV's queued order
(particles [frozen] → verb conjugation → adjectives + minimal clause
connection → aspect ている → giving/receiving → conditionals → honorifics).
Dependency order is a hard constraint, not a suggestion — don't build
aspect before verb conjugation exists, even if it seems tractable.

## 1. Register the module

In `index.html`, DATA section, append to `MODULES`:

```js
{ id: 'verb-conjugation', name: { zh: '动词变位引擎', ja: '動詞活用エンジン' },
  order: 20, status: 'draft', description: '...' }
```

## 2. Register error roots and criteria before writing nodes

Check the registries (`ERROR_ROOTS`, `CRITERIA` arrays) for collisions
first — criteria are the atomic review unit, and duplicating one under a
new id breaks the scheduler's per-criterion streak tracking. Add new
entries with the new `module` id.

## 3. Write nodes against the qualification tests

For each candidate node, verify it passes the independent-mechanism test
plus at least one of citation/error-root/merge (NODE_SPEC.md). Write the
result into `qualifies` — this is the paper trail for why the node exists,
so a later reviewer isn't re-litigating scope.

Respect the hard caps while drafting, not after: Layer 0 <=150 chars,
Layer 1 2-5 Steps each <=400 chars, Layer 2 <=4 boundary cases. If a Step
count wants to grow past 5, split the node — do not raise the cap.

## 4. Wire `refs`

- `requires`: only actual hard prerequisites — this gates unlock.
- `invokes`: any mechanism explanation longer than two sentences that
  belongs to another node. If no owner exists yet, that's a sign the
  dependency should be built first (see step 0).
- `contrasts`: near-confusable forms; add the edge on both nodes.
- `previews`: only to nodes that exist and are currently locked.

## 5. Write exercises

Every exercise needs the mandatory triple (`stepId`/`criterionId`/
`errorRoot`) and a certainty level. Default to A whenever the judgment is
truly deterministic; do not force B/C content into A-level grading just to
make it auto-gradable — miscalibrated certainty corrupts the error book.

## 6. Smoke test manually

Open `index.html` directly in a browser (no server needed). Walk the tab
order: 学习 -> 练习 -> 错题本 -> 复习 -> 进度 -> 图谱 -> 数据. Specifically
check:

- The new node's Layer 0/1/2 render without overflow/truncation issues.
- At least one exercise of each certainty level you used grades correctly.
- A deliberately wrong A/B-level answer shows up in 错题本 under the right
  root, and resets that criterion's streak in 进度.
- A C-level exercise never shows a "correct answer" and never appears in
  错题本.
- Export JSON, clear localStorage (devtools), re-import, confirm state
  round-trips.
- If you added `requires` edges, confirm downstream nodes are locked until
  the prerequisite criteria are internalized (streak >= 3, simulate via
  repeated correct answers).

There is no automated test suite by design (Part IV: no build step for the
shipped artifact). This manual walkthrough is the actual definition-of-done
gate from Part IV: study it, exercise it, error-classify it, review it,
attempt transfer — all five, inside the app, before calling a module done.

## 7. Freeze discipline

A module only reaches `status: 'frozen'` after the real-learning validation
loop (Part II Principle 4): learner studies it, logs where understanding
failed, you revise, then freeze. Do not set `frozen` on first pass just
because the content feels finished — that is scope creep in reverse
(pretending done before validated).

## Anti-patterns to catch in review

- A new UI paradigm/component library "because this module needs it" —
  should almost always reuse the existing node renderer + exercise engine.
- A parallel storage key — must extend `jca_state_v1`, never add a second
  key.
- A frequency/usage-rate claim without a `source` string in the data — must
  be deleted, not hedged.
- "Native speakers just feel it" anywhere in node prose — banned outside of
  being the explicit thing under explanation (Part I, Linguistic
  Foundations).
