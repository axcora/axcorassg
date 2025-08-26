---
title: "Axcora Filter"
date: "2025-08-17"
tags: 
 - conditional axcora templating
 - axcora conditionals
category: "templating"
description: "How to use conditionals in Axcora Templating"
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
### Conditionals in Axcora Templates

Axcora provides flexible conditional helpers—much like Handlebars—to control template logic. This lets you show, hide, or structure your content dynamically based on variable values, booleans, and expressions.

---

#### If Statements

Display a block only if a condition is **true** or a value exists:

```
{{#if title}}
  <h1>{{ title }}</h1>
{{/if}}

{{#if site.logo_image}}
  <img src="{{ site.logo_image }}" alt="{{ site.title }}">
{{else}}
  <h1>{{ site.title }}</h1>
{{/if}}
```
- The `{{#if ...}} ... {{/if}}` block checks if a value exists or evaluates to true.
- Add an `{{else}}` branch for fallback content.

---

#### Unless Statements

Render content only if a condition is **false** (the inverse of `if`):

```
{{#unless user.isGuest}}
  <p>Welcome back, {{ user.name }}!</p>
{{/unless}}
```
- `{{#unless ...}}` is handy for access control (authenticated users, feature toggles, etc).

---

#### Complex Conditions

You can build more complex checks, including:
- Evaluating array length
- Checking for specific values

```
<!-- Check if an array has items -->
{{#if tags.length}}
  <div class="tags">
    {{#each tags}}
      <span class="tag">{{ this }}</span>
    {{/each}}
  </div>
{{/if}}

<!-- Check for specific string values -->
{{#if layout === "post"}}
  <article class="blog-post">{{ content }}</article>
{{/if}}
```

- Use `.length` to check if an array (like `tags`) has data before rendering output.
- Use equality checks (`===`) for matching values, though in most contexts you can simply check the existence or value directly.

---

#### Advance

Example
```
{{#each collections.blog}}
  {{#if this.category === "tutorial"}}
    <div class="tutorial-post">{{ title }}</div>
  {{/if}}
{{/each}}

<article class="post {{#if featured}}featured{{/if}} {{#if isFirst}}first{{/if}}">
  <!-- content -->
</article>
```

**Best Practices:**
- Use `if` for required or optional variables.
- Use `unless` for exclusions or inverse logic.
- Keep conditions simple and clean—avoid deeply nested logic for maintainability.

Conditionals let you show the right content at the right time, making your templates dynamic and relevant for every page context.
