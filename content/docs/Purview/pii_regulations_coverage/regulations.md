---
title: Global Regulation Index
weight: 10
gridjs: true
tags:
  - Purview
  - Privacy
---

Seventy-four jurisdictions, indexed by what matters for building detection: who regulates, how fast the breach clock runs, whether the law defines special categories of data, and — the field that drives most of the engineering — **whether the national identification number is singled out for special treatment.**

That last column is the one worth dwelling on. A surprising number of privacy regimes do not merely include the national ID number in the general definition of personal data; they carve it out and regulate it separately, often with a statutory list of who may collect it at all.

{{< gridjs-data data="pii_regulations" pagination="25" wide="full" fixedHeader="true" height="700px" >}}

## Why the national ID column matters

In the Nordics and much of central Europe, the personal identity number is effectively a primary key for the citizen. Denmark's CPR number, Sweden's personnummer, Norway's fødselsnummer, Finland's henkilötunnus, Iceland's kennitala — each is governed by a dedicated section of the national data protection act that restricts processing beyond the GDPR baseline. Sweden's Dataskyddslag chapter 3 section 10 permits processing of the personnummer without consent only where it is *clearly justified* by the purpose. Finland's section 29 does much the same.

GDPR itself makes this explicit. **Article 87** leaves national identification numbers to Member State law rather than harmonising them — which is exactly why the treatment varies so much across otherwise-identical GDPR implementations.

Outside Europe the pattern repeats with different reasoning:

- **South Korea** goes furthest. Under PIPA, processing the resident registration number is *prohibited by default*, permitted only where another statute specifically requires it. This is a direct response to the mass RRN breaches of the early 2010s.
- **China's PIPL** classifies the resident identity card number as *sensitive personal information*, requiring separate consent and an impact assessment.
- **Philippines** treats any government-issued identifier as sensitive personal information under the Data Privacy Act, with criminal penalties attached.
- **Australia** regulates the Tax File Number through a dedicated legally binding TFN Rule, entirely separate from the Privacy Act's APPs.
- **Singapore** does it through guidance rather than statute — the PDPC's NRIC Advisory Guidelines restrict collection of NRIC numbers to cases required by law or where necessary to verify identity to a high degree of fidelity.

For detection engineering the implication is direct: in these jurisdictions the national ID number is not just *a* sensitive information type, it is frequently **the** regulated identifier, and it is disproportionately likely to be a bare digit string. That is the collision this research is about — the identifiers that carry the most regulatory weight are, as a class, the hardest ones to detect reliably.

## Regimes with no built-in Purview coverage

Six jurisdictions in this index have in-force data protection laws and **no built-in Purview sensitive information types whatsoever**:

| Jurisdiction | Law | In force | Principal identifier |
|---|---|---|---|
| Nigeria | Nigeria Data Protection Act 2023 | 2023-06-14 | National Identification Number (NIN), 11 digits |
| Kenya | Data Protection Act 2019 | 2019-11-25 | National ID / Huduma number, 8 digits |
| Vietnam | Law on Personal Data Protection | 2026-01-01 | Personal identification number, 12 digits |
| Egypt | Law 151/2020 | 2020-10-15 | National ID, 14 digits |
| Peru | Ley 29733 | 2013-05-08 | DNI, 8 digits |
| Uruguay | Ley 18.331 | 2008-08-11 | Cédula de identidad, 8 digits |

Nigeria and Vietnam are the significant gaps. The NDPA applies to a market of well over 200 million people and carries a 72-hour breach clock; Vietnam's PDPL came into force in January 2026 with data localisation obligations and Ministry of Public Security oversight. Both require custom SITs today.

Note also that every one of these identifiers is a short bare digit string — 8 to 14 digits — so the custom SITs you build for them will land squarely in the difficult band described in the [difficulty ranking](identifier-difficulty). Plan for Exact Data Match rather than pattern matching where you can source an authoritative list.

{{< callout type="warning" >}}
This table is a working engineering summary, not legal advice. Statutory detail changes constantly, sectoral rules often override the general regime, and several entries here are phased or awaiting implementing regulations. Every row links to the responsible regulator — verify there before relying on any of it for a compliance position.
{{< /callout >}}
