---
title: "ScrollSpy"
date: "2025-08-12"
tags: 
 - scrollspy
 - scrollspy axcora
 - scrollspy components
category: "components"
description: "How to use scrollspy component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - image
    - scrollspy
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
  - scrollspy
---

The **Scrollspy component** in Axcora SSG provides dynamic navigation tracking that highlights which section of the page is currently being viewed by the user. It is designed to improve user experience for long-form articles, documentation, and landing pages by giving a clear visual indication of the active section[4][5].

**installation**

```bash
npm i axcora-scrollspy
```

---

## Features

- **Automatic navigation highlighting**: Navigation links are updated based on scroll position.
- **Integration flexibility**: Usable both at the template and content level within Axcora SSG.
- **Customizable design**: Easily adapted styling and behavior with CSS variables.
- **Accessible navigation structure**: Uses semantic HTML for improved accessibility and SEO.

---

## Usage in Axcora SSG

Axcora SSG supports Scrollspy components with two main approaches:
- **Template-based usage**: Import the Scrollspy component directly into your template. This is recommended when you want Scrollspy available across multiple articles or page layouts.
- **Content-based usage**: Import the component for individual articles or content blocks. This is useful when Scrollspy is only needed in specific articles.

---

### Template-based Integration

To enable Scrollspy in a template (for example, `templates/blog/single.axcora`):

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - scrollspy
js: 
  - scrollspy
---
<main>{{content}}</main>
```

- Add the component under the `css.components` and `js` sections in your template frontmatter.
- Once imported, the Scrollspy component will be available to your markdown content and template HTML.

---

### Content-based Implementation

After importing the component in the template, you can integrate Scrollspy directly within markdown or templating syntax:

Simple 3 Scrollspy Section

```markdown
{% axcora-scrollspy section1="intro" title1="Introduction" text1_1="Welcome to the article." section2="features" title2="Features" text2_1="Feature one highlights the basics." section3="usage" title3="Usage" text3_1="Step-by-step setup." /%}
```

Complete 5 Scrollspy Section

```markdown
{% axcora-scrollspy section1="intro" title1="Introduction" text1_1="Welcome to the article." text1_2="This is a brief overview." text1_3="Scroll to learn more." section2="features" title2="Features" text2_1="Feature one highlights the basics." text2_2="Feature two improves usability." text2_3="Feature three ensures accessibility." section3="usage" title3="Usage" text3_1="Step-by-step setup." text3_2="Template integration." text3_3="Content-based implementation." section4="faq" title4="FAQ" text4_1="Troubleshooting tips." text4_2="Customization options." text4_3="Support resources." /%}
```

This syntax defines scrollable sections and their content, which are rendered with navigation dots and labels. The component outputs a scrollspy navigation and linked content sections.

**Component Output Example:**

```markdown
{% axcora-scrollspy /%}
```

This will display the scrollspy navigation and sections as specified above.

---

## How Scrollspy Works

- The navigation is composed of anchor (`<a>`) elements linked to section IDs within the page.
- As the user scrolls, the component detects which section is in view and applies the `active` class to the corresponding navigation anchor.
- CSS effects visually highlight the active link, improving the navigation experience.
- All navigation anchors use the `data-label` attribute for accessible tooltips, and the component adapts to both light and dark themes.

---

## Accessibility & Responsiveness

- The navigation is fixed and vertical on larger screens, but **automatically hidden on mobile** (width < 768px).
- Keyboard navigation and ARIA attributes are recommended for further accessibility improvements.

---

## Notes

- For custom themes, ensure that you define required CSS variables such as `--spacing-lg`, `--p400`, and `--s300`.
- The Scrollspy component requires section IDs in the content to correspond to each navigation link.
- Integration examples are adaptable to both markdown and direct template HTML for maximum flexibility.

---

By using the Axcora Scrollspy component, your articles and templates gain a modern interactive navigation that enhances comprehension and user experience—whether implemented at the template or the content level.
