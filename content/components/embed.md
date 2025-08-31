---
title: "Iframe Embed"
date: "2025-08-18"
tags: 
 - embed
 - embed axcora
 - embed components
category: "components"
description: "How to use embed iframe component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - hero
    - breadcrumb
    - pagination
    - image
    - cards
    - video
js:
  - navbar
---
The **iframe component** in Axcora SSG allows you to embed external content—such as videos, web pages, or interactive widgets—directly within your templates or Markdown-based article content. This is achieved using a flexible, responsive component with modern styling and several aspect ratio options.

**installation**

```
npm i axcora-iframe
```

## Usage in Templates

To enable the iframe component for a template, import it in your template’s front-matter. For example, in `templates/blog/single.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - video
---
<main>{{content}}</main>
```

Once imported, iframe embedding can be used anywhere in your site’s Markdown content or template files.

## Implementation Example

To embed external content (such as a YouTube video), use:

```text
{% axcora-iframe url="https://www.youtube.com/embed/sBljFnEB7Sg" ratio="16x9" title="Iframe Video" /%}
```

**Output:**  
{% axcora-iframe url="https://www.youtube.com/embed/sBljFnEB7Sg" ratio="16x9" title="Iframe Video" /%}

## Component Properties

| Property | Type   | Description                                         |
|----------|--------|-----------------------------------------------------|
| `url`    | string | The external resource URL to load in the iframe     |
| `ratio`  | string | Aspect ratio: `21x9`, `16x9`, `4x3`, or `1x1`       |
| `title`  | string | Title for accessibility and identification (optional)|

## Supported Aspect Ratios

- **21x9** (ultrawide), **16x9** (HD), **4x3** (classic), **1x1** (square)
- Set the `ratio` property accordingly to control the frame’s aspect

## CSS Styling

The component provides a fully responsive, visually modern embedded frame:

```css
.embed-21x9,
.embed-16x9,
.embed-4x3,
.embed-1x1 {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
.embed-21x9::before { padding-top: 42.857143%; }
.embed-16x9::before { padding-top: 56.25%; }
.embed-4x3::before  { padding-top: 75%; }
.embed-1x1::before  { padding-top: 100%; }
.embed-21x9 > *, .embed-16x9 > *, .embed-4x3 > *, .embed-1x1 > *,
.embed-21x9 iframe, .embed-16x9 iframe, .embed-4x3 iframe, .embed-1x1 iframe {
  position: absolute;
  top: 0; left: 0; bottom: 0; width: 100%; height: 100%;
  border: 0;
  border-radius: var(--radius-xl);
}
```

## HTML Output

The underlying output is a styled `<iframe>` element, which loads the specified URL using the assigned aspect ratio. For optimal accessibility and browser compatibility, the `title` attribute is used for the iframe, and all visual styling is handled by the classes explained above.

## Security and Best Practices

- **Only embed trusted content**: iFrames can introduce security risks such as cross-site scripting (XSS)[2]. Avoid embedding content from unknown or untrusted sources.
- **Set the `title` attribute** for accessibility, describing the embedded content[1].
- **Aspect ratio classes**: Always use the appropriate ratio option for optimal appearance and performance across devices.
- **Consider sandboxing** highly interactive or third-party content for enhanced security using the `sandbox` attribute (see [1] for available HTML iframe attributes).

## Summary Table

| Attribute | Purpose                                                                      |
|-----------|------------------------------------------------------------------------------|
| `url`     | Link to the external resource/content                                        |
| `ratio`   | Responsive aspect ratio for iframe display                                   |
| `title`   | Accessible description of the embedded content                               |

The **Axcora SSG iframe component** offers a clean, responsive way to enrich your site with embedded media or external functionality, designed for both modern looks and robust web standards.
