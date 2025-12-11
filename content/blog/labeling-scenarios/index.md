---
title: "Purview Sensitivity Label Auto-Labeling Scenarios"
date: 2025-12-11
description: "Learn about the various auto-labeling mechanisms available in Microsoft Purview."
tags: ["tutorial", "purview", "auto-labeling"]
draft: true
---


# Purview Sensitivity Label Auto-Labeling Scenarios

## Primary Auto-Labeling Mechanisms

| # | Mechanism | Location/Platform | How It Works | Based On | Override Manual Labels? | Override Auto-Applied Lower Priority? | Override Auto-Applied Higher Priority? | Override Default Label from Policy? | Key Notes | Documentation Reference |
|---|-----------|------------------|--------------|----------|------------------------|--------------------------------------|----------------------------------------|-------------------------------------|-----------|------------------------|
| 1 | **Client-Side Auto-Labeling** | Word, Excel, PowerPoint, Outlook | Real-time labeling as users create/edit documents or compose/reply/forward emails | SITs, Trainable Classifiers | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • Can be automatic or recommended<br>• User can accept/reject<br>• Minimal delay<br>• Exception: No action if file has sublabel from same parent when another sublabel from same parent matches | [Configure auto-labeling for Office apps](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically#how-to-configure-auto-labeling-for-office-apps) |
| 2 | **Service-Side Auto-Labeling Policies** | SharePoint, OneDrive, Exchange Online (in-transit) | Scans files at rest in SharePoint/OneDrive and emails in transit through Exchange | SITs, Trainable Classifiers, sharing options, file type, size, properties, creator | ❌ No<br>(Exchange: ⚙️ Configurable) | ✅ Yes | ❌ No<br>(Exchange: ⚙️ Configurable) | ✅ Yes (if higher priority) | • Can run in simulation mode first<br>• Exchange has optional "always override" setting<br>• Additional conditions available per location | [Configure auto-labeling policies for SharePoint, OneDrive, and Exchange](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically#how-to-configure-auto-labeling-policies-for-sharepoint-onedrive-and-exchange) |
| 3 | **SharePoint Library Default Label** | SharePoint document libraries | Location-based labeling applied to new/edited files in specific library | Location (no content inspection) | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • Applied at library level<br>• Takes a few minutes for uploads<br>• Immediate in Office web<br>• Files must contain content | [Configure a default sensitivity label for a SharePoint document library](https://learn.microsoft.com/en-us/purview/sensitivity-labels-sharepoint-default-label) |
| 4 | **Information Protection Scanner** | On-premises file shares, SharePoint Server 2013-2019 | Scheduled scans of on-premises files | SITs, Trainable Classifiers, or default labels | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • Requires Windows Server + SQL Server<br>• Discovery or automatic mode<br>• Can apply default label to all files<br>• "Treat recommended as automatic" option | [Learn about the information protection scanner](https://learn.microsoft.com/en-us/purview/deploy-scanner) |
| 5 | **Email Inheritance from Attachments** | Outlook (all platforms) | Email inherits highest priority label from labeled document attachments | Attachment labels | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • Physical file attachments only (not links)<br>• Can be automatic or recommended<br>• Can inherit encryption settings<br>• Policy setting: "Email inherits highest priority label from attachments" | [Configure label inheritance from email attachments](https://learn.microsoft.com/en-us/purview/sensitivity-labels-office-apps#configure-label-inheritance-from-email-attachments) |
| 6 | **Email Thread Label Inheritance** | Outlook | Label on email automatically applied to subsequent replies in thread | Previous email in thread | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • Automatic on reply/forward<br>• Appears in Activity Explorer as automatic labeling | [Labeling activities - Sensitivity label applied](https://learn.microsoft.com/en-us/purview/data-classification-activity-explorer-available-events#sensitivity-label-applied) |
| 7 | **Encryption-Based Label Matching** | Office apps (documents) | When document has admin-defined encryption without label, Office assigns matching label | Matching encryption policy embedded in document | ⚠️ Can replace non-encrypted labels | ✅ Yes | ⚠️ Varies | ✅ Yes | • Helps migrate from rights management templates<br>• Common with encrypted email attachments<br>• Works only within tenant | [Encryption-based label matching for documents](https://learn.microsoft.com/en-us/purview/sensitivity-labels-office-apps#encryption-based-label-matching-for-documents) |
| 8 | **Power BI - Creation Inheritance** | Power BI Service | New reports/dashboards automatically inherit label from parent semantic model/report | Parent item label | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • Automatic on creation<br>• Won't block creation if label can't be applied | [Sensitivity label inheritance upon creation](https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-security-sensitivity-label-overview#sensitivity-label-inheritance-upon-creation-of-new-content) |
| 9 | **Power BI - Downstream Inheritance** | Power BI Service | Label on semantic model/report propagates to downstream content | Parent item label | ❌ Never | ✅ Yes (never downgrades) | ❌ Never | ✅ Yes (if higher priority) | • Two modes: User Consent or Fully Automated<br>• Limited to 80 downstream items<br>• Never replaces with less restrictive label<br>• Strictly enforces no downgrade rule | [Sensitivity label downstream inheritance](https://learn.microsoft.com/en-us/fabric/governance/service-security-sensitivity-label-downstream-inheritance) |
| 10 | **Power BI - Data Source Inheritance** | Power BI semantic models | Semantic models inherit labels from labeled source data | Data source label | ❌ Never | ❌ No | ❌ Never | ❌ No | • Sources: Azure Synapse, Azure SQL, Excel on OneDrive/SharePoint<br>• Most restrictive chosen if multiple sources<br>• Occurs on connection and refresh<br>• Desktop: Banner recommends more restrictive label | [Sensitivity label inheritance from data sources](https://learn.microsoft.com/en-us/fabric/governance/service-security-sensitivity-label-inheritance-from-data-sources) |
| 11 | **Microsoft Syntex Document Understanding** | SharePoint document libraries | AI models identify document types and apply configured labels | AI model recognition | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • Model trained to recognize documents<br>• Label configured in model settings<br>• Honors label order/priority rules<br>• Applies to Office files: .docx, .pptx, .xlsx | [Apply a sensitivity label to a model in Microsoft Syntex](https://learn.microsoft.com/en-us/microsoft-365/contentunderstanding/apply-a-sensitivity-label-to-a-model) |
| 12 | **Purview Data Map Auto-Labeling** | Non-M365 data sources (Azure Storage, SQL, etc.) | Scans registered data sources for sensitive content | Built-in classifiers only | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • No custom SITs, trainable classifiers, or EDM<br>• No simulation mode for Data Map<br>• Applied to files and database columns | [Learn about sensitivity labels in Data Map](https://learn.microsoft.com/en-us/purview/data-map-sensitivity-labels) |
| 13 | **Defender for Cloud Apps** | Cloud apps monitored by Defender | Session policies apply labels through cloud app monitoring | Session policy conditions | ❌ No | ⚠️ Varies | ❌ No | ⚠️ Varies | • "Protect" action won't override existing labels<br>• Can detect and alert on label changes<br>• Requires Azure Information Protection P1/P2 | [Using Microsoft Defender for Cloud Apps controls](https://learn.microsoft.com/en-us/fabric/governance/service-security-using-defender-for-cloud-apps-controls) |
| 14 | **Default Label from Publishing Policy** | Word, Excel, PowerPoint, Outlook, Power BI/Fabric | Policy specifies default label for new/unlabeled content when created | Policy configuration | ❌ Never | ❌ Never | ❌ Never | N/A | • **TREATED AS AUTOMATICALLY APPLIED**<br>• Never overrides existing labels<br>• Only applies to unlabeled content<br>• Different behavior for files/email vs Power BI<br>• Not recommended for encrypted labels | [What label policies can do](https://learn.microsoft.com/en-us/purview/sensitivity-labels#what-label-policies-can-do) |
| 15 | **Fabric/Power BI Domain-Level Default Label** | Fabric domains | Domain admin sets default label for workspaces in their domain | Domain configuration | ❌ No | ✅ Yes | ❌ No | ✅ Yes (if higher priority) | • Applied when items created/updated in domain workspaces<br>• Follows same override logic as other auto-labeling | [Domain-level default sensitivity labels](https://learn.microsoft.com/en-us/fabric/governance/domain-default-sensitivity-label) |

---

## Critical Classification: Default Label from Publishing Policy

| Label Type | How Applied | Treated As | Can Be Overridden By Other Auto-Labeling? | Can Override Other Labels? | Documentation Reference |
|------------|-------------|------------|-------------------------------------------|---------------------------|------------------------|
| **Default Label from Publishing Policy** | Applied to unlabeled content when created | **Automatically Applied** | ✅ Yes (by higher priority auto-labeling) | ❌ Never | [What label policies can do](https://learn.microsoft.com/en-us/purview/sensitivity-labels#what-label-policies-can-do) |
| **Default Label from SharePoint Library** | Applied to files in specific library | **Automatically Applied** | ✅ Yes (by higher priority or manual) | ✅ Yes (lower priority auto/default labels) | [Configure a default sensitivity label for a SharePoint document library](https://learn.microsoft.com/en-us/purview/sensitivity-labels-sharepoint-default-label) |
| **Manually Applied Label** | User explicitly selects label | **Manually Applied** | ❌ Almost Never (except Exchange with explicit setting) | ✅ Yes (with justification if configured) | [Apply sensitivity labels to your files and email](https://support.microsoft.com/office/apply-sensitivity-labels-to-your-files-and-email-in-office-2f96e7cd-d5a4-403b-8bd7-4cc636bae0f9) |

---

## Universal Override Rules

| Rule | Description | Exceptions | Documentation Reference |
|------|-------------|------------|------------------------|
| **Manual Labels are Protected** | Manually applied labels are almost never overridden by auto-labeling | Exchange service-side policies can be configured to override | [Will an existing label be overridden?](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically#will-an-existing-label-be-overridden) |
| **Priority/Order Determines Winner** | Labels have order numbers. Higher priority can replace lower priority through auto-labeling | Does not apply to manually applied labels | [Label priority (order matters)](https://learn.microsoft.com/en-us/purview/sensitivity-labels#label-priority-order-matters) |
| **Default Policy Labels are Passive** | Default labels from publishing policies never override any existing label (manual or automatic) | None | [What label policies can do](https://learn.microsoft.com/en-us/purview/sensitivity-labels#what-label-policies-can-do) |
| **No Downgrade in Power BI** | Power BI downstream inheritance never replaces with less restrictive label | None | [Downstream inheritance considerations](https://learn.microsoft.com/en-us/fabric/governance/service-security-sensitivity-label-downstream-inheritance#considerations-and-limitations) |
| **Sublabel Parent Exception** | Client-side auto-labeling: If file has sublabel from parent X, and another sublabel from parent X matches, no action taken | Does not apply to service-side auto-labeling | [How multiple conditions are evaluated](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically#how-multiple-conditions-are-evaluated-when-they-apply-to-more-than-one-label) |
| **80-Item Limit** | Power BI downstream inheritance limited to 80 items | If exceeded, no downstream inheritance occurs | [Downstream inheritance considerations](https://learn.microsoft.com/en-us/fabric/governance/service-security-sensitivity-label-downstream-inheritance#considerations-and-limitations) |

---

## Label Application Priority (Highest to Lowest)

| Priority | Label Type | Can Be Overridden? | Documentation Reference |
|----------|------------|-------------------|------------------------|
| 1 | **Manually Applied** | ❌ Almost Never | [Will an existing label be overridden?](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically#will-an-existing-label-be-overridden) |
| 2 | **Auto-Applied (High Priority Label)** | ❌ No (by lower priority)<br>✅ Yes (by higher priority or manual) | [Label priority (order matters)](https://learn.microsoft.com/en-us/purview/sensitivity-labels#label-priority-order-matters) |
| 3 | **Auto-Applied (Low Priority Label)** | ✅ Yes (by higher priority or manual) | [Label priority (order matters)](https://learn.microsoft.com/en-us/purview/sensitivity-labels#label-priority-order-matters) |
| 4 | **Default Label from Publishing Policy** | ✅ Yes (by any auto-labeling or manual) | [What label policies can do](https://learn.microsoft.com/en-us/purview/sensitivity-labels#what-label-policies-can-do) |
| 5 | **Unlabeled** | ✅ Yes (by any labeling mechanism) | [Automatically apply a sensitivity label](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically) |

---

## Auditing & Monitoring Events

| Activity | Event Name | Details Captured | Where to View | Documentation Reference |
|----------|-----------|------------------|---------------|------------------------|
| **Label Applied** | Sensitivity label applied | Source (manual/auto), label name, user, location, timestamp | Activity Explorer, Audit Log | [Labeling activities - Sensitivity label applied](https://learn.microsoft.com/en-us/purview/data-classification-activity-explorer-available-events#sensitivity-label-applied) |
| **Label Changed** | Sensitivity label changed | Old label, new label, upgrade/downgrade indicator, justification text | Activity Explorer, Audit Log | [Labeling activities - Sensitivity label changed](https://learn.microsoft.com/en-us/purview/data-classification-activity-explorer-available-events#sensitivity-label-changed) |
| **Label Removed** | Sensitivity label removed | Previous label, justification (if required), user | Activity Explorer, Audit Log | [Get started with activity explorer](https://learn.microsoft.com/en-us/purview/data-classification-activity-explorer) |
| **Library Default Applied** | Applied sensitivity label file | ActionSourceDetails = 6 (library default), label GUID | Audit Log (SharePoint list activities) | [Monitoring application of library default sensitivity labels](https://learn.microsoft.com/en-us/purview/sensitivity-labels-sharepoint-default-label#monitoring-application-of-library-default-sensitivity-labels) |
| **Auto-Labeling Policy Match** | Various events based on policy | Policy name, rule matched, simulation vs production mode | Auto-labeling policy interface, Activity Explorer | [Learn about simulation mode](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically#learn-about-simulation-mode) |
| **Downstream Inheritance** | Sensitivity label applied | Inheritance source, affected items | Activity Explorer | [Get started with activity explorer](https://learn.microsoft.com/en-us/purview/data-classification-activity-explorer) |

---

## Additional Resources

| Topic | Description | Documentation Link |
|-------|-------------|-------------------|
| **Overview of Sensitivity Labels** | Comprehensive guide to sensitivity labels | [Learn about sensitivity labels](https://learn.microsoft.com/en-us/purview/sensitivity-labels) |
| **Creating and Publishing Labels** | How to create and configure sensitivity labels and policies | [Create and configure sensitivity labels](https://learn.microsoft.com/en-us/purview/create-sensitivity-labels) |
| **Automatic Labeling Overview** | Main overview page for all auto-labeling methods | [Automatically apply a sensitivity label to Microsoft 365 data](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically) |
| **Default Labels and Policies** | Default configurations for new customers | [Default sensitivity labels and policies](https://learn.microsoft.com/en-us/purview/default-sensitivity-labels-policies) |
| **Trainable Classifiers** | Using machine learning for classification | [Learn about trainable classifiers](https://learn.microsoft.com/en-us/purview/trainable-classifiers-learn-about) |
| **Sensitive Information Types** | Built-in and custom patterns for detection | [Learn about sensitive information types](https://learn.microsoft.com/en-us/purview/sit-sensitive-information-type-learn-about) |

---

## Key Takeaways

1. **Default labels from publishing policies are the weakest form of labeling** - they're treated as automatically applied and can be overridden by any other auto-labeling mechanism with higher priority

2. **Manual labels have the strongest protection** - almost nothing can override them (except Exchange service-side policies with explicit configuration)

3. **Priority/Order matters for all auto-labeling** - higher priority labels can replace lower priority labels (unless manually applied)

4. **Power BI has strictest rules** - never downgrades labels, never overrides manual labels, and data source inheritance never overrides anything

5. **Each mechanism has its use case**:
   - Client-side: Real-time user awareness
   - Service-side: Large-scale consistent enforcement
   - Library defaults: Location-based baseline protection
   - Scanner: On-premises file remediation
   - Inheritance: Maintaining classification across related content
