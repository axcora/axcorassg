---
title: "Blockquote"
date: "2025-08-22"
tags: 
 - blockquote
 - blockquote axcora
 - blockquote components
category: "components"
description: "How to use blockquote component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - blockquote
    - hero
    - breadcrumb
    - pagination
    - image
    - cards
js:
  - navbar
  - theme
---
The **Blockquote component** in Axcora SSG provides a visually appealing way to display quotations, statements, or testimonials, allowing emphasis and proper attribution for quoted material within both templates and article content.

**installation**

```
npm i axcora-blockquote
```

## Usage in Templates

Axcora SSG allows blockquote components to be imported **per-template** for consistent styling across pages. To use the blockquote, include it in your template's front-matter (for example, in `templates/blog/single.axcora` or `templates/blog/list.axcora`):

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - blockquote
---
<main class="container">{{content}}</main>
```

After importing, the blockquote component can be used in both Markdown content and template files.

## Implementation Example

Add a blockquote using Axcora's templating syntax:

```
{% axcora-blockquote text="The greatest glory in living lies not in never falling, but in rising every time we fall" footer="Nelson Mandela" /%}
```

output: 
{% axcora-blockquote text="The greatest glory in living lies not in never falling, but in rising every time we fall" footer="Nelson Mandela" /%}

This renders the quote styled with a highlighted background and an attributed footer.

## Usage in Content

You may also use the blockquote component within **article content** by including the appropriate tag in your Markdown file, provided your template imports the component. This is useful for emphasizing important statements, user testimonials, references, or citations.

## Component Attributes

- **text**: The main quoted statement (required).
- **footer**: Citation or attribution for the quote (optional but recommended for clarity).

## CSS Styling

The Blockquote component features modern styling for strong visibility:

```css
.blockquote {
  position: relative;
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: 1.25rem;
  font-style: italic;
  background: linear-gradient(135deg, var(--i50), var(--p100), var(--p200));
  border-left: 4px solid var(--p500);
  border-radius: var(--radius-lg);
  color: var(--p700);
}
.blockquote::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: var(--spacing-md);
  font-size: 4rem;
  color: var(--p600);
  font-family: Georgia, serif;
}
.blockquote-footer {
  margin-top: var(--spacing-md);
  font-size: 0.875rem;
  color: var(--text-muted);
}
.blockquote-footer::before {
  content: '— ';
}
[data-theme="dark"] .blockquote {
  background: linear-gradient(135deg, var(--i300),var(--p500), var(--p700));
  color: var(--s900);
  border-color: var(--p400);
}
[data-theme="dark"] .blockquote::before {
  color: var(--w800);
}
```

This styling ensures the blockquote stands out, with a vertical accent line, decorative opening quote, and a muted tone for citations.

## Best Practices

- **Keep Quotes Concise:** Short, meaningful excerpts maximize visual impact.
- **Attribute Sources:** Use the `footer` property for context and credibility.
- **Consistent Use Across Sections:** Utilize blockquotes for testimonials, references, or citations to maintain a professional look.

## Accessibility

The blockquote uses semantic markup and clear text, suitable for screen readers and accessible design. Ensure all information in the visual styling is also available in text.

## Properties Table

| Property  | Type     | Description                            |
|-----------|----------|----------------------------------------|
| `text`    | string   | Quoted content (required)              |
| `footer`  | string   | Source/citation for the quote (optional)|

The Blockquote component in **Axcora SSG** helps you highlight important quotes and statements in a visually engaging, accessible, and customizable format.