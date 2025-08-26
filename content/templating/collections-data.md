---
title: "Collections Data"
date: "2025-08-19"
tags: 
 - collections data
 - collections
category: "templating"
description: "Axcora automatically organizes your structured content"
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
#### Collections Data in Axcora Templates

Axcora automatically organizes your structured content into **collections**. These collections make it easy to display lists or grouped content—such as all blog posts, all pages, tags, and categories—anywhere in your templates.

**How to Access Collections:**

```
{{ collections.blog }}        <!-- Array of all blog post objects -->
{{ collections.pages }}       <!-- Array of all static page objects -->
{{ collections.tags }}        <!-- Tags object (maps tag name → array of posts) -->
{{ collections.categories }}  <!-- Categories object (maps category name → array of posts) -->
{{ collections.recent }}      <!-- Array of most recent posts -->
```

**Usage Examples:**

- **Loop through all blog posts:**
  ```html
  {{#each collections.blog}}
    <article>
      <h2><a href="{{ url }}">{{ title }}</a></h2>
      <p>{{ description }}</p>
    </article>
  {{/each}}
  ```

- **List all tags:**
  ```html
  <ul>
    {{#each collections.tags}}
      <li>
        <a href="/tags/{{ @key | slugify }}/">{{ @key }} ({{ this.length }})</a>
      </li>
    {{/each}}
  </ul>
  ```
  *Here, `@key` is the tag name, and `this` is an array of posts for the tag.*

- **Display recent posts:**
  ```html
  <aside>
    <h3>Recent Posts</h3>
    <ul>
      {{#each collections.recent}}
        <li><a href="{{ url }}">{{ title }}</a></li>
      {{/each}}
    </ul>
  </aside>
  ```

**Best Practices:**
- Use **collections** to build dynamic navigation, tag/category pages, post listings, and sitemaps.
- Collections are automatically kept up-to-date—all new content is instantly accessible in these arrays/objects.

**Tip:**  
You can filter or sort within a collection in your templates, or use helper filters for things like recent or featured posts.

This structured approach allows you to build flexible, scalable navigation and landing pages across your Axcora-powered site!