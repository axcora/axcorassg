---
title: "Axcora Loop"
date: "2025-08-17"
tags: 
 - loop axcora templating
 - axcora loop
category: "templating"
description: "How to use loop in Axcora Templating"
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
### Loops in Axcora Templates

Axcora uses the Handlebars-style `each` block to iterate over arrays or objects—making it simple to render dynamic lists, grids, menus, and more. You can also use special variables inside loops and even loop over nested arrays for complex structures.

---

#### Basic Each Loop

Iterate over arrays, such as posts, tags, or any list:

```
{{#each posts}}
  <article>
    <h2><a href="{{ url }}">{{ title }}</a></h2>
    <time>{{ date | formatDate }}</time>
    <p>{{ excerpt }}</p>
  </article>
{{/each}}
```
- The block will repeat its content for every item in the `posts` array.
- Inside each loop, variables reference _that item_ (e.g., individual post data).

---

#### Loop Variables

Inside an `each` block, you can access metadata about the current item’s position:

```
{{#each items}}
  <div class="item {{#if isFirst}}first{{/if}} {{#if isLast}}last{{/if}}">
    <span class="index">{{ index }}</span>
    <h3>{{ title }}</h3>
  </div>
{{/each}}
```
- `index`: The zero-based index of the current item in the list.
- `isFirst`, `isLast`: Boolean indicators for the first/last item (if supported).

---

#### Nested Loops

Loop inside another loop—for example, showing posts grouped by category:

```
{{#each categories}}
  <div class="category">
    <h3>{{ @key }}</h3>
    {{#each this}}
      <article>
        <h4><a href="{{ url }}">{{ title }}</a></h4>
      </article>
    {{/each}}
  </div>
{{/each}}
```
- Outer loop iterates over each category key (e.g., "News", "Tutorials").
- Inner loop (`each this`) iterates over the posts in that category.
- `@key` gives you the current key in the parent object (i.e., the category name).

---

**Best Practices:**
- Use `each` for any array or object you need to display as a group or list.
- Take advantage of index and conditionals inside loops for styling or structure.
- Nest loops carefully for grouped/granular data, but avoid deeply nesting for readability.

**Tip:**  
Combined with filters and conditionals, loops make your templates flexible and powerful. Use them to build blog lists, tag/category pages, custom menus, and more!