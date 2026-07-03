# Source Library

This is the permanent, growing registry of external sources the Atlas is
allowed to cite. It exists to make the Data Integrity Principle checkable
instead of aspirational: a `knowledgePosition.evidence[]` entry in
`index.html` may only claim a source by id if that id actually resolves to
an entry here, with an honest `verification_method` describing how it was
checked (or admitting it wasn't, beyond a domain cross-check).

## File

`sources.json` — one flat, machine-readable registry. Every entry has:

| Field | Meaning |
|---|---|
| `id` | stable id, referenced from `knowledgePosition.evidence[].sourceId` |
| `kind` | `official_organization` \| `corpus` \| `academic_reference` |
| `title`, `author`, `publisher` | bibliographic identity |
| `official_url` | `null` for sources without a stable public URL (books, papers) — never a guessed URL |
| `license_status`, `license_note` | almost always `needs_verification` until someone actually reads the terms page |
| `copyright_status` | who owns it, and whether re-use terms have been checked |
| `reliability_tier` | `official_primary` \| `academic_secondary_citation` — a qualitative tier, not a fabricated numeric "reliability score". A number implies a scoring methodology we don't have; a tier says only what we actually know. |
| `applicable_jlpt_levels`, `applicable_grammar_domains`, `applicable_vocabulary_domains`, `applicable_textbooks`, `applicable_contexts` | scope — left `[]` (honest "not yet mapped") rather than guessed |
| `last_verified_date` | `null` for academic references not independently checked this session |
| `verification_method` | **the most important field** — states exactly how confident we are and why (e.g. "WebSearch cross-check only, direct fetch blocked by sandbox network policy") |
| `notes` | which nodes cite this, and what NOT to do with it yet |

## Why a flat registry instead of the `/official/minna`, `/corpus`,
## `/dictionaries` folder tree

The project principles suggest a folder tree per publisher/type. That tree
is the right shape once there are actual downloaded/linked materials to
organize. Right now there are zero indexed documents — only a handful of
official *entry points* (JLPT, Japan Foundation, NINJAL/BCCWJ, Bunka
Agency, NHK) and four academic theory citations already referenced in PART
1 content. Creating empty subfolders for that would be scaffolding with no
content behind it. `sources.json` is queryable today; the folder tree
should appear the moment a specific textbook/corpus resource is actually
added, not before.

## How this is used right now

Every node's `knowledgePosition` in `index.html` can carry an `evidence[]`
array pointing at these ids. As of this milestone, evidence is only
attached to the 4 PART 1 nodes whose Layer 2 body already names a specific
scholar or framework (三上章, Fillmore, 久野暲, 黒田成幸) — because that's
the honest bar: don't retroactively invent a citation for prose that
didn't already ground itself in one. Nothing here is marked `verified`;
everything is `needs_verification` or `not_applicable` (for print sources),
matching the trust-status vocabulary in `docs/NODE_SPEC.md`. Upgrading a
source to `verified` requires someone to actually check the primary
material (read the terms page, open the corpus, find the book/page) — not
another round of web search corroboration.
