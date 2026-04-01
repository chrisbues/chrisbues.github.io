---
draft: true
title: 'MDO Present Security Policies: Full Settings Comparison'
---

# Microsoft Defender for Office 365 — Preset Security Policies: Full Settings Comparison

> **References:**
> - [Recommended settings for EOP and MDO](https://learn.microsoft.com/en-us/defender-office-365/recommended-settings-for-eop-and-office365)
> - [Preset Security Policies overview](https://learn.microsoft.com/en-us/defender-office-365/preset-security-policies)
> - [Anti-spam policy settings](https://learn.microsoft.com/en-us/defender-office-365/anti-spam-policies-configure)
> - [Anti-phishing policy settings (MDO)](https://learn.microsoft.com/en-us/defender-office-365/anti-phishing-policies-mdo-configure)
> - [Safe Attachments policies](https://learn.microsoft.com/en-us/defender-office-365/safe-attachments-policies-configure)
> - [Safe Links policies](https://learn.microsoft.com/en-us/defender-office-365/safe-links-policies-configure)
> - [Quarantine policies](https://learn.microsoft.com/en-us/defender-office-365/quarantine-policies)
> - [Configuration Analyzer](https://learn.microsoft.com/en-us/defender-office-365/configuration-analyzer-for-security-policies)

---

## Policy Overview

| Attribute | Built-in Protection | Standard | Strict |
|---|---|---|---|
| **Enabled by default** | ✅ Yes (all MDO-licensed users) | ❌ No | ❌ No |
| **Policy scope** | All recipients not covered by Standard/Strict or custom policies | Admin-defined (users/groups/domains) | Admin-defined (users/groups/domains) |
| **Covers EOP policies** (anti-spam, anti-malware, anti-phish/spoof) | ❌ No | ✅ Yes | ✅ Yes |
| **Covers MDO policies** (Safe Links, Safe Attachments) | ✅ Yes (basic) | ✅ Yes | ✅ Yes |
| **Settings are locked/auto-updated** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Target audience** | Catch-all baseline | All general users | VIPs, executives, high-value targets |
| **Policy precedence** | Lowest (last applied) | 2nd (after Strict) | 1st (highest priority) |

---

## Anti-Malware Policy Settings

> Configure: [Anti-malware policies](https://learn.microsoft.com/en-us/defender-office-365/anti-malware-policies-configure)

| Setting | Default (no preset) | Standard | Strict |
|---|---|---|---|
| **Common attachments filter** (`EnableFileFilter`) | ✅ On | ✅ On | ✅ On |
| **File type filter action** (`FileTypeAction`) | Reject (NDR) | Reject (NDR) | Reject (NDR) |
| **ZAP for malware** (`ZapEnabled`) | ✅ On | ✅ On | ✅ On |
| **Quarantine policy** | AdminOnlyAccessPolicy | AdminOnlyAccessPolicy | AdminOnlyAccessPolicy |
| **Admin notification – internal senders** | ❌ Off | ❌ Off | ❌ Off |
| **Admin notification – external senders** | ❌ Off | ❌ Off | ❌ Off |

---

## Anti-Spam Policy Settings

> Configure: [Anti-spam policies](https://learn.microsoft.com/en-us/defender-office-365/anti-spam-policies-configure)

| Setting | Default (no preset) | Standard | Strict |
|---|---|---|---|
| **Bulk email threshold (BCL)** | 7 | 6 | **5** |
| **Spam action** | Move to Junk | Move to Junk | **Quarantine** |
| **Quarantine policy – Spam** | DefaultFullAccessPolicy | DefaultFullAccessPolicy | DefaultFullAccessWithNotificationPolicy |
| **High confidence spam action** | Move to Junk | **Quarantine** | **Quarantine** |
| **Quarantine policy – High confidence spam** | DefaultFullAccessPolicy | DefaultFullAccessWithNotificationPolicy | DefaultFullAccessWithNotificationPolicy |
| **Phishing action** | Move to Junk* | **Quarantine** | **Quarantine** |
| **Quarantine policy – Phishing** | DefaultFullAccessPolicy | DefaultFullAccessWithNotificationPolicy | DefaultFullAccessWithNotificationPolicy |
| **High confidence phishing action** | Quarantine | Quarantine | Quarantine |
| **Quarantine policy – High confidence phishing** | AdminOnlyAccessPolicy | AdminOnlyAccessPolicy | AdminOnlyAccessPolicy |
| **Bulk (BCL met/exceeded) action** | Move to Junk | Move to Junk | **Quarantine** |
| **Quarantine policy – Bulk** | DefaultFullAccessPolicy | DefaultFullAccessPolicy | DefaultFullAccessWithNotificationPolicy |
| **Quarantine retention period** | 15 days | **30 days** | **30 days** |
| **Spam safety tips** | ✅ On | ✅ On | ✅ On |
| **ZAP for phishing** | ✅ On | ✅ On | ✅ On |
| **ZAP for spam** | ✅ On | ✅ On | ✅ On |
| **Intra-org message action** | Default (High conf. phish) | Default | Default |

> \* Default portal behavior creates new policies with Quarantine; PowerShell defaults to Move to Junk.

---

## Anti-Phishing — Spoof Settings (EOP, all cloud mailboxes)

> Configure: [Anti-phishing policies (EOP)](https://learn.microsoft.com/en-us/defender-office-365/anti-phishing-policies-eop-configure)

| Setting | Default | Standard | Strict |
|---|---|---|---|
| **Enable spoof intelligence** (`EnableSpoofIntelligence`) | ✅ On | ✅ On | ✅ On |
| **Honor DMARC policy on spoof detection** (`HonorDmarcPolicy`) | ✅ On | ✅ On | ✅ On |
| **DMARC p=quarantine action** (`DmarcQuarantineAction`) | Quarantine | Quarantine | Quarantine |
| **DMARC p=reject action** (`DmarcRejectAction`) | Reject | Reject | Reject |
| **Spoof intelligence action** (`AuthenticationFailAction`) | Move to Junk | Move to Junk | **Quarantine** |
| **Quarantine policy – Spoof** (`SpoofQuarantineTag`) | DefaultFullAccessPolicy | DefaultFullAccessPolicy | DefaultFullAccessWithNotificationPolicy |
| **First contact safety tip** (`EnableFirstContactSafetyTips`) | ❌ Off | ✅ **On** | ✅ **On** |
| **Show (?) for unauthenticated senders** (`EnableUnauthenticatedSender`) | ✅ On | ✅ On | ✅ On |
| **Show "via" tag** (`EnableViaTag`) | ✅ On | ✅ On | ✅ On |

---

## Anti-Phishing — MDO-Specific Settings (Defender for Office 365 only)

> Configure: [Anti-phishing policies (MDO)](https://learn.microsoft.com/en-us/defender-office-365/anti-phishing-policies-mdo-configure)

| Setting | Default | Standard | Strict |
|---|---|---|---|
| **Phishing email threshold** (`PhishThresholdLevel`) | 1 – Standard | **3 – More aggressive** | **4 – Most aggressive** |
| **Enable user impersonation protection** (`EnableTargetedUserProtection`) | ❌ Off | ✅ **On** (configure users) | ✅ **On** (configure users) |
| **Enable domain impersonation – owned domains** (`EnableOrganizationDomainsProtection`) | ❌ Off | ✅ **On** | ✅ **On** |
| **Enable domain impersonation – custom domains** (`EnableTargetedDomainsProtection`) | ❌ Off | ✅ **On** (configure domains) | ✅ **On** (configure domains) |
| **Enable mailbox intelligence** (`EnableMailboxIntelligence`) | ✅ On | ✅ On | ✅ On |
| **Enable intelligence for impersonation protection** (`EnableMailboxIntelligenceProtection`) | ❌ Off | ✅ **On** | ✅ **On** |
| **Action – user impersonation detected** (`TargetedUserProtectionAction`) | No action | **Quarantine** | **Quarantine** |
| **Quarantine policy – user impersonation** (`TargetedUserQuarantineTag`) | DefaultFullAccessPolicy | DefaultFullAccessWithNotificationPolicy | DefaultFullAccessWithNotificationPolicy |
| **Action – domain impersonation detected** (`TargetedDomainProtectionAction`) | No action | **Quarantine** | **Quarantine** |
| **Quarantine policy – domain impersonation** (`TargetedDomainQuarantineTag`) | DefaultFullAccessPolicy | DefaultFullAccessWithNotificationPolicy | DefaultFullAccessWithNotificationPolicy |
| **Action – mailbox intelligence impersonation** (`MailboxIntelligenceProtectionAction`) | No action | **Move to Junk** | **Quarantine** |
| **Quarantine policy – mailbox intelligence impersonation** (`MailboxIntelligenceQuarantineTag`) | DefaultFullAccessPolicy | DefaultFullAccessPolicy | DefaultFullAccessWithNotificationPolicy |
| **Show user impersonation safety tip** (`EnableSimilarUsersSafetyTips`) | ❌ Off | ✅ **On** | ✅ **On** |
| **Show domain impersonation safety tip** (`EnableSimilarDomainsSafetyTips`) | ❌ Off | ✅ **On** | ✅ **On** |
| **Show unusual characters safety tip** (`EnableUnusualCharactersSafetyTips`) | ❌ Off | ✅ **On** | ✅ **On** |

---

## Safe Attachments Policy Settings (MDO Plan 1+)

> Configure: [Safe Attachments policies](https://learn.microsoft.com/en-us/defender-office-365/safe-attachments-policies-configure)

| Setting | Built-in Protection | Standard | Strict |
|---|---|---|---|
| **Safe Attachments action** | Block | Block | Block |
| **Quarantine policy** | AdminOnlyAccessPolicy | AdminOnlyAccessPolicy | AdminOnlyAccessPolicy |
| **Enable redirect on detection** | N/A | ✅ **On** (recommended) | ✅ **On** (recommended) |
| **Dynamic Delivery** | ❌ Off | ❌ Off | ❌ Off |
| **Safe Attachments for SharePoint/OneDrive/Teams** (`EnableATPForSPOTeamsODB`) | ✅ **On** (global setting) | ✅ On | ✅ On |
| **Safe Documents for Office clients** (`EnableSafeDocs`) | ✅ **On** (global; requires E5/A5) | ✅ On | ✅ On |
| **Allow click-through even if Safe Documents flags as malicious** (`AllowSafeDocsOpen`) | ❌ Off | ❌ Off | ❌ Off |

> **Note:** Safe Attachments global settings (`EnableATPForSPOTeamsODB`, `EnableSafeDocs`) are controlled by Built-in Protection, not Standard/Strict. Admins can modify these at any time via `Set-AtpPolicyForO365`.

---

## Safe Links Policy Settings (MDO Plan 1+)

> Configure: [Safe Links policies](https://learn.microsoft.com/en-us/defender-office-365/safe-links-policies-configure)

| Setting | Built-in Protection | Standard | Strict |
|---|---|---|---|
| **Safe Links protection for email** | ✅ On (basic) | ✅ On | ✅ On |
| **Safe Links protection for Teams** | ✅ On | ✅ On | ✅ On |
| **Safe Links protection for Office apps** | ✅ On | ✅ On | ✅ On |
| **Real-time URL scanning (suspicious links/file-pointing URLs)** | ✅ On | ✅ On | ✅ On |
| **Wait for URL scan before delivering message** | ✅ On | ✅ On | ✅ On |
| **Apply Safe Links to email sent within org** | ❌ Off | ✅ **On** | ✅ **On** |
| **Track user clicks** | ✅ On | ✅ On | ✅ On |
| **Allow users to click through to original URL** | ✅ Allowed | ✅ Allowed (Standard) | ❌ **Blocked** (Strict) |
| **URL detonation (rewrite links)** | ✅ On | ✅ On | ✅ On |

---

## Outbound Spam Settings (Recommended — not part of presets)

> **Note:** Outbound spam policies are **not included** in Standard/Strict preset security policies. These are Microsoft's recommended values for standalone or default policy configuration.
>
> Configure: [Outbound spam filtering](https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-policies-configure)

| Setting | Default | Recommended Standard | Recommended Strict |
|---|---|---|---|
| **External message limit per hour** (`RecipientLimitExternalPerHour`) | 0 (service default) | 500 | 400 |
| **Internal message limit per hour** (`RecipientLimitInternalPerHour`) | 0 (service default) | 1,000 | 800 |
| **Daily message limit** (`RecipientLimitPerDay`) | 0 (service default) | 1,000 | 800 |
| **Action when limit reached** (`ActionWhenThresholdReached`) | Block for today | **Block user** | **Block user** |
| **Auto-forwarding rules** (`AutoForwardingMode`) | Automatic (= Off) | Automatic (= Off) | Automatic (= Off) |

---

## Quarantine Policy Reference

> Configure: [Quarantine policies](https://learn.microsoft.com/en-us/defender-office-365/quarantine-policies)

| Policy Name | User Can Release? | Quarantine Notifications |
|---|---|---|
| **AdminOnlyAccessPolicy** | ❌ No (request only) | ❌ No |
| **DefaultFullAccessPolicy** | ✅ Yes | ❌ No |
| **DefaultFullAccessWithNotificationPolicy** | ✅ Yes | ✅ Yes |

---

## Key Behavioral Differences: Standard vs. Strict

| Behavior | Standard | Strict |
|---|---|---|
| Spam disposition | Junk folder | **Quarantine** |
| Bulk mail disposition | Junk folder | **Quarantine** |
| Spoof disposition | Junk folder | **Quarantine** |
| Mailbox intelligence impersonation | Junk folder | **Quarantine** |
| Phishing threshold | 3 – More aggressive | 4 – **Most aggressive** |
| User click-through on Safe Links | Allowed | **Blocked** |
| Quarantine notifications (broad verdicts) | Enabled for high-risk | Enabled + broader coverage |
| BCL threshold | 6 | **5** |

---

*Last verified against Microsoft Learn documentation — March 2026.*