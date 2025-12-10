---
title: "Getting Started with Hextra"
date: 2025-10-24
description: "Learn how to set up and customize your Hextra site with featured images and beautiful blog layouts."
tags: ["tutorial", "hextra", "hugo"]
---

## Introduction

This is an example blog post using a **page bundle** structure. The featured image is stored alongside this content file and will be automatically processed by Hugo.

## Page Bundle Benefits

Using page bundles gives you:

1. **Automatic image optimization** - Hugo will resize and optimize your images
2. **Clean organization** - Keep images with their related content
3. **Better performance** - WebP conversion and responsive sizing
4. **Easy management** - Everything in one folder

## How It Works

When you place an image named `featured.jpg`, `cover.jpg`, or `thumbnail.jpg` in the same directory as your `index.md`, the template automatically:

- Detects the image
- Resizes it to 800px width
- Converts to WebP format
- Applies quality optimization (80%)
- Generates proper alt text

## Content Example

Here's some sample content to demonstrate what a blog post might look like...

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Code Example

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Hextra!")
}
```

### Lists

- Feature 1
- Feature 2
- Feature 3

## Conclusion

This template makes it easy to create beautiful, image-rich blog posts with minimal configuration.
