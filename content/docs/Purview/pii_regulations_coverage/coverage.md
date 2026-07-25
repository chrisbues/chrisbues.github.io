---
title: Regulation → SIT Coverage Matrix
weight: 20
gridjs: true
tags:
  - Purview
  - DLP
  - Privacy
---

For each regulated jurisdiction: how many built-in Purview sensitive information types exist per identifier class, and how bad the weakest identity detector is.

Counts are of distinct built-in SITs. A dash means Purview ships nothing in that class for that country — you are writing a custom SIT or an Exact Data Match schema. The **Weakest identity grade** column is the grade of the *worst* national ID, social security or tax ID SIT for that jurisdiction, because in practice your programme is limited by its weakest detector, not its best.

{{< gridjs-data data="regulation_sit_coverage" pagination="25" wide="full" fixedHeader="true" height="700px" >}}

## Reading the matrix

**Coverage % is a breadth measure, not a quality measure.** It counts how many of the eight identifier classes have at least one SIT. A jurisdiction can show 100% coverage and still be undeployable if the identity SITs all grade D. Always read it alongside the weakest-grade column.

Three distinct failure modes show up in this table, and they need different responses.

### 1. No coverage at all

Nigeria, Kenya, Vietnam, Egypt, Peru and Uruguay have in-force privacy laws and zero built-in SITs. Everything is custom work. See the [regulation index](regulations) for the specific identifiers involved.

### 2. Coverage exists but the identity detector is weak

The larger and more insidious category. The SIT exists, it is enabled in your policies, the dashboard shows matches — and a meaningful fraction of those matches are noise, or a meaningful fraction of real data is missing. Greece, Croatia, Cyprus, the United States and the United Kingdom all fall here for at least one identifier class.

This is worse than having no SIT, because a weak detector produces a *false sense of coverage*. A policy that fires constantly gets tuned down or ignored; a policy that never fires looks like a clean environment.

### 3. Partial class coverage

Many jurisdictions have a national ID SIT but no health identifier, or a passport but no tax ID. Whether that matters depends entirely on the law. Under GDPR, health data is a special category attracting Article 9 protection and a higher breach-notification bar — so a missing health identifier SIT is a bigger gap in the EU than the raw count suggests. Conversely a missing VAT number SIT is rarely a privacy problem at all, since VAT numbers for companies are not personal data.

## The structural mismatch

The uncomfortable pattern that emerges from joining these two datasets:

**The jurisdictions that regulate national ID numbers most aggressively are disproportionately the ones whose identifiers are hardest to detect.**

South Korea prohibits RRN processing by default — and the RRN is thirteen digits that Purview does not checksum. Denmark, Sweden, Norway and Finland all impose statutory restrictions on the personal identity number beyond GDPR — and all four are bare-digit identifiers. Hungary's constitutional court restricted the universal personal identifier in 1991 — the current personal identification number is eleven digits.

Meanwhile the identifiers that are trivially detectable — Italy's fiscal code, Mexico's CURP, Taiwan's national ID, Hong Kong's HKID — sit in jurisdictions where the identifier is treated as relatively ordinary personal data.

There is a reason for this, and it is not coincidence. Identifiers that encode personal semantics — name fragments, date of birth, place of birth, sex — are easy to pattern-match *precisely because* they leak personal information in their structure. Countries that worried early about identifier privacy deliberately moved to opaque, non-semantic numbers. **The privacy-protective design choice is the one that makes automated detection hard.**

That trade-off is not going away, and no amount of vendor tuning resolves it. It is the argument for Exact Data Match over pattern matching wherever you can source an authoritative identifier list — which, in exactly these jurisdictions, is usually HR data you already hold.
