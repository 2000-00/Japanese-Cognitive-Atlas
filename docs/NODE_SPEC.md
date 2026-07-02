# Node Specification

This is the canonical shape of every content object in the Atlas. It is the
implementation binding of PART III (Hard Content Standards) of the design
prompt. If you are adding a module (particles, verb conjugation, aspect,
honorifics, ...), everything you write must fit these shapes and land as
entries in the `DATA` section of `index.html`. There is no separate content
repository or build step — the array literals in `index.html` *are* the
content.

All prose fields written for the learner are Chinese, with Japanese examples
in Mincho (`.jp` class) and linguistic terms glossed
中文 + 日本語原文 + English on first mention (see style rule in PART III).

## Before writing a node: qualification

A candidate becomes a node only if it passes the **independent mechanism
test** *and* at least one of citation / error-root / merge test. If it only
fails on scope (needs 6+ Steps), split it — don't widen the Step cap.
Record the qualification reasoning in `qualifies` so later reviewers don't
have to re-derive it.

Things that fail this test become **Application Cards** (scene + structural
decomposition + `refs` into the owning nodes) — see `modules/_cards` in a
future module, not implemented in the foundation.

## `Module`

```js
{
  id: 'kebab-case',            // stable, never reused after deprecation
  name: { zh: '...', ja: '...' },
  order: 10,                   // position in the one roadmap (Part I §4)
  status: 'template' | 'draft' | 'validated' | 'frozen',
  description: '...'           // one sentence: what cognitive territory this covers
}
```

`status` mirrors the real-learning validation loop (Part II Principle 4):
`draft` → studied and logged → `validated` → (only when Part II says so)
`frozen`. Nothing skips straight to `frozen`.

## `Node`

```js
{
  id: 'kebab-case',
  module: 'module-id',
  order: 1,                    // position within module
  status: 'draft' | 'validated' | 'frozen',

  qualifies: {
    independentMechanism: 'one sentence: the mechanism this node owns',
    citedByCount: 0,           // filled in as other nodes add `invokes` to this one
    errorRoot: 'R_XX' | null,
    mergeNote: '...' | null    // why this is one node and not two, or why split
  },

  title: { zh: '...', ja: '...', en: '...' },

  refs: {
    requires:  ['node-id'],    // hard prerequisite; blocks unlock in the graph
    invokes:   ['node-id'],    // borrows another node's conclusion; renders as
                                // inline capsule, hover = owner's Layer 0
    contrasts: ['node-id'],    // same-form/near-meaning, different mechanism;
                                // renders as end-of-node 辨析 section
    previews:  ['node-id']     // hook to a locked downstream node
  },

  layer0: {
    body: '...',                        // <=150 chars, doubles as embeddable summary card
    example: { jp: '...', zh: '...' },  // 1 example set
    hook: '...?'                        // genuine question -> Layer 1
  },

  layer1: {
    steps: [                            // 2-5 Steps, hard cap
      {
        id: 'step-1',
        title: '完成本步后，你能判断……',   // must be rewritable as "after this step you can judge ___"
        body: '...',                     // <=400 chars
        minimalPair: [ { jp: '...', zh: '...' }, { jp: '...', zh: '...' } ],
        miniExercise: { /* Exercise, inline, no id needed outside this Step */ }
      }
    ],
    hook: '...?'                        // genuine question -> Layer 2
  },

  layer2: {
    body: '...',                        // no cap
    boundaryCases: [                    // <=4
      {
        jp: '...', zh: '...',
        note: '...',
        source: 'BCCWJ ...' | null      // frequency/usage claims REQUIRE a checkable
                                          // source string here; if null, no frequency
                                          // claim may appear in `note`
      }
    ]
  },

  examples: {
    tier1: [                            // minimal pairs, 2-4 sets, exactly one variable changes
      { variable: '...', sets: [ { jp: '...', zh: '...' }, { jp: '...', zh: '...' } ] }
    ],
    tier2: [                            // natural context, 3-5 sentences, >=2 registers represented
      { jp: '...', zh: '...', register: 'plain' | 'polite' | 'written' | 'spoken' }
    ],
    tier3: [                            // boundary cases, 2-4, Layer 2 only, prefer real/realistic corpus
      { jp: '...', zh: '...', register: '...', source: 'title/corpus or null' }
    ]
  },

  criteria: ['C_XX'],                   // criteria this node teaches (see CRITERIA registry)
  errorRoots: ['R_XX']                  // error roots this node's exercises can classify into
}
```

Vocabulary rule: every example sentence has exactly one unknown outside the
target grammar; stay within N5–N4 vocabulary except the grammar under study.

## `Criterion`

The atomic unit of the review scheduler — not the node.

```js
{
  id: 'C_XX',                 // check the registry before minting a new id
  name: { zh: '...', ja: '...' },
  description: '...',         // the exact rule feedback text is allowed to cite
  module: 'module-id',
  ownerNodeId: 'node-id'      // single source of truth
}
```

## `ErrorRoot`

```js
{
  id: 'R_XX',
  name: '...',
  description: '...',
  module: 'module-id'
}
```

## `Exercise`

Every question carries the mandatory triple: target Step, error-root
category, certainty level.

```js
{
  id: 'ex-id',
  nodeId: 'node-id',
  stepId: 'step-1' | null,
  criterionId: 'C_XX',
  errorRoot: 'R_XX',
  certainty: 'A' | 'B' | 'C',
  type: 'judgment' | 'cloze-prediction' | 'why-not-x' | 'multi-reading',
  prompt: '...',
  context: '...' | null,      // required for B-level: must lock the context
  options: ['...'] | null,
  answer: 0 | null,           // index into options; MUST be null for C-level
  feedback: '...'             // A-level cites a named criterion; B-level is
                                // prefixed "在这个语境下……"; C-level presents
                                // "multiple readings", never asserts one answer
}
```

Grading rules (enforced by the engine in `index.html`, not just convention):

- **A-level**: auto-graded, feedback must reference `criteriaId`'s registered
  name/description.
  Only questions that are genuinely deterministic given the described
  criteria (question-word co-occurrence, first-mention, case-cover,
  conjugation-form identity, etc.) may be A-level.
- **B-level**: auto-graded only if `context` is present and locks the reading;
  feedback is scoped ("in this context").
- **C-level**: `answer` MUST be `null`. Never auto-graded, never scored, never
  written into the error book. Presented as "multiple readings" items.

## Storage (versioned, shared, single schema)

```js
// localStorage key: "jca_state_v1"
{
  schemaVersion: 1,
  progress: {
    criteria: {
      'C_XX': { streak: 0, attempts: 0, correct: 0, lastResult: null, lastSeen: null, internalized: false }
    }
  },
  errorBook: {
    'R_XX': [ { ts, nodeId, exerciseId, criterionId, certainty, userAnswer, correctAnswer } ]
    // C-level attempts never appear here
  },
  history: [ { ts, exerciseId, nodeId, criterionId, certainty, correct } ], // capped, see index.html
  settings: { devMode: false }
}
```

`internalized` flips true at streak >= 3. Any incorrect A/B attempt resets
that criterion's streak to 0 and re-queues it for review. New modules read
and write this exact structure — never create a parallel store, per Part IV.
