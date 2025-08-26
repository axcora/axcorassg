---
title: "Image"
date: "2025-08-15"
tags: 
 - image
 - image axcora
 - image components
category: "components"
description: "How to use image component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - image
    - navbar
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
---
The **Image components** in Axcora SSG provide a robust and flexible way to display images responsively on your site, supporting a range of use cases from simple inline images to aspect-ratio-controlled covers and thumbnails. Axcora SSG enables you to import these components per template or use them directly in your Markdown content, with clear distinction between usage in templating and markdown.

Example:
{% axcora-image-responsive title="Title" image="/img/ax.jpg" loading="lazy" /%}

---

## 1. Enabling the Image Component

To use image components in a template, add it to the front-matter configuration as shown below (e.g., in `templates/blog/single.axcora`):

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - image
---
<main>{{content}}</main>
```

After importing, all image component variants are available for use in both template files and Markdown content.

---

## 2. Usage Patterns

### Markdown Usage

When embedding images in Markdown content, use:

```text
{% axcora-image-cover src="{{image}}" alt="{{title}}" /%}
```

### Templating Usage

When using the image component in templates, the attribute names are different:

```text
{% axcora-image-cover image="{{image}}" title="{{title}}" /%}
```

---

## 3. Image Component Variants

| Component                 | Description                                      | Key Props                                  |
|---------------------------|--------------------------------------------------|---------------------------------------------|
| `axcora-image-cover`      | Image with cover effect and optional corners     | `src`/`image`, `alt`/`title`, `rounded`    |
| `axcora-image-responsive` | Fully responsive image with lazy loading         | `image`, `title`, `loading`                |
| `axcora-image-fluid`      | Fluid image with optional width/height           | `image`, `title`, `width`, `height`        |
| `axcora-image-thumbnail`  | Small, styled thumbnail presentation             | `image`, `title`, `width`, `height`        |
| `axcora-image-ratio`      | Image with controlled aspect ratio               | `image`, `title`, `ratio`                  |
| `axcora-image-contain`    | Image fit within a box, maintaining aspect ratio | `image`, `title`, `width`, `height`        |

**Examples:**

- **Responsive Image**
  ```text
  {% axcora-image-responsive title="Title" image="/img/ax.jpg" loading="lazy" /%}
  ```
- **Fluid Image**
  ```text
  {% axcora-image-fluid title="Title" image="/img/ax.jpg" width="" height="" /%}
  ```
- **Thumbnail Image**
  ```text
  {% axcora-image-thumbnail title="Title" image="/img/ax.jpg" width="" height="" /%}
  ```
- **Ratio Image**
  ```text
  {% axcora-image-ratio title="Title" image="/img/ax.jpg" ratio="16x9" /%}
  ```
- **Cover Image**
  ```text
  {% axcora-image-cover title="Title" image="/img/ax.jpg" width="" height="" rounded="rounded-lg" /%}
  ```
- **Contain Image**
  ```text
  {% axcora-image-contain title="Title" image="/img/ax.jpg" width="" height="" /%}
  ```

---

## 4. Accessibility and Optimization

- Always set descriptive `alt` or `title` attributes for every image (for screen readers and SEO).
- Use the `loading="lazy"` attribute where possible to improve page load performance.
- For ratio or cover images, ensure the aspect ratio matches the purpose (e.g., `16x9` for videos, `1x1` for profile photos).

---

## 5. Best Practices

- **Responsiveness:** Use the `img-responsive` or `img-fluid` class for flexible images that adapt to all devices.
- **Performance:** Use the smallest necessary image size, and prefer lazy loading for off-screen images.
- **Presentation:** Use thumbnails for previews, ratio for highlight banners, and cover/contain for precise image placement.
- **Consistency:** Match your usage patterns (Markdown or templating) with the required property names for each context.

---

## Summary Table

| Variant                  | Key Purpose                              | Notable Attributes             |
|--------------------------|------------------------------------------|-------------------------------|
| `axcora-image-responsive`| Flexible images, full-width containers   | `title`, `image`, `loading`   |
| `axcora-image-fluid`     | Scaled images, rounded corners           | `title`, `image`, `width`, `height` |
| `axcora-image-cover`     | Cropped, full-bleed image blocks         | `title`/`alt`, `image`/`src`, `width`, `height`, `rounded` |
| `axcora-image-thumbnail` | Small, bordered preview                  | `title`, `image`, `width`, `height`  |
| `axcora-image-ratio`     | Strict aspect ratio                      | `title`, `image`, `ratio`           |
| `axcora-image-contain`   | Image fit within set box                 | `title`, `image`, `width`, `height` |

The **Axcora SSG image components** give you full control and consistent styles for presenting images responsively, accessibly, and with powerful visual layouts directly in Markdown or template files.
