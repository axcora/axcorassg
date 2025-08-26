---
title: "Plugin"
date: "2025-08-15"
tags: 
 - axcora plugins
 - plugin syntax
category: "templating"
description: "How to use Plugin Synhtax in Axcora Templating"
image: "/img/logo.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - hero
    - pagination
    - image
    - cards
js:
  - navbar
  - theme
---
### Plugin Syntax in Axcora Templates

Axcora supports a modern, extensible plugin syntax to add dynamic or interactive features to your templates using **custom tags**. Plugins make it easy to embed complex components—like images, videos, and more—without verbose HTML or external JavaScript.

---

#### Image Plugin

Use the image plugin for simplified, responsive, and optimized image handling:

```
<!-- Basic responsive image -->
{% axcora-image src="/img/hero.jpg" alt="Hero Image" %}

<!-- Responsive image with custom attributes -->
{% axcora-image-fluid 
  image="/img/hero.jpg" 
  title="Hero Image"
  width="800" 
  height="400"
%}
```

- `{% axcora-image %}` inserts a responsive image with the given source and alt text.
- `{% axcora-image-fluid %}` allows additional options, including explicit width, height, and title, for more advanced layouts or performance optimization.
- These plugins handle best practices for responsive and accessible images by default.

---

#### Embed Plugin

Include responsive video embeds easily, optimized for performance (e.g., YouTube Lite):

```
<!-- YouTube Lite embed -->
{% axcora-youtube url="sBljFnEB7Sg" ratio="16x9" title="Youtube Lite Video" /%}
```

- `url` is the YouTube video ID (e.g., `"sBljFnEB7Sg"`).
- `ratio` controls the aspect ratio for the embed (e.g., `"16x9"` for widescreen).
- `title` is used for accessibility and screen readers.

---

### Key Points

- **Syntax:** Plugins use `{% plugin-name key="value" ... %}` for configuration and attributes.
- **Responsive & Accessible:** Image and embed plugins support best practices out of the box.
- **Self-Closing Tags:** Use a trailing slash or simply close the tag (`/`) for plugins that don’t wrap content.
- **Customization:** Supply any supported attributes to modify output. Future plugins may support more advanced features or even custom user plugins.

---

**Best Practices:**
- Use image plugins for all images to optimize for performance, responsiveness, and accessibility.
- Prefer embed plugins for video or third-party content (no boilerplate HTML needed).
- Read plugin documentation for all supported options and future expansions.

Plugins make your templates cleaner, safer, and more powerful—enabling composable, modern web features with easy-to-read syntax.
