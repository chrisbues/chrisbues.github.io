---
title: Methodology & Limitations
weight: 60
tags:
  - Purview
  - DLP
---

How the numbers on these pages were produced, and what they can and cannot tell you.

## Data provenance

**Purview SIT data** is scraped from the published [sensitive information type entity definitions](https://learn.microsoft.com/en-us/purview/sit-sensitive-information-type-entity-definitions) on Microsoft Learn — the index page plus all 324 individual definition pages. From each page: the *Format*, *Pattern*, *Checksum*, and *Definition* sections, the full keyword lists, and the `<Entity>` XML block where published.

The XML is the authoritative part. It gives `patternsProximity`, `recommendedConfidence`, and for each `<Pattern>` its `confidenceLevel` and whether it carries a `<Match>` element — which is how "does this tier require a keyword" is determined, rather than by reading the prose. 219 of 324 SITs publish XML; the remainder are mostly credential types.

**Regulation data** is hand-compiled from primary regulator sources. It is a working engineering summary, not a legal reference — see the limitations below.

Everything is regenerated from source rather than transcribed, so it can be refreshed when Microsoft updates the definitions. Scores are deterministic functions of the published data.

## The scoring model

Two independent risks, deliberately not collapsed into a single number until the last step.

### Primary element strength (0–40)

How self-identifying the raw value is, before any context.

| Component | Points |
|---|---|
| Alphabet — bare digits | 6 |
| Alphabet — digits plus a check character | 14 |
| Alphabet — letters only | 14 |
| Alphabet — mixed alphanumeric | 18 |
| Length — mean of min/max: <8 / 8–9 / 10–12 / 13–15 / 16+ | 0 / 4 / 8 / 11 / 13 |
| Structural constraint in the pattern | +6 |
| Checksum validated by Purview | +16 |

Capped at 40. *Structural constraint* means the published pattern text specifies something beyond a character-class run — an embedded date of birth, an ISO country code, a fixed leading digit, a region letter, a bounded range.

The weighting is deliberate: **a checksum is worth more than any amount of length.** A validated check digit removes roughly 90% of accidental matches; ten extra unconstrained digits remove none.

### Keyword dependence (0–30)

Recall risk. Derived from the `<Pattern>` tiers:

| Condition | Points |
|---|---|
| A keyword-free tier at confidence ≥ 75 | 0 |
| A keyword-free tier only below 75 | 10 |
| Every tier requires a keyword | 25 |
| Every tier requires two or more keyword groups | 30 |
| No XML published | 20 (assumed) |

### Keyword quality (0–30)

Precision risk. `30 × generic_ratio`, where a keyword counts as generic if it appears in a curated stoplist of common identity/tax vocabulary, **or** it is ASCII-only and shared by six or more other SITs. The second clause is data-driven and is what catches the shared tax block. Native-language keywords are treated as strong — they are usually the most discriminating terms a SIT has.

### Proximity fragility (0–15)

15 if proximity ≤ 300 and every tier needs keywords; 10 if proximity ≤ 300 with partial keyword dependence; 3 otherwise.

### Composite scores

```text
FP risk = 55 × (1 − PES/40) + 30 × (KQ/30) + 15 × (keyword-free tier at ≥75)
FN risk = 45 × (KD/30) + 30 × (PF/15) + 25 × keyword_scarcity
Difficulty = 0.65 × FP risk + 0.35 × FN risk
```

`keyword_scarcity` is `1 − min(1, keyword_count/12)` — SITs with very few supporting keywords miss data that uses different vocabulary.

Difficulty is weighted toward false positives because that is what kills deployments in practice. A noisy policy gets disabled; a policy with modest recall loss usually survives.

Grades: **A** < 20, **B** < 35, **C** < 50, **D** < 65, **E** < 80, **F** ≥ 80.

## Limitations

These matter. Read them before quoting any number here.

**The scores are heuristics, not measurements.** They are computed from Microsoft's published *descriptions* of the patterns, not from the compiled regexes, which are not public. A pattern documented as "nine digits" may carry undocumented constraints. The scores predict relative difficulty well; they are not calibrated false-positive rates, and a "FP risk 58" does not mean 58% of matches will be wrong.

**No empirical validation against a corpus.** Properly grading these would mean running every SIT against a large labelled document set and measuring precision and recall directly. That is the obvious next step and it is not what this is. Treat the ranking as a prioritisation tool for where to spend testing effort.

**Format parsing is automated.** Length and alphabet are extracted from prose with a parser. It handles the published phrasings and was hand-verified across the 93 identity SITs, but the multi-format entries — where old and new identifier formats coexist, as in Brazil, Czechia and Germany — are collapsed into a single range that flatters neither.

**The structural-constraint bonus is coarse.** It is a flat +6 whether the constraint eliminates 5% or 95% of the space. Qatar's ISO country code and Mexico's full name-and-date encoding score identically on that axis, which understates CURP and overstates the Qatari ID.

**Regulation data is a summary.** Compiled to drive the coverage analysis, not to support compliance positions. Statutory detail changes constantly, sectoral rules frequently override the general regime, and several entries are phased or awaiting implementing regulations. Where a jurisdiction is marked "Partial" on national ID treatment, that is a judgement call about whether the law meaningfully singles the identifier out — reasonable people would draw some of those lines differently. Verify against the linked regulator before relying on any of it.

**Coverage percentages count classes, not quality.** Eight identifier classes, scored on presence alone. A jurisdiction can show 100% coverage with uniformly poor detectors.

**Point-in-time.** Microsoft revises SIT definitions regularly — patterns get checksums added, keyword lists get extended, new SITs ship. Data was collected in July 2026 against the then-current Learn content.

## Reproducing this

The pipeline is straightforward and worth rebuilding if you want current numbers:

1. Scrape the SIT index for definition slugs, then fetch each definition page.
2. Parse *Format*, *Pattern*, *Checksum*, keyword groups, and the `<Entity>` XML.
3. Classify by jurisdiction and identifier class from the slug.
4. Extract per-tier confidence and keyword requirements from the XML — matching `idRef` tolerantly, because attribute spacing is inconsistent across pages and a strict match silently misclassifies tiers as keyword-free.
5. Compute keyword promiscuity across the whole corpus, then score.

Step 4 is the one to be careful about. It is the difference between "this SIT needs no keyword" and "this SIT needs a keyword", which is the most consequential single field in the analysis.
