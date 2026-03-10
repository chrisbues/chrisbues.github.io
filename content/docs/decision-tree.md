---
title: Interactive Decision Trees
description: How to use the decision-tree shortcode to add interactive, branching decision trees to any page.
date: 2025-01-01
decision_tree: true
toc: true
---

The `decision-tree` shortcode renders an interactive, step-by-step decision tree — one question at a time — with **Back** and **Start Over** navigation, a breadcrumb trail, and optional result links. It works in both light and dark mode.

## Live Demo

{{< decision-tree data="purview-solution-finder" title="Microsoft Purview Solution Finder" />}}

---

## Usage

### From a data file (recommended)

Place a JSON file in `data/trees/<name>.json`, then reference it by name:

```
{{</* decision-tree data="my-tree" /*/>}}
```

Enable the shortcode on the page by adding `decision_tree: true` to the front matter.

### Inline JSON

Supply the tree structure directly inside the shortcode:

```
{{</* decision-tree */>}}
{
  "start": "q1",
  "nodes": {
    "q1": {
      "type": "question",
      "text": "Is this your first visit?",
      "options": [
        { "text": "Yes", "next": "result-new" },
        { "text": "No",  "next": "result-returning" }
      ]
    },
    "result-new": {
      "type": "result",
      "text": "Welcome! Start with the Getting Started guide.",
      "links": [{ "text": "Getting Started", "url": "/docs/" }]
    },
    "result-returning": {
      "type": "result",
      "text": "Welcome back! Check the changelog for what's new."
    }
  }
}
{{</* /decision-tree */>}}
```

---

## Data schema

### Top-level object

| Field   | Type   | Required | Description                              |
|---------|--------|----------|------------------------------------------|
| `start` | string | Yes      | ID of the first node to display          |
| `nodes` | object | Yes      | Map of node IDs to node objects          |

### Question node

| Field         | Type   | Required | Description                                      |
|---------------|--------|----------|--------------------------------------------------|
| `type`        | string | Yes      | Must be `"question"`                             |
| `text`        | string | Yes      | The question text shown to the user              |
| `description` | string | No       | Optional sub-text displayed below the question   |
| `options`     | array  | Yes      | List of answer option objects (see below)        |

### Option object (inside `options`)

| Field  | Type   | Required | Description                                     |
|--------|--------|----------|-------------------------------------------------|
| `text` | string | Yes      | The answer label shown on the button            |
| `next` | string | Yes      | ID of the node to navigate to when selected     |

### Result node

| Field         | Type   | Required | Description                                              |
|---------------|--------|----------|----------------------------------------------------------|
| `type`        | string | Yes      | Must be `"result"`                                       |
| `text`        | string | Yes      | The result headline                                      |
| `description` | string | No       | HTML-safe description or recommendation text             |
| `links`       | array  | No       | Optional list of link objects (see below)                |

### Link object (inside `links`)

| Field  | Type   | Required | Description                                                             |
|--------|--------|----------|-------------------------------------------------------------------------|
| `text` | string | Yes      | Link label                                                              |
| `url`  | string | Yes      | URL — external links (http/https) open in a new tab automatically       |

---

## Front matter

Add `decision_tree: true` to any page's front matter to load the required CSS and JavaScript:

```yaml
---
title: My Page
decision_tree: true
---
```
