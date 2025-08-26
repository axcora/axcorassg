---
title: "Axcora Templating"
date: "2025-08-24"
tags: 
 - about axcora templating
 - axcora templating
category: "templating"
description: "About Axcora Templating"
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

## 🎨 Axcora Templating Guide: Per Post Documentation

Axcora uses a modern templating system based on `.axcora` files. Its syntax combines the simplicity of [Handlebars](https://handlebarsjs.com/) with advanced features like filters, plugins, and custom components. This guide describes how to use the Axcora template syntax for rendering a dynamic list of posts (Per Post).

---

### Basic Structure: Front Matter

Each `.axcora` file begins with a **front matter block** in YAML format. This sets up the layout and the UI components:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - badge
    - hero
    - breadcrumb
    - pagination
    - cards
---
```
- **layouts**: Specifies the base layout template.
- **css.theme**: Selects your theme.
- **css.components**: Lists UI components to include (e.g., navbar, hero, cards).

---

### Data Interpolation

Axcora adopts Handlebars-style syntax for data rendering:
- **`{{ ... }}`**: Renders variable values.
- **`{{#if ...}} ... {{/if}}`**: Conditional blocks.
- **`{{#each ...}} ... {{/each}}`**: Iterates over a list/array.
- **Pipes**: Modify or filter data using `|` (e.g., `{{ date | formatDate }}`).

#### Example Interpolation

```html
<a href="{{url}}">{{ name }}</a>
<p>{{ description }}</p>
<time>{{ date | formatDate }}</time>
```

---

### Logic and Iteration

#### 1. **Listing Posts**
Use the `{{#each posts}} ... {{/each}}` block to loop through all items in the `posts` array:

```html
{{#each posts}}
  <div class="col-md-6 col-lg-4 mb-4">
    <article class="card p-1">
      <!-- ... each post's content ... -->
    </article>
  </div>
{{/each}}
```

#### 2. **Conditional Blocks**
Render certain template parts only if data exists, using `{{#if ...}}`:

```html
{{#if category}}
  <span>
    <a href="/categories/{{ category | slugify }}/">{{ category }}</a>
  </span>
{{/if}}
```

#### 3. **Filters & Helpers**
- **`| formatDate`**: Formats a date string.
- **`| slugify`**: Converts text to a URL-friendly slug.
- **`| joinTags`**: Joins a tag array into clickable HTML links.

---

### Special Components

Use custom tags for features like optimized images:

```html
{% axcora-image src="{{image or site.image}}" alt="{{title}}" /%}
```
- **axcora-image** will be rendered as an optimized `<img>` element as specified by the template engine.

---

### Full "Per Post" Template Example

```html
<header class="hero container content-start mb-3">
  <div class="hero-content">
    <h1>
      <a href="{{url}}" class="text-white text-decoration-none">{{ name }}</a>
    </h1>
    <p class="lead text-muted">{{ description }}</p>
  </div>
</header>

<div class="container">
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb breadcrumb-modern p-3">
      <li class="breadcrumb-item"><a href="{{site.url}}">Home</a></li>
      <li class="breadcrumb-item active" aria-current="page">{{name}}</li>
    </ol>
  </nav>
</div>

<main class="container mt-3">
  <div class="row">  
    {{#each posts}}
      <div class="col-md-6 col-lg-4 mb-4">
        <article class="card p-1">
          {{#if category}}
            <span class="ms-2">
              <a href="/categories/{{ category | slugify }}/" class="btn btn-sm btn-info rounded-full mt-2">{{ category }}</a>
            </span>
          {{/if}}
          {{#if image}}
            <a href="{{url}}">{% axcora-image src="{{image or site.image}}" alt="{{title}}" /%}</a>
          {{/if}}
          <div class="card-body">
            <h2 class="card-title">
              <a href="{{ url }}">{{ title }}</a>
            </h2>
            <div class="card-meta mb-2">
              <time class="text-muted text-small">{{ date | formatDate }}</time>
            </div>
            <p class="card-text">{{ description }}</p>
            {{#if tags.length}}
              <div class="tags mb-2">
                <div class="d-flex mt-1 mb-2">{{ tags | joinTags }}</div>
              </div>
            {{/if}}
          </div>
          <a href="{{ url }}" class="btn btn-primary full">Read {{ title }} →</a>
        </article>
      </div>
    {{/each}}
  </div>
</main>
```

---

### Best Practices

- Use **iteration blocks** to display dynamic lists.
- Use **filters** to format data for readability and URL compatibility.
- Separate reusable components and logic into their own partial files for efficiency.

---

### Note

The Axcora template syntax is compatible with Handlebars conventions, but extends them with filters, special components, and CSS plugins for enhanced flexibility. Always ensure that your template is provided with the correct data context, such as an array of `posts`.

---

**This documentation gives you the essentials for designing per-post lists in Axcora templates. For advanced use, combine plugins, custom helpers, and layout variations as needed!**
