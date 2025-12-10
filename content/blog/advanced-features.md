---
title: "Advanced Hextra Features"
date: 2025-10-23
description: "Explore advanced features of Hextra including search, dark mode, and multilingual support."
tags: ["advanced", "features", "hextra"]
params:
  featuredImage: "/images/blog/advanced-features.jpg"
---

## Introduction

This example shows how to use a **params-based featured image**. The image is referenced from your static folder or external URL.

## When to Use Params Method

Use `params.featuredImage` when:

- You want to use external images (CDN, etc.)
- You have images in a centralized location
- You don't need Hugo's image processing
- You're migrating from another platform

## Setting the Featured Image

Simply add to your front matter:

```yaml
params:
  featuredImage: "/images/blog/your-image.jpg"
```

Or use an external URL:

```yaml
params:
  featuredImage: "https://example.com/image.jpg"
```

## Content Features

### Dark Mode Support

The template automatically adapts to dark mode, ensuring your images and content look great in both themes.

### Responsive Design

All layouts are fully responsive and work beautifully on:
- Mobile devices
- Tablets
- Desktop screens
- Ultra-wide monitors

### Performance

The template is optimized for:
- Fast loading times
- Minimal JavaScript
- Efficient CSS
- Lazy loading images

## Conclusion

Both methods work great - choose the one that fits your workflow best!
