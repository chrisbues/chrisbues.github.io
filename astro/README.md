# Astro spike — evaluate, then keep or delete

Self-contained proof-of-concept living beside the Hugo site. **Nothing here
touches the Hugo build** — `hugo.yaml`, `content/`, `layouts/` are untouched and
still deploy exactly as before. Delete this directory and the repo is unchanged.

```bash
cd astro
npm install
npm run dev          # http://localhost:4321
npm run build
npm run lint:tokens  # enforces the two house rules
```

## What it's testing

Three decisions, in one page:

### 1. One flat content collection — no docs/blog split

`src/content.config.ts` defines a single `notes` collection. A note is a note.
The old split put "how Purview SIT proximity works" in `/docs` (undated) and "how
to configure a Purview DLP policy" in `/blog` (dated) — same voice, same subject,
arbitrary bin. Two axes replace the folders:

- **`topics`** — what it's about, how people browse
- **`maturity`** — `seedling` / `growing` / `evergreen`, which is what the
  blog/docs split was actually gesturing at
- **`planted` / `tended`** — in a garden, *last tended* is the headline date.
  Fixes the "docs pages have no date" hole for free.

### 2. Design tokens, not a theme framework

`src/styles/tokens.css` is the whole design system: ~12 CSS custom properties
via Tailwind v4 `@theme`. One definition yields both a utility class
(`bg-surface`) and a CSS variable (`var(--color-surface)`).

**Dark mode is a token swap.** Six lines at the root, once. The Hugo build
hand-wrote 50 paired `.dark` override blocks and 137 color literals across just
two components; this is the direct replacement for both.

Two house rules, enforced by `npm run lint:tokens` (comment-aware, so
documenting a hex is fine, using one is not):

1. No raw color values in components — use tokens.
2. No `dark:` variants — dark mode is the token swap.

Follow those and a Claude-generated component inherits the site's look with no
hand-editing, in both modes. That's the whole point.

Accent is Ocean Depths teal, stepped for contrast. Every value was measured, not
eyeballed — ink/muted/accent/border checked against **both** surface and raised,
in **both** modes. Numbers are in comments next to each token.

### 3. Interactive content as a real component

`src/components/OverrideMatrix.tsx` replaces **seven** markdown tables that
shared an identical 10-column schema — split only because Markdown can't express
"filter by platform." Now one filterable dataset of 18 mechanisms, no horizontal
scroll, with progressive disclosure for the detail.

The content stayed content: `src/data/autolabeling-mechanisms.json` is plain
data you can hand-edit or regenerate. The component renders whatever is there.

**The accessibility bit is load-bearing.** Status red and green measure ΔE 4.1
under deuteranopia — indistinguishable to ~8% of men. Color therefore cannot
carry Yes vs No. Every state ships three redundant channels: a distinct icon
*shape*, a visible *text label*, and color as reinforcement only. The original
emoji table was accidentally compliant; a naive colored-cell rebuild would not
be. Don't "simplify" this.

## Not done yet

Deliberately out of scope until the pattern is judged:

- Only one note is migrated. Four more live pages remain in Hugo.
- No RSS, sitemap, search (Pagefind), or `llms.txt` equivalent.
- No redirects. **Flattening changes every URL** — `/blog/autolabeling/` becomes
  `/purview-auto-labeling-scenarios/`. Needs a redirect map before any cutover.
- Tag vocabulary still needs a cleanup pass (`Purview` vs `purview`, `DLP` vs
  `data-loss-prevention`).
- No CI. The Hugo workflow still owns deploys.

## The trade being accepted

Hugo is one pinned binary that will still build this site untouched in five
years. This is an npm tree with annual breaking majors and dependabot noise.
That churn is the cost. It's worth paying only because content stays portable
Markdown + JSON, so the churn threatens the shell and never the writing.
