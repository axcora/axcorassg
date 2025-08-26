---
title: "Badge"
date: "2025-08-23"
tags: 
 - badge
 - badge axcora
 - badge components
category: "components"
description: "How to use badge component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - badge
    - hero
    - breadcrumb
    - pagination
    - image
    - cards
js:
  - navbar
  - theme
---
The Badge component in Axcora SSG provides a modern, flexible way to highlight statuses, categories, or metadata within your templates and article content. It supports various color schemes, sizing options, and usage patterns to best fit your site's design and functional needs.

### Usage in Templates

Axcora SSG badges can be imported on a per-template basis, allowing you to embed badge elements across pages consistently. To enable the badge component, add it to your template's front-matter, for example in templates/blog/single.axcora or templates/blog/list.axcora:
```
---
css:
  theme: 'essentials'
  components:
    - badge
---
<main class="container">{{content}}</main>
```

After including the badge component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a badge using the Axcora templating syntax:
```
{% axcora-badge title="My Badge" color="primary" /%}
```

output

{% axcora-badge title="My Badge" color="primary" /%}

This will render a visually distinct badge labeled "My Badge" in the primary color.

### Usage in Content
If you want to use the badge within your article content, simply insert the badge tag at any point in your Markdown file, provided the component is imported in your template. This allows for flexible integration into post bodies, highlights, or notifications.

### Component Customization
The badge supports various color schemes and sizes for visual distinction:

Colors:
- primary
- secondary
- success
- danger
- info
- warning
- light
- dark

There are also outline variants, such as badge-outline-primary, which provide a bordered but transparent background style.

Sizes:
- badge-sm for small badges
- badge-lg for large badges

### CSS Reference
Below is an excerpt of key CSS classes provided for badge styling:

```
.badge {
  display: inline-flex;
  align-items: center;
  padding: calc(var(--spacing-sm) * 0.85) var(--spacing-md);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-xl);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-primary { background-color: var(--p500); color: white; }
.badge-outline-primary { background-color: transparent; color: var(--p600); border: 1px solid var(--p600); }
.badge-sm { padding: calc(var(--spacing-xs) * 0.25) calc(var(--spacing-xs) * 0.75); font-size: 0.625rem; }
.badge-lg { padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.875rem; }
```

You can further customize colors, outline styles, and sizing via these classes in your CSS.

### Accessibility Notes
Colors convey meaning visually, but for accessibility, ensure that information carried by a badge is also clear in text, or provide alternative cues for screen reader users. Use descriptive text within the badge whenever possible.

### Summary Table
| Property      | Type     | Description                       |
|---------------|----------|-----------------------------------|
| `title`       | string   | Badge label (required)            |
| `color`       | string   | Color variant (e.g., primary)     |
| `outline`     | boolean  | Outline style                     |
| `size`        | string   | `sm`, `lg` for sizing             |

The badge component in Axcora SSG enables clear, consistent visual communication across your site's templates and content, with robust customization through easy-to-use properties and CSS classes.
