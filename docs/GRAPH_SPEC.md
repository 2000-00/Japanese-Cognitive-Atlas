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

The Graph tab (`viewRoadmap`) renders a real tiered DAG, not a flat list:
nodes are grouped into columns by `computeNodeDepth` (longest `requires`
chain from a root), and SVG paths are drawn between DOM node positions after
each render (`drawGraphConnectors`). Four edge types get distinct line
styles so they read as different relationships, not just "some lines":

| Edge | Line style |
|---|---|
| `requires` | solid (unlocked) / dashed gray (locked) |
| `contrasts` | short dotted, neutral tone, drawn once per symmetric pair |
| `invokes` | sparse dash, accent tone; skipped if the same pair already has a `requires` edge (avoids drawing two overlapping lines) |
| `previews` | very sparse dotted, faint |

Each node also shows a small colored category chip for its
`knowledgePosition.parent_concept.label` (see docs/NODE_SPEC.md), giving a
visual read of hierarchy grouping without fabricating parent nodes that
don't exist.

Clicking a node does **not** navigate away from the Graph tab — it opens a
side panel (`renderGraphSidePanel`, transient `currentGraphNodeId` state)
showing Knowledge Position, Cognitive/Learning Layer summaries,
prerequisites, related nodes, next-recommended nodes, and verification
status, with a button to jump into the full node detail page. This was
built in response to an explicit product requirement (Knowledge Graph
Layer), which is exactly the kind of concrete justification Part II
Principle 1 requires before extending frozen architecture — it isn't a
speculative addition.
