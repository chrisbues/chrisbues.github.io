---
title: Keyword Collision Analysis
weight: 40
gridjs: true
tags:
  - Purview
  - DLP
  - Privacy
---

Purview's identity sensitive information types draw on **1,498 distinct keywords** across 187 SITs. They are not disjoint. Large blocks of keywords are shared verbatim between countries whose identifiers have nothing in common, which means a single document can trigger a dozen jurisdictions' detectors at once.

This page measures that overlap. It matters because keyword requirements are the main precision control Purview offers for weak numeric patterns — and a keyword that thirty countries share provides almost no precision at all.

## The shared tax block

Restricting to just the national ID, social security and tax ID SITs — 966 distinct keywords — the most-shared terms are unambiguous:

| Keyword | SITs using it |
|---|---|
| `tax id` | 30 |
| `taxid#` | 29 |
| `tax number` | 29 |
| `tax no` | 28 |
| `tin id` | 27 |
| `tin no` | 27 |
| `tin#` | 27 |
| `tax identification number` | 26 |
| `tax identification no` | 26 |
| `taxidnumber#` | 26 |

Thirty of the roughly ninety identity SITs share the string `tax id`. When that keyword appears near a numeric field, every one of those thirty detectors evaluates its pattern against it — and since most of those patterns are bare digit runs of 8 to 13 characters, several will match the same value.

A single European payroll extract with a `Tax ID` column and ten-digit values will plausibly return matches for the UK Unique Taxpayer Reference, the Greek TIN, the Hungarian tax identification number, and several others simultaneously. All from one column of one file.

## Every promiscuous keyword

All keywords shared by five or more identity SITs, with the jurisdictions affected.

{{< gridjs-data data="keyword_promiscuity" pagination="20" wide="full" fixedHeader="true" height="600px" >}}

## Jurisdiction pairs

Country pairs ranked by how many keywords their national ID, social security and tax ID SITs share. A high number means documents from one country will routinely trigger the other's detectors.

{{< gridjs-data data="keyword_collisions" pagination="20" wide="full" fixedHeader="true" height="600px" >}}

### Czechia ↔ Slovakia — 24 shared keywords

The worst pair, and the most legitimate. These two genuinely share an identifier heritage: the *rodné číslo* / birth number is a Czechoslovak-era construct that both successor states retained, with near-identical formats (nine or ten digits, optional slash). They share the Czech/Slovak-language terms `rodné číslo` and `daňové číslo` as well as the English generic block.

Here the collision is real rather than artificial — a Czech birth number genuinely *is* structurally a Slovak birth number. No keyword tuning fixes this; you need jurisdiction context from outside the document.

### Lithuania ↔ Netherlands — 19 shared keywords

This one looks like an error. The two identifiers are unrelated — the Lithuanian *asmens kodas* is 11 digits, the Dutch BSN is 8 or 9 — yet Lithuania's SIT carries:

```text
citizen service number · personal numeric code · unique identification number
unique identity number · uniqueidentityno · tax id · tin · tax number …
```

`citizen service number` is the standard English rendering of *burgerservicenummer*. It has no business in a Lithuanian keyword list, and `personal numeric code` is the Romanian *cod numeric personal*. These read as copy-paste artifacts from building out the EU SIT family, and they are worth stripping if you copy the Lithuanian SIT.

### Germany ↔ Luxembourg — 19 shared keywords

Shared German-language tax vocabulary — `steuer id`, `steueridentifikationsnummer`, `steuernummer` — combined with similar numeric formats (German tax ID is 11 digits, Luxembourg's national identification number is 11 or 13). Documents in German will cross-trigger reliably. This one is linguistically legitimate but operationally awkward for anyone running policies across the DACH region and Luxembourg together.

### Finland ↔ Sweden, Denmark ↔ Slovakia, Romania ↔ Slovenia

The remaining top pairs are all driven by the generic English block plus incidental format similarity. These are the ones most improved by keyword surgery.

## What to actually do

**Strip the generic block from copied SITs.** If you clone a national ID SIT for a jurisdiction you actually operate in, delete `tax id`, `tin`, `tax no`, `tax number` and their punctuation variants, and keep the native-language terms. You will lose some recall on English-language documents and gain a large amount of precision. For a jurisdiction where you hold local-language data, this is close to a free win.

**Watch the interaction with proximity.** These keywords only need to fall within 300 characters of the pattern. In a CSV that is roughly two to three rows — so a column header of `Tax ID` reaches values well beyond its own row. The mechanics are covered in [SITs for Table-based Data]({{< ref "/docs/Purview/sits_for_table_based_data" >}}), and they cut both ways: the same relaxed-proximity behaviour that rescues recall on tables also propagates a generic keyword across many more values.

**Do not assume a keyword requirement means precision.** The [difficulty ranking](identifier-difficulty) scores keyword *quality* separately from keyword *presence* for exactly this reason. A SIT with fifteen keywords, all generic, is closer to a keyword-free SIT than to a well-targeted one.
