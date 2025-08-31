---
title: "Glass"
date: "2025-08-17"
tags: 
 - glass
 - glass axcora
 - glass components
category: "components"
description: "How to use glass component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - glass
    - navbar
    - hero
    - breadcrumb
    - pagination
    - image
    - cards
js:
  - navbar
  - theme
---
# Glass Component Documentation

The **Glass component** in Axcora SSG brings a stylish, modern glassmorphism effect to your content blocks. This component is perfect for drawing attention to important information or adding visual flair to your layouts. You can use the glass component anywhere in your templates or within your Markdown content, ensuring both flexibility and consistency.

**installation**

```bash
npm i axcora-glass
```

---

## 1. Enabling Glass Component

Import the glass component per template by adding it to your template's front-matter, such as in `templates/blog/single.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - glass
---
<main>{{content}}</main>
```

Once imported, glass elements can be used in both Markdown content and templates.

---

## 2. Usage Examples

### Single Glass Box

```markdown
{% axcora-glass title="Glass Title" text="Content in here" /%}
```
**Output:**  
{% axcora-glass title="Glass Title" text="Content in here" /%}

---

### Two Glass Boxes

```markdown
{% axcora-glass-2 title1="Glass Title" text1="Content in here" title2="Glass Title 2" text2="Content 2 in here" /%}
```
**Output:**  
{% axcora-glass-2 title1="Glass Title" text1="Content in here" title2="Glass Title 2" text2="Content 2 in here" /%}

---

### Three Glass Boxes

```markdown
{% axcora-glass-3 title1="Glass Title" text1="Content in here" title2="Glass Title 2" text2="Content 2 in here" title3="Glass Title 3" text3="Content 3 in here" /%}
```
**Output:**  
{% axcora-glass-3 title1="Glass Title" text1="Content in here" title2="Glass Title 2" text2="Content 2 in here" title3="Glass Title 3" text3="Content 3 in here" /%}

---

## 3. Glass Component Properties

| Property    | Type   | Description                                            |
|-------------|--------|--------------------------------------------------------|
| `title`     | string | The title displayed within the glass box (single glass)|
| `text`      | string | The content inside the glass box                       |
| `title1`    | string | Title for the first glass box (double/triple variant)  |
| `text1`     | string | Content for the first glass box                        |
| `title2`    | string | Title for the second glass box (double/triple variant) |
| `text2`     | string | Content for the second glass box                       |
| `title3`    | string | Title for the third glass box (triple variant)         |
| `text3`     | string | Content for the third glass box                        |

---

## 4. Glass Morphism CSS

The glass component uses the following CSS for the glassmorphism effect:

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
}
[data-theme="dark"] .glass {
  background: rgba(8, 24, 55, 0.45);
  border: 1px solid rgba(219, 225, 235, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}
```

- **Light mode:** Subtle frosted glass effect on any background.
- **Dark mode:** Deeper glass tone for clarity and legibility on dark backgrounds.

---

## 5. Best Practices

- **Contrast:** Use the glass component on colorful or image backgrounds for best effect.
- **Content:** Keep glass content concise—ideal for callouts, testimonials, or summaries.
- **Responsiveness:** The glass effect adapts smoothly to different layouts and themes.

---

## 6. Summary Table

| Variant             | Use Case                       | Properties                      |
|---------------------|-------------------------------|----------------------------------|
| `axcora-glass`      | Single glass block            | `title`, `text`                 |
| `axcora-glass-2`    | Two glass blocks side-by-side | `title1`, `text1`, `title2`, `text2` |
| `axcora-glass-3`    | Three glass blocks            | `title1`, `text1`, `title2`, `text2`, `title3`, `text3` |

---

The **Axcora Glass component** lets you present content with an attractive, modern glassmorphism effect—boosting visual impact wherever you need it, whether in articles or advanced templates.