---
title: Full SIT Catalogue
weight: 50
gridjs: true
tags:
  - Purview
  - DLP
---

All 324 built-in Microsoft Purview sensitive information types, scraped from the published entity definitions and scored. Every SIT name links to its Microsoft Learn definition.

Searchable and sortable. Useful for answering "what does Purview ship for country X" without paging through the Learn index, and for spotting the confidence-tier and proximity settings at a glance.

{{< gridjs-data data="purview_sit_catalog" pagination="30" wide="full" fixedHeader="true" height="750px" >}}

## Column notes

**Format** — normalised from the published *Format* section: total length range and alphabet. `9 digits` means nine bare digits; `8–10 alphanumeric` means a mixed letter/digit value of eight to ten characters.

**Checksum** — whether Purview's own definition states that it validates a check digit. This is *not* whether the identifier has a checksum in reality. Several identifiers with real check digits — South Korea's resident registration number, Saudi Arabia's national ID — are published with `Checksum: No`, which is precisely the gap worth knowing about.

**Confidence tiers** — the `confidenceLevel` values of each `<Pattern>` in the entity XML, in document order. `85/75/65/55` means four tiers from high down to low. Purview maps these as: 85 = high, 75 = medium, 65 or below = low.

**Proximity** — the `patternsProximity` value in characters. Almost universally 300. This is the window within which supporting keywords must appear, and it is the single most common cause of missed matches in table-based data.

**Keywords / Generic kw %** — the count of distinct supporting keywords, and the share of them classed as generic. A keyword is generic if it appears in a curated stoplist of common identity and tax vocabulary, or if it is English-language and shared by six or more other SITs. See [methodology](methodology) for the exact rule.

**FP / FN / Difficulty / Grade** — the scores. Full derivation in [methodology](methodology); the identity-specific subset is analysed in the [difficulty ranking](identifier-difficulty).

## Scope note

The catalogue includes all 324 published SITs, not just identity ones — credential and secret types (Azure keys, connection strings, access tokens), medical terminology dictionaries, and physical address types are all present.

Scores are only meaningful for the identity and financial classes. Credential SITs are excluded from the analysis elsewhere on this site because their detection model is fundamentally different: they match high-entropy structured secrets with distinctive prefixes, where pattern strength is high and keyword context is largely irrelevant. Medical terminology SITs are dictionary matches rather than pattern matches, and the scoring model does not apply to them at all. Both are shown here with scores computed for consistency, but read them with that caveat.
