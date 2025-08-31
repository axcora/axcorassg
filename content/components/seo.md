---
title: "Axcora SEO"
date: "2025-08-11"
tags: 
 - SEO
 - seo axcora
 - seo components
category: "components"
description: "How to use SEO component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - search
    - navbar
    - image
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
  - search
---
The **Axcora SEO Component** (`axcora-seo`) is an automated SEO injection system designed to simplify and optimize the process of adding structured SEO metadata to static and JAMSTACK-based websites. This component auto-generates and injects keywords, meta descriptions, Open Graph tags, Twitter Cards, ensuring your content is SEO-ready without manual editing for each page.

**installation**

```bash
npm i axcora-seo
```

---

## What Is `axcora-seo`?

- **`axcora-seo`** is a component or shortcode that, when included in your template or page, dynamically inserts all critical meta tags and structured data based on your page's frontmatter or content context.

---

## Key Features

- **Automatic Meta Tag Generation:**  
  Extracts the title and description from your content to populate `<title>`, `<meta name="description">`, and relevant `<meta>` tags.

- **Rich Card Support:**  
  Injects Open Graph, Twitter Card, for rich social sharing and improved SERP display.

- **No Manual Coding:**  
  By placing `{% axcora-seo /%}` in your template, Axcora handles all SEO metadata injection automatically.

- **Content-Aware:**  
  Uses the actual content and frontmatter fields to create SEO tags that are always in sync with the page's theme and topic.

---

## Usage Example

To implement the SEO component in your Axcora-based static site or JAMSTACK project, place the shortcode in your HTML head section:

```html
{% axcora-seo /%}
```

*Place this within the `<head>` section of your main template:*

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Axcora SEO -->
{% axcora-seo /%}
<!-- 🚀 AXCORA CSS FRAMEWORK - ALL IN ONE -->  
{{ cssLinks }}
</head>
<body>
{% include header.axcora %}
{{ content }}
{% include footer.axcora %}
</body>
</html>
```

---

## How It Works

- Parses the page or article's frontmatter (title, description, image, etc.).
- Generates SEO tags including:
  - `<title>` and `<meta name="description">`
  - `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, etc.
  - `<meta name="twitter:card">`, `<meta name="twitter:title">`, `<meta name="twitter:description">`
- Ensures every page is properly indexed and rich in SEO-relevant data.

---

## Benefits

- **Increased Site Speed:**  
  No heavy backend or database interaction, perfectly suited for static and JAMSTACK sites.
- **SEO Consistency:**  
  Every page is SEO optimized consistently based on its content.
- **Reduced Errors:**  
  Eliminates the risk of manual metadata configuration mistakes.
- **Modern Social Integration:**  
  Social and search engines always receive the right metadata for sharing and indexing.

---

## Compatibility

- Works with all **Axcora SSG** and CMS projects.
- Supports integration with JAMSTACK-based workflows and modern static site.
- Can be used alongside other Axcora components in the same template frontmatter.

---

## Summary

By adding `{% axcora-seo /%}` to your templates, **Axcora** automates the creation of all essential SEO meta tags and structured data, streamlining best-in-class SEO for any modern web project.

*This system is recommended for all websites aiming for high SEO performance, ensuring metadata and structured data are always optimized and synchronized with your content.*
