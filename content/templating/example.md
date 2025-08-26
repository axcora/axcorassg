---
title: "Example"
date: "2025-08-14"
tags: 
 - axcora example
 - example axcora templating
category: "templating"
description: "Complete Exmaple Axcora Templating"
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
### Examples

Axcora SSG allows you to choose themes and inject CSS/JS into each of your templates. On build, it automatically minifies only the CSS and JS required for each page, making your site fast and lightweight.

---

#### 1. Blog Post Template

Define layouts, CSS theme, and JS per post in the frontmatter. Easily display variables and relationships:

```
---
layouts: base
css:
  theme: 'brutal'
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
  <header>
    <h1>{{ title }}</h1>
    
    <div class="post-meta">
      <time datetime="{{ date }}">{{ date | formatDate }}</time>
      
      {{#if category}}
        <span class="category">
          <a href="/categories/{{ category }}/">{{ category }}</a>
        </span>
      {{/if}}
      
      {{#if tags.length}}
        <div class="tags">
          {{#each tags}}
            <a href="/tags/{{ this }}/" class="tag">#{{ this }}</a>
          {{/each}}
        </div>
      {{/if}}
    </div>
  </header>

  <div class="post-content">
    {{ content }}
  </div>

  <footer class="post-footer">
    {{#if prev}}
      <a href="{{ prev.url }}" class="prev-post">← {{ prev.title }}</a>
    {{/if}}
    
    {{#if next}}
      <a href="{{ next.url }}" class="next-post">{{ next.title }} →</a>
    {{/if}}
  </footer>
</article>
```

---

#### 2. Homepage Template

Bring in components, load CSS & JS, and iterate posts for a dynamic landing page:

```
---
layouts: base
title: "Plugin"
date: "2025-08-15"
tags: 
 - axcora plugins
 - plugin syntax
category: "templating"
description: "How to use Plugin Syntax in Axcora Templating"
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

{% include hero.axcora %}

<section class="featured-posts">
  <h2>Latest Posts</h2>
  
  {{#if posts.length}}
    <div class="posts-grid">
      {{#each posts}}
        <article class="post-card">
          {{#if featured_image}}
            {% axcora-image 
              src="{{ featured_image }}" 
              alt="{{ title }}"
              class="post-thumbnail"
            %}
          {{/if}}
          <div class="post-content">
            <h3><a href="{{ url }}">{{ title }}</a></h3>
            <p>{{ excerpt }}</p>
            <div class="post-meta">
              <time>{{ date | formatDate }}</time>
              {{#if category}}
                <span class="category">{{ category }}</span>
              {{/if}}
            </div>
          </div>
        </article>
      {{/each}}
    </div>
    <div class="view-all">
      <a href="/blog/" class="btn">View All Posts →</a>
    </div>
  {{else}}
    <p>No posts available yet.</p>
  {{/if}}
</section>
```

---

#### 3. Navigation Include

Reusable partial for site-wide navigation, using site-wide data and conditionals:

```
<!-- src/templates/includes/navigation.axcora -->
<nav class="site-navigation">
  <div class="nav-brand">
    <a href="/">
      {{#if site.logo_image}}
        {% axcora-image 
          src="{{ site.logo_image }}" 
          alt="{{ site.title }}"
          width="40" 
          height="40"
          eager="true"
        %}
      {{else}}
        {{ site.title }}
      {{/if}}
    </a>
  </div>
  <ul class="nav-links">
    {{#each site.navbar}}
      <li>
        <a href="{{ url }}"{{#if url === page.url}} class="active"{{/if}}>
          {{ title }}
        </a>
      </li>
    {{/each}}
  </ul>
  {{#if site.search.enabled}}
    <div class="search-box">
      <input type="text" placeholder="{{ site.search.placeholder }}">
    </div>
  {{/if}}
</nav>
```

---

### Advanced Features

1. **Dynamic Classes**

Add conditional classes for highlighted or featured content:

```
<article class="post {{#if featured}}featured{{/if}} {{#if isFirst}}first{{/if}}">
  <!-- content -->
</article>
```

2. **Complex Data Access**

Iterate and conditionally filter blog post collections for category-specific features:

```
<!-- Access nested collection data -->
{{#each collections.blog}}
  {{#if this.category === "tutorial"}}
    <div class="tutorial-post">{{ title }}</div>
  {{/if}}
{{/each}}
```

---

**With these examples, you can build dynamic, fast, and efficient websites using Axcora’s flexible templating system—tailoring each page with the exact CSS, JS, and components you need.**
