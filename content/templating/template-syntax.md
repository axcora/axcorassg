---
title: "Template Syntax"
date: "2025-08-23"
tags: 
 - template syntax
 - syntax
category: "templating"
description: "Template Syntax in Axcora"
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
    - codes
js:
  - navbar
  - theme
---
Axcora's template engine uses a straightforward, expressive syntax to output dynamic content into your `.axcora` template files. Leveraging Handlebars-inspired conventions, you can easily display variables, apply conditionals, and render lists.

---

### Basic Variable Output

To insert variables into your template, Axcora uses double curly braces:  
```
{{ variableName }}
```

#### Examples:
```
{{ title }}
{{ site.description }}
{{ author.name }}
```

You can also use variables with default/fallback logic, depending on your context.
```
{{ title }}       <!-- The post title -->
{{ excerpt }}     <!-- Excerpt or summary -->
{{ description }} <!-- Description of the content -->
```

---

### Example Templates

Let's see two real examples of `.axcora` templates making use of basic output, conditionals, and iterables.

---

#### Example 1: Listing Posts

```
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
<header class="hero container content-start mb-3">
  <div class="hero-content">
    <h1><a href="{{url}}" class="text-white text-decoration-none">{{ name }}</a></h1>
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
            <h2 class="card-title"><a href="{{ url }}">{{ title }}</a></h2>
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

Key Notes:
- **`{{ title }}`**, **`{{ description }}`**, **`{{ category }}`**: Output variables from the post object.
- **`{{#if ...}} ... {{/if}}`**: Only show content if the variable exists.
- **`{{#each posts}} ... {{/each}}`**: Loop through posts to render each one.

---

#### Example 2: Single Post Layout

```
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
<main class="container">
  <div class="card p-3 content-start p-3 mb-3">
    <header class="container text-center">
      {{#if title}}
        <h1 class="text-3xl"><strong><a href="{{url}}">{{ title }}</a></strong></h1>
      {{/if}}
      {{#if image}}
        {% axcora-image src="{{image or site.image}}" alt="{{title}}" /%}
      {{/if}}
      <div class="text-start bg-gradient-primary rounded-lg p-5 mb-3"> 
        {{#if description}}<h2 class="mb-3">{{description}}</h2>{{/if}}
        <p><time class="text-small">Publish On : {{ date | formatDate }}</time></p>
        {{#if tagsSlugged.length}}
          <p>
            {{#each tagsSlugged}}
              <a href="/tags/{{slug}}/" class="btn btn-info btn-sm me-1 mb-1">#{{name}}</a>
            {{/each}}
            {{#if category}}
              <a href="/categories/{{ categorySlug }}/" class="btn btn-sm btn-primary">{{ category }}</a>
            {{/if}}
          </p>
        {{/if}}
      </div>
    </header>
    <article class="container">
      {{ content }}
    </article>
    <div class="row p-3">
      <div class="col-6">
        {{#if prev}}
          <p class="text-muted mb-1">Previous Post</p>
          <a href="{{ prev.url }}" class="btn btn-primary">← {{ prev.title }}</a>
        {{/if}}
      </div>
      <div class="text-right col-6 px-4 py-4 text-end">
        {{#if next}}
          <p class="text-muted mb-1">Next Post</p>
          <a href="{{ next.url }}" class="btn btn-primary">{{ next.title }} →</a>
        {{/if}}
      </div>
    </div>
  </div>
</main>
```

Key Notes:
- **`{{ title }}`**, **`{{ description }}`**, **`{{ image }}`**: Output single post data.
- **`{{#if ...}}`**: Handle optional data (e.g., previous/next post, category, tags).
- **`{{ content }}`**: Displays rich post content (e.g., markdown body).

---

### Frontmatter Example

The frontmatter block at the top of your `.axcora` file defines variables that are accessible in your template:

```yaml
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
js:
  - navbar
  - theme
---
```

**What does this do?**
- All these properties (such as `title`, `description`, `category`, `tags`, etc.) are made available to your template as variables.
- The template engine will replace `{{ title }}`, `{{ description }}`, `{{ image }}`, etc. with their respective values defined here.
- Arrays (like `tags`) can be iterated, and objects (like `css` and `js`) help configure layout and functionality.

---

### How Variables Render in the Template

- If `title` is `"Axcora Templating"`, every `{{ title }}` in the template will be replaced with this string.
- If `description` is set, it will appear wherever `{{ description }}` is used.
- For images, using `{% axcora-image src="{{image or site.image}}" alt="{{title}}" /%}` will output an optimized image tag.
- For tag arrays, you can loop over them using `{{#each tags}} ... {{/each}}` and generate links/buttons per tag.

---

### Summary: Practical Usage

- **Basic Variable Output**: Use `{{ variableName }}` to embed any frontmatter or context variable into the template.
- **Conditionals with Fallbacks**: Wrap any section with `{{#if variable}} ... {{/if}}` so it only displays if the variable exists.
- **Listing & Iteration**: Use `{{#each array}} ... {{/each}}` to output items from an array.
- **Formatting/Helpers**: Use pipes for formatting, e.g. `{{ date | formatDate }}` or `{{ category | slugify }}`.
- **Component Tags**: Specialized output for images or custom content (e.g. `{% axcora-image ... %}`).

---

### Best Practices

- Define all variables you plan to use up front in your frontmatter block.
- Use `{{#if}}` statements to prevent empty fields or broken output when optional data is missing.
- Iterate arrays for dynamic listings (posts, tags, categories).
- Rely on filters and custom helpers for formatting and transformation.
- Organize your templates with layouts and components for better reusability.

---

**In summary:**  
The basic variable output feature of Axcora makes it easy to transform your data into dynamic, well-structured HTML using the Handlebars-like syntax. Combine variable output, iteration, helpers, and frontmatter for powerful, maintainable templates.

---

*This documentation provides you with the essentials of Axcora’s basic template syntax. For more advanced functionality, explore components, plugins, and custom helpers as your project evolves!*
