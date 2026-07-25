---
title: PII Regulations vs. Purview SIT Coverage
weight: 20
tags:
  - Purview
  - DLP
  - Privacy
---

Every privacy regime on earth tells you to protect "personal data." Almost none of them tell you how to *find* it. That gap is where Microsoft Purview's built-in sensitive information types (SITs) live — and it is where most data protection programmes quietly fall over.

This section is an attempt to answer a question I keep running into on real engagements:

> For a given country's privacy law, does Purview actually have a usable detector for the identifiers that law cares about — and how badly will it misfire?

The short answer is that coverage is broad but *quality is wildly uneven*, and the unevenness is almost entirely predictable from the shape of the identifier itself. A national ID number that is "just nine digits" cannot be detected reliably by anything, from any vendor, ever. A 16-character structured code with a checksum is nearly free to detect. Most of the interesting engineering work sits between those two poles.

## What's here

{{< cards >}}
  {{< card link="regulations" title="Global regulation index" subtitle="74 jurisdictions — laws, regulators, breach clocks, and whether national ID numbers are singled out for special treatment." >}}
  {{< card link="coverage" title="Regulation → SIT coverage matrix" subtitle="Which identifier classes Purview covers for each jurisdiction, and the six regulated countries with no built-in SITs at all." >}}
  {{< card link="identifier-difficulty" title="Identifier difficulty ranking" subtitle="All 93 national ID / social security / tax ID SITs ranked by false-positive risk. The core of this research." >}}
  {{< card link="improving-weak-sits" title="Improving weak SITs" subtitle="What to actually do about the bad ones — six levers, a per-SIT remediation plan, and eight identifiers whose real checksum Purview ignores." >}}
  {{< card link="keyword-collisions" title="Keyword collision analysis" subtitle="Why a Croatian ID card SIT fires on a UK tax reference — measured across 1,498 distinct keywords." >}}
  {{< card link="catalog" title="Full SIT catalogue" subtitle="All 324 built-in SITs with format, checksum, confidence tiers, proximity, and scores." >}}
  {{< card link="methodology" title="Methodology & limitations" subtitle="How the scores are computed, where the data comes from, and what this analysis cannot tell you." >}}
{{< /cards >}}

## Headline findings

**Coverage is not the problem — precision is.** Purview ships identity SITs for 62 jurisdictions. But of the 93 national ID, social security and tax ID SITs analysed, **69 match nothing more distinctive than a run of bare digits**, and **28 have no checksum validation at all**. Those two facts, not the presence or absence of a SIT, determine whether a policy is deployable.

**38 of 93 identity SITs will match with no keyword whatsoever** at medium confidence or higher. That is a deliberate design choice by Microsoft — it maximises recall in documents with no English context — but it means the SIT's precision rests entirely on the regex. For a strongly structured identifier like Mexico's CURP that costs almost nothing; for the Qatari ID card, which is eleven lightly constrained digits with no checksum, it means ordinary business identifiers collide with it routinely.

**The generic tax-keyword block is the single largest source of cross-border false positives.** Dozens of country SITs share an identical English keyword set — `tax id`, `tin`, `tax no`, `taxidnumber`, `tax registration number`. The UK Unique Taxpayer Reference is the worst case in the corpus: **10 flat digits, no checksum, and 14 of its 15 keywords are from that shared generic block.** Any ten-digit number within 300 characters of the words "tax id" is a *high confidence* match. In a finance shared drive, that is most of the estate.

**Some keyword lists appear to be copy-paste artifacts.** Lithuania's personal code SIT carries the keyword `citizen service number` — the standard English rendering of the Dutch *burgerservicenummer*. Lithuania and the Netherlands share 19 keywords despite unrelated identifier formats.

**Six jurisdictions with in-force privacy laws have no built-in Purview SITs at all**: Nigeria (NDPA), Kenya (DPA 2019), Vietnam (PDPL, in force January 2026), Egypt (Law 151/2020), Peru (Ley 29733), and Uruguay (Ley 18.331). If you operate there, every identifier detector is custom work.

## How to read the scores

Two independent risks, deliberately kept separate rather than collapsed into one number:

| Score | Means | Driven by |
|---|---|---|
| **FP risk** | How much noise the SIT generates | Weak pattern, no checksum, generic keywords, keyword-free tiers |
| **FN risk** | How much real data it misses | Keyword dependence, 300-character proximity, sparse keyword lists |
| **Difficulty** | Total tuning burden (FP-weighted) | Both of the above |

A SIT can be bad in both directions at once, and several are. Grades run **A** (deployable as shipped) to **F** (do not deploy without substantial customisation).

{{< callout type="warning" >}}
**This is engineering research, not legal advice.** The regulation dataset is a working summary compiled to drive the coverage analysis — it is accurate enough to prioritise detection work, but statutory detail changes constantly and varies by sector. Verify against primary sources before relying on it for a compliance position. Every row links to the relevant regulator.
{{< /callout >}}
