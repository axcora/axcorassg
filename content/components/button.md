---
title: "Button"
date: "2025-08-21"
tags: 
 - button
 - button axcora
 - button components
category: "components"
description: "How to use button component"
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
js:
  - navbar
  - theme
---
The **Button component** in Axcora SSG provides a versatile and customizable way to add interactive elements for navigation and user actions throughout your site. This component supports a variety of styles and behaviors, and can be used both within your templates and your article content.

## Usage in Templates

To use button components **per template**, import the component within your template’s front-matter. For example, in `templates/blog/single.axcora` or `templates/blog/list.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - button
---
<main class="container">{{content}}</main>
```

Once imported, the button is available for both Markdown articles and direct template implementation.

## Implementation Example

To insert a button using the Axcora syntax:

```text
{% axcora-button text="Click Me" href="/" color="primary" /%}
```

output:
{% axcora-button text="Click Me" href="#" color="primary" /%}

This will render a clickable button labeled "Click Me" styled with the primary color theme, and link to your homepage.

## Usage in Content

You can also utilize the Button component within Markdown article content by importing all required components in the template, then using the same tag syntax within your content. This allows for interactive elements, such as calls to action, to be embedded in posts and pages.

## Component Attributes

- **text**: The visible label for the button (required).
- **href**: The URL to navigate to when the button is clicked (optional; for link buttons).
- **color**: Defines the color variant (e.g., `primary`, `secondary`, `success`, `danger`, `info`, `warning`, `light`, `dark`, `outline-*`, `ghost`).
- **size**: Sets the button size (`sm`, `lg`, `xl` are supported; optional).
- **block**: Applies `.btn-block` for full-width buttons (optional).

## CSS Styling

The Button component supports **solid**, **outline**, and **ghost** styles, each with color and hover variants, as well as responsive and accessible design practices. Examples include:

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition-normal);
  border: none;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: var(--p500);
  color: white;
}
.btn-primary:hover {
  background-color: var(--p600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-outline-primary {
  color: var(--p500);
  border: 2px solid var(--p300);
  background-color: inherit;
}
.btn-outline-primary:hover {
  background-color: var(--p500);
  color: white;
}

.btn-sm { font-size: 0.75rem; padding: calc(var(--spacing-xs) * 0.8) var(--spacing-sm); }
.btn-lg { font-size: 1.125rem; padding: var(--spacing-sm) var(--spacing-lg); }
.btn-xl { font-size: 1.25rem; padding: var(--spacing-md) var(--spacing-xl); }

@media (max-width: 767px) {
  .btn-block { display: block; width: 100%; }
}
```

## Supported Variants

- **Solid**: `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`, `.btn-info`, `.btn-warning`, `.btn-light`, `.btn-dark`
- **Outline**: `.btn-outline-primary`, `.btn-outline-secondary`, `.btn-outline-success`, `.btn-outline-danger`, `.btn-outline-info`, `.btn-outline-warning`
- **Ghost**: `.btn-ghost`
- **Sizes**: `.btn-sm`, `.btn-lg`, `.btn-xl`
- **Block/Full-width**: `.btn-block` for mobile-responsive stacking

## Accessibility & Best Practices

- **Accessible labels**: The `text` property is always visible for clarity and screen readers.
- **Keyboard support**: Button elements and link buttons are navigable by keyboard by default.
- **Semantic elements**: Buttons act as either `<button>` or `<a>` depending on presence of `href`, ensuring proper behavior for both forms and navigation[2].

## Properties Table

| Property   | Type    | Description                                |
|------------|---------|--------------------------------------------|
| `text`     | string  | Button label (required)                    |
| `href`     | string  | URL for navigation (optional)              |
| `color`    | string  | Color theme or outline variant (optional)  |
| `size`     | string  | `sm`, `lg`, or `xl` size variants          |
| `block`    | boolean | Full-width, responsive button (optional)   |

The Button component in **Axcora SSG** offers a highly customizable, visually consistent, and accessible solution for interactive elements in both templates and content, supporting a full range of modern web design patterns.
