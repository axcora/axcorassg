---
title: "Layouts"
date: "2025-08-15"
tags: 
 - axcora templates
 - axcora layouts
category: "templating"
description: "How to layouting in Axcora Templating"
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

### Layouts in Axcora Templates

Axcora uses **layouts** to help you structure and reuse your site’s design across multiple pages. Layouts are master templates—such as base, post, or page layouts—which inject your content at the right spot, and can include headers, footers, navigation, or any other repeated elements.

---

#### Using Layouts

Declare which layout to use in your template’s frontmatter (`layouts` key).  
Example:

```yaml
---
layouts: base
title: "My Page"
---
<h1>{{ title }}</h1>
<p>This content will be inserted into the layout.</p>
```

- The file’s markup will be placed into the chosen layout at the special spot: `{{ content }}`.

---

#### Layout File Example

A layout lives in `src/templates/layouts/` and includes your site’s global structure. For instance, `base.axcora`:

```
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }} | {{ site.title }}</title>
  <meta name="description" content="{{ description or site.description }}">
</head>
<body>
  {% include header.axcora %}
  
  <main>
    {{ content }}  <!-- Page or post content is inserted here -->
  </main>
  
  {% include footer.axcora %}
</body>
</html>
```
- `{{ title }}`, `{{ description }}`, and other variables refer to page/post/frontmatter/context data.
- `{% include ... %}` brings in partials, making your layout modular.

---

#### Layout Hierarchy

You can nest or extend layouts for more advanced designs.

**Base Layout**

A root layout that other layouts or pages can extend:
```
<!-- base.axcora -->
<!DOCTYPE html>
<html>
<body>
  {{ content }}
</body>
</html>
```

**Post Layout**

A specific layout for blog posts, which itself extends the base layout:
```
<!-- post.axcora -->
---
layouts: base  
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - hero
    - pagination
    - image
js:
  - navbar
  - theme
---
<article class="blog-post">
  <h1>{{ title }}</h1>
  <time>{{ date | formatDate }}</time>
  {{ content }}
</article>
```
- The `layouts: base` declaration in the post layout means its content will be placed inside the base layout’s `{{ content }}` location.

---

### How It Works

- A page or post declares its layout (`layouts: base` or `layouts: post`).
- The template engine places that page’s content into the corresponding layout.
- Layouts can themselves inherit from other layouts, allowing you to build hierarchical, consistent site structures.

---

**Best Practices:**
- Use a primary base layout for overall structure.
- Create specialized layouts (for posts, pages, categories) that extend your base.
- Keep layouts clean and focused; use includes for headers, footers, and navigation.

**Layouts give your site a unified look, reduce repetition, and make structural changes easy—just update the layout file, and every page using it will instantly follow!**
