# Graph System Specification

The Atlas is one graph, not a pile of pages. Every node's `refs` (see
NODE_SPEC.md) are edges. This document defines how those edges are
interpreted, validated, and rendered. There is exactly one graph — module
boundaries are a grouping label (`node.module`), not a graph boundary;
`requires`/`invokes`/`contrasts`/`previews` freely cross modules.

## Edge types

| Edge | Meaning | Unlock effect | Rendering |
|---|---|---|---|
| `requires` | Hard prerequisite | Target node stays locked until every `requires` source is `internalized` (see below) | Roadmap position + lock icon |
| `invokes` | Borrows another node's conclusion instead of re-explaining it | None | Inline capsule; hover/tap embeds the owner's Layer 0 body |
| `contrasts` | Same form or near-meaning, different mechanism | None | End-of-node 辨析 (contrast) section, rendered both directions |
| `previews` | Hook to a locked downstream node | None | "后面会用到" teaser line, no navigation until unlocked |

## Ownership rule

Every mechanism has exactly one Owner Node (NODE_SPEC.md `qualifies`). If,
while writing a node, an explanation of another mechanism runs past two
sentences, stop: that mechanism needs its own node (write `invokes` once it
exists) or it already has one (add `invokes` now). Never re-explain in
place — this is what keeps the graph acyclic in practice and keeps any
single node's Layer 1 within its 2–5 Step budget.

## Unlock state

A node's unlock state is derived, not stored:

- `locked` — at least one `requires` source's aggregate criterion streak is
  below the internalized threshold (streak >= 3, see NODE_SPEC.md storage).
- `available` — all `requires` sources internalized, node not yet studied.
- `in-progress` — learner has attempted at least one exercise on this node
  but not all of its criteria are internalized.
- `internalized` — every criterion owned by this node has `internalized: true`.

`frozen` (module status) is orthogonal to unlock state — it governs whether
*content edits* are allowed, not whether a learner can study it.

## Validation (run in `index.html` on load, dev-mode console warnings)

1. **No dangling refs** — every id in every `refs.*` array must exist in `NODES`.
2. **No cycles in `requires`** — a `requires` cycle would make every member
   permanently locked; detect via DFS and fail loudly in dev mode.
3. **`contrasts` symmetry** — if A contrasts B, B should contrast A. Asymmetric
   entries are allowed transiently (content in progress) but flagged.
4. **`previews` must target a currently locked-or-future node** — if the
   target is already internalized, the preview has served its purpose and
   should be removed or converted to `invokes`.

## Rendering

The foundation ships a minimal roadmap view: nodes grouped by `module.order`
then `node.order`, each row showing lock state and its `requires` list. This
satisfies Part I §4 ("learner always knows current position, next
destination, and reason") without building a canvas/force-graph — that is
exactly the kind of "one more elegant abstraction" Part II's anti-pattern
warning calls out. If real learning practice shows the list view is
insufficient, that is the concrete problem needed to justify a visual graph
renderer (Part II Principle 1) — not before.
