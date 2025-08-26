---
title: "Axcora Components"
date: "2025-08-25"
tags: 
 - axcora components
 - components axcora
category: "components"
description: "How to use axcora components"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - badge
    - breadcrumb
    - pagination
    - image
    - cards
js:
  - navbar
  - theme
---
**Axcora** is an **all-in-one static site generator (SSG) and CSS framework** designed to make web development faster and more efficient for developers. Its core approach is flexibility: you select only the CSS and JS components you need for each theme or per-article, and Axcora automatically minifies and serves just the required assets per page. This means your site loads faster and follows modern best practices by avoiding unnecessary code.

### Key Features

- **Flexible CSS & JS Component Inclusion:**  
  Choose and include only the CSS and JS components you need, either globally for your theme or specifically per article. For maximum simplicity, include all available components with the following config:
  ```yaml
  css:
    theme: 'essentials'
    components:
      - axcora
  js:
    - axcora
  ```
  This approach ensures you get every feature, but for optimal performance, you can tailor individual pages or themes with just the components required[2][4].

- **Automatic Minification:**  
  Every CSS and JS component you use—regardless of theme or per-article—will be auto-minified by Axcora during build. This keeps builds lightweight, fast, and efficient[2].

- **Ready-to-Use Themes:**  
  Select from a range of built-in visual styles to match your project’s tone:
  - brutal
  - corporate
  - cyberpunk
  - dark
  - essentials
  - minimal
  - startup

- **Modular CSS Components:**  
  Include only what you need:
  - accordion, badge, blockquote, breadcrumb, buttons, cards, carousel, dropdown, forms, glass, hero, images, modal, navbar, pagination, scrollspy, search, spinner, table, tabs, toast, video  
  Or simply use `axcora` for the full set.

- **Modular JS Components:**  
  Use focused interactivity:
  - accordion, button, carousel, dropdown, modal, navbar, search, tabs, theme (dark/light mode), toast, youtube-lite  
  Or include `axcora` for all.

- **Best Practice Asset Loading:**  
  By only serving the assets you use, Axcora empowers fast, scalable, and maintainable site builds—optimized for SEO, user experience, and server speed[2][4].

### Example Usage

Specify components globally (theme-wide) or per-article:
```yaml
css:
  theme: 'essentials'
  components:
    - navbar
    - badge
    - hero
    - pagination
    # ... more if needed
js:
  - navbar
  - theme
```
Or load the full set with:
```yaml
css:
  theme: 'essentials'
  components:
    - axcora
js:
  - axcora
```

### Workflow Benefits

- Every Markdown/document page can define unique or shared assets.
- Only the requested components are shipped and minified—no unused CSS/JS is bundled.
- You achieve **best practice** performance and structure for modern static sites.

### Summary

Axcora uniquely combines static site generation with modular CSS/JS framework capabilities to streamline web development.  
- Just choose and insert your needed components.
- Let Axcora optimize assets for each page or theme—globally or individually.
- Get blazing-fast sites that are lighter, easier to manage, and future-proof.

**Start using Axcora today for fast, component-driven static websites tailored to your exact needs.**
