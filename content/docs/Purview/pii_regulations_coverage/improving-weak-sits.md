---
title: Improving Weak SITs
weight: 35
gridjs: true
tags:
  - Purview
  - DLP
  - Privacy
---

The [difficulty ranking](identifier-difficulty) says which built-in sensitive information types will cause trouble. This page says what to do about each one.

Every SIT in the corpus gets a generated diagnosis — why it scored as it did, what the concrete failure mode is, and a prioritised set of fixes drawn from six levers. The diagnosis comes from the same score components, so it is consistent across all 93 rather than being a matter of opinion about any particular country.

## The six levers

You cannot edit a built-in SIT. Every fix below means copying it to a custom SIT and changing the copy — which is why the order matters, since each one costs something.

| Lever | What it changes | Buys | Costs |
|---|---|---|---|
| **Regex** | The `IdMatch` pattern — add a checksum function, or encode structural rules | Precision, often dramatically | Development effort; a wrong checksum silently drops real matches |
| **Tiers** | Delete or demote a keyword-free `<Pattern>` | Precision | Recall in documents with no local-language context |
| **Keywords — remove** | Strip generic terms from the `<Match>` list | Precision, and kills cross-border collisions | Recall on English-language documents |
| **Keywords — add** | Native-language terms, local abbreviations, your own column headers | Recall, at no precision cost | Only effort — the cheapest lever available |
| **Proximity** | Shorten the window below 300 characters | Precision in prose | Makes table matching worse; do not use alone |
| **Table trick** | Relaxed-proximity duplicate pattern | Recall in spreadsheets and CSVs | Some precision in prose-heavy estates |
| **EDM** | Replace pattern matching with an authoritative list | Both, decisively | Data pipeline, schema, refresh cadence |

## Matching the lever to the symptom

The mistake I see most often is reaching for proximity first, because it is the setting most visible in the UI. It is usually the wrong lever.

**If false positives dominate**, work down this order: add a checksum if one exists; drop the keyword-free tier if there is one; strip the generic keyword block; only then shorten proximity. The first three are targeted, the fourth is blunt.

**If false negatives dominate**, add keywords before you touch proximity. A missing local-language term costs you every document that uses it, and adding it costs nothing. Widening proximity to compensate for a thin keyword list trades a recall problem for a precision problem — and risks scan timeouts on large files.

**If the data is tabular**, neither of the above is sufficient on its own, because the 300-character window reaches only two or three rows past a column header. Use the relaxed-proximity technique described in [SITs for Table-based Data]({{< ref "/docs/Purview/sits_for_table_based_data" >}}) — duplicate the keyword-bearing pattern, remove the keywords from the copy, drop its confidence, and let a column full of low-confidence hits alongside one high-confidence hit resolve to a match. Thirty-six of the 93 identity SITs are candidates for this.

**If the identifier is a bare digit string with no checksum**, accept that pattern matching has a ceiling and plan for Exact Data Match. Ten SITs in the corpus fall here. The built-in SIT is still useful for discovery — for finding out *where* the data is — but it should not drive a blocking policy.

## The checksum gaps

The highest-leverage finding on this page. These eight identifiers carry a real check digit that Purview's published definition states it does **not** validate. Implementing it in a custom SIT discards roughly nine in ten accidental matches at no recall cost, because a genuine identifier passes its own checksum by construction.

{{< gridjs-data data="checksum_gaps" pagination="10" wide="full" >}}

The U.K. Unique Taxpayer Reference is the one to fix first. It is the worst-scoring SIT in the entire corpus — ten flat digits, no checksum, and a keyword list that is 14/15 generic tax vocabulary — and HMRC publishes the validation algorithm. The leading digit is a mod-11 check over the following nine using weights 6, 7, 8, 9, 10, 5, 4, 3, 2. Adding that single function takes the UTR from "fires on every ten-digit number near the words tax id" to something you could plausibly put in a blocking policy.

{{< callout type="warning" >}}
Verify any checksum algorithm against real data from your own environment before deploying it. A subtly wrong implementation fails closed — it silently stops matching genuine identifiers, which is far more dangerous than the false positives you were trying to remove. The confidence column records how well-attested each algorithm is; **verified** means I confirmed it against a primary or authoritative source, **documented** means it is widely and consistently implemented but I did not confirm an official specification.
{{< /callout >}}

## Per-SIT remediation plan

Every identity SIT with its primary lever and the full set that applies. Sort by FP risk to work the noisy ones first, or filter by lever to batch similar work together.

{{< gridjs-data data="sit_remediation" pagination="25" wide="full" fixedHeader="true" height="700px" >}}

## A worked example

Take the **Croatia identity card number** — nine consecutive digits, no checksum, grade D, FP risk 60.

It has no check digit to add; the OIB is a separate identifier that does carry one, but that is a different number in a different column. There are also no structural rules worth encoding — nine digits is genuinely all there is. So the regex lever is unavailable, which is exactly what makes it hard.

What remains, in order:

1. **Strip the generic keywords.** Sixteen of its twenty-five keywords are the shared identity and tax block. Delete them and keep `osobna iskaznica`, `osobni identifikacijski broj`, `majstorski broj građana` and the other Croatian terms. This alone stops the SIT firing on Greek, Romanian and Slovenian documents.
2. **Add the relaxed-proximity copy** so that Croatian ID columns in spreadsheets resolve properly rather than matching only the first two rows.
3. **Plan for EDM.** For a nine-digit bare number, this is the only thing that gets you both precision and recall. If you hold Croatian HR data, you already have the source list.

Note what is *not* on that list: widening proximity. It would recover a few more rows and multiply the false positives, and this SIT already has more of those than it can afford.

## Method and limits

Diagnoses and fix lists are generated from each SIT's score components — pattern shape, checksum flag, confidence tiers, keyword counts and generic share, proximity — so they are reproducible and consistent, not hand-authored per country. The rules are:

- A checksum fix appears only where a curated fact table records that a real check digit exists.
- A structural-regex fix appears only where the identifier has documented constraints worth encoding — excluded ranges, embedded dates, valid prefixes. Seven SITs qualify.
- A tier fix appears where a keyword-free tier coincides with FP risk of 40 or more.
- A keyword-removal fix appears where keyword quality is below 45 and at least five keywords are generic.
- A keyword-addition fix appears where fewer than ten keywords are defined.
- The table trick appears where every tier requires a keyword and proximity is 300 or less.
- EDM appears where the pattern is bare digits, no checksum is available, and signal strength is below 50.

The limits from the [methodology](methodology) page all still apply, and one more is specific to this page: **the curated checksum facts are the weakest link.** They are the only part of this analysis that is not derived from Microsoft's published data, and a wrong entry produces a confidently wrong recommendation. Treat the algorithm column as a research lead to verify, not an implementation spec.
