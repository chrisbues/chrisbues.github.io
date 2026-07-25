---
title: Identifier Difficulty Ranking
weight: 30
gridjs: true
tags:
  - Purview
  - DLP
  - Privacy
---

This is the core of the research. Every national ID, social security and tax ID sensitive information type Purview ships — 93 of them across 62 jurisdictions — scored on how much trouble it will cause you.

The premise is simple. **The detectability of a personal identifier is a property of the identifier, not of the detection product.** A Brazilian CPF carries a mod-11 checksum across 11 digits; you can validate it in isolation with near-zero false positives. A Croatian identity card number is nine consecutive digits with no checksum; it is arithmetically indistinguishable from an invoice number, a part number, or the middle of a phone number. No vendor can fix that, and any product claiming otherwise is quietly relying on keywords.

So the useful question is not "does Purview support country X" but "what will supporting country X actually cost me in tuning?"

## The ranking

Sorted by false-positive risk — the noise problem. Sort by **FN risk** to find the SITs that silently miss data instead, or by **Difficulty** for overall tuning burden. Grades: **A** deployable as shipped, **F** needs substantial custom work.

{{< gridjs-data data="pii_identifier_ranking" pagination="25" wide="full" fixedHeader="true" height="700px" >}}

## What the columns mean

**Signal strength (0–100)** — how self-identifying the raw value is, before any surrounding context. Driven by length, alphabet (digits vs. mixed alphanumeric), structural constraints such as an embedded date of birth or a fixed prefix, and above all whether Purview validates a checksum. A score of 25 means the pattern is close to "any run of digits of this length."

**Keyword quality (0–100)** — the inverse of how generic the SIT's supporting keywords are. 100 means every keyword is distinctive to that jurisdiction (typically native-language terms). Low scores mean the SIT leans on shared English boilerplate like `tax id` and `tin` that appears in dozens of other countries' keyword lists.

**Keyword-free tier?** — whether Purview will match the pattern *with no supporting keyword at all*, and at what confidence. This is the single most consequential field on the page. Where the answer is "Yes — high/med" and signal strength is low, the SIT is effectively an unbounded regex.

## The worst case in the corpus

**U.K. Unique Taxpayer Reference Number.** The published pattern is ten digits. Flat. No checksum, no structure, no positional constraints. Its single high-confidence tier requires a supporting keyword — which sounds like a safeguard until you read the keyword list, where **14 of 15 entries** come from the generic shared tax block:

```text
tax number · tax file · tax id · tax identification no · tax identification number
tax no# · tax no · tax registration number · taxid# · taxidno# · taxidnumber#
taxno# · taxnumber# · taxnumber · tin id · tin no · tin#
```

The practical consequence: **any ten-digit number within 300 characters of the string "tax id" is a high-confidence match.** On a finance shared drive — where "Tax ID" is a column header and ten-digit numbers are everywhere — this fires continuously. Worse, those same keywords appear in the SITs for Croatia, Greece, Lithuania, Malta, Romania, Slovenia and others, so a single spreadsheet can light up a dozen countries' detectors simultaneously.

The keyword requirement here is theatre. It looks like a precision control and behaves like none.

## Keyword-free tiers

Thirty-eight of the 93 identity SITs will match at medium confidence or higher with **no supporting keyword at all**. In the entity XML this shows up as a `<Pattern>` containing an `IdMatch` and nothing else:

```xml
<Pattern confidenceLevel="75">
  <IdMatch idRef="Regex_qatari_id_card" />
</Pattern>
```

That is the Qatari ID card — eleven digits, no checksum, matched at medium confidence on the pattern alone. It is not quite an unbounded regex, because the pattern does carry light structure (a leading `2` or `3`, then a two-digit birth year, then a three-digit ISO country code), but the constraint is weak enough that ordinary eleven-digit business identifiers will collide with it regularly. Cyprus's tax identification number sits in the same category: nine characters, keyword-free at medium, no checksum.

A keyword-free tier is not automatically a defect — it is how Microsoft buys recall in documents that contain no English context, and for a strongly structured identifier like Mexico's CURP it costs almost nothing. The rule of thumb is the interaction: **a keyword-free tier on a weakly structured pattern is where the noise comes from.** Sort the table by *Keyword-free tier* and *Signal strength* together to find them.

## Structure beats length

A useful counter-intuition falls out of the data: **length barely matters; structure does.**

Indonesia's KTP number is sixteen digits with no checksum and scores worse than Spain's DNI at nine characters. The DNI is eight digits plus a mod-23 check letter — that single trailing character eliminates roughly 96% of accidental matches. Sixteen unconstrained digits eliminate none.

The nine identifiers that grade **A** share the same property, and it is never length:

- **Taiwan national ID** and **Brazil CNPJ** — the two cleanest in the corpus. A leading region letter plus weighted checksum; and 14 digits with branch structure plus two check digits.
- **Singapore NRIC** — nine alphanumeric, prefix letter denoting issue era, trailing check letter.
- **Hong Kong HKID** — alphanumeric with a bracketed check character.
- **Mexico CURP** — 18 characters encoding name, date of birth, sex and state of birth.
- **Poland PESEL** and **Germany identity card number** — embedded date of birth and checksum.
- **India GST number** — 15 alphanumeric with an embedded state code and checksum.
- **Spain DNI** — eight digits and a mod-23 check letter.

Every one of them embeds *semantics* in the identifier. That is what makes them cheap to detect. Italy's fiscal code is nearly as strong structurally — 16 characters encoding surname, forename, birth date and birth commune — but grades **B** rather than **A** because Purview pairs it with a keyword-free tier and a 30-entry keyword list that is over half generic.

## What to do about it

The ranking is meant to drive triage, not despair. Roughly:

**Grade A–B (52 SITs).** Deploy as shipped. Spot-check against your own data, then move on.

**Grade C (28 SITs).** Deployable with a confidence-level decision. Run at high confidence only, accept the recall loss, and measure it before you commit to a blocking action.

**Grade D–F (13 SITs).** Do not deploy the built-in SIT in a blocking policy. Options, in rough order of effort:

1. **Copy the SIT and tighten the keyword list**, deleting the generic tax block and keeping only native-language and jurisdiction-specific terms. Cheapest meaningful win, and it directly addresses the cross-border collision problem.
2. **Add a checksum function** where the underlying identifier has one that Purview does not validate. South Korea's resident registration number and Saudi Arabia's national ID both carry real check digits, and both are published with `Checksum: No`.
3. **Combine with a second SIT or a document fingerprint** so the identifier alone is never sufficient to trigger.
4. **Use Exact Data Match** where you have an authoritative list. For a bare-digit national ID, EDM is not a nice-to-have — it is the only approach that genuinely works.

For table-based data specifically, the proximity mechanics matter as much as the pattern; see [SITs for Table-based Data]({{< ref "/docs/Purview/sits_for_table_based_data" >}}) for the relaxed-proximity technique.
