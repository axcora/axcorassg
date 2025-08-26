---
title: "Hero"
date: "2025-08-16"
tags: 
 - hero
 - hero axcora
 - hero components
category: "components"
description: "How to use hero component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - hero
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
The **Hero component** in Axcora SSG provides a flexible, visually prominent section for highlighting key messages, calls-to-action, or feature introductions. You can use hero components in templates as well as Markdown article content, making it ideal for headlines, landing pages, or any content that benefits from strong first impressions.

---

## 1. Enabling the Hero Component

To enable the hero component in a template, import it in your template’s front-matter, such as in `templates/blog/single.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - hero
---
<main>{{content}}</main>
```

Once imported, hero sections become available in both Markdown and template files.

---

## 2. Usage Examples

### Simple Hero

```markdown
{% axcora-hero title="Title" text="Content in here" /%}
```
**Output:**  
{% axcora-hero title="Title" text="Content in here" /%}

---

### Hero with Buttons

```markdown
{% axcora-hero-button title="Hero with button Title" text="Content Hero with button in here" button1="Get Started" button1_color="primary" button1_url="/start" button2="Learn More" button2_color="warning" button2_url="/learn" /%}
```
**Output:**  
{% axcora-hero-button title="Hero with button Title" text="Content Hero with button in here" button1="Get Started" button1_color="primary" button1_url="/start" button2="Learn More" button2_color="warning" button2_url="/learn" /%}

---

## 3. Properties

| Property          | Type   | Description                                                                  |
|-------------------|--------|------------------------------------------------------------------------------|
| `title`           | string | The main heading displayed prominently in the hero section                   |
| `text`            | string | Supplemental text or description beneath the hero title                      |
| `button1`         | string | First button label (for button variant)                                      |
| `button1_color`   | string | Color theme for the first button (e.g., `primary`, `warning`)                |
| `button1_url`     | string | Link for the first button                                                    |
| `button2`         | string | Second button label (optional, for button variant)                           |
| `button2_color`   | string | Color theme for the second button                                            |
| `button2_url`     | string | Link for the second button                                                   |

---

## 4. CSS Styling

The hero component uses a modern, gradient background with responsive, centered content:

```css
.hero {
  position: relative;
  padding: calc(var(--spacing-2xl) * 2) var(--spacing-xl);
  background: linear-gradient(135deg, var(--i300), var(--p500), var(--p700));
  color: white;
  text-align: center;
  border-radius: var(--radius-2xl);
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0.3;
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}
.hero h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.hero p {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  margin-bottom: var(--spacing-xl);
  opacity: 0.95;
}
.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-top: var(--spacing-xl);
}
```

- Responsive layout ensures hero sections look good on any device.
- Supports clear, legible text and flexible layouts for both minimalist and action-driven hero areas.

---

## 5. Best Practices

- **Keep titles concise** and expressive for maximum impact.
- **Pair with call-to-action buttons** to drive user engagement, such as “Get Started” or “Learn More.”
- **Avoid clutter**: Use the hero area for your most important message or actions.
- **Test across devices** to ensure your hero section remains visually prominent and accessible.

---

## 6. Summary Table

| Variant             | Purpose                              | Supported Features                  |
|---------------------|--------------------------------------|-------------------------------------|
| `axcora-hero`       | Simple hero section                  | Title, text                         |
| `axcora-hero-button`| Hero with up to 2 action buttons     | Title, text, buttons (labels, links, colors) |

---

The **Axcora Hero component** is designed to put your brand or message front-and-center with modern design and easy configurability, making it a strong foundation for landing pages, headers, or promotional content.