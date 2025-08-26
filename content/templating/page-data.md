---
title: "Page Data"
date: "2025-08-20"
tags: 
 - page data
 - axcora page data
category: "templating"
description: "Data from its frontmatter is made available as local template variables."
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
#### Page Data in Axcora Templates

When rendering a page or post in Axcora, data from its frontmatter is made available as local template variables. These provide all the context and content needed to generate each page dynamically.

**Common Page/Post Variables:**
```
{{ title }}         <!-- The page/post title -->
{{ description }}   <!-- Brief description or summary -->
{{ date }}          <!-- Publication date (supports filtering/formatting) -->
{{ url }}           <!-- The page or post's canonical URL -->
{{ content }}       <!-- Main content body (usually rendered from Markdown) -->
{{ excerpt }}       <!-- A short excerpt or summary (if available) -->
{{ tags }}          <!-- Array of assigned tags -->
{{ category }}      <!-- Category assigned to the post -->
```

**How it works:**
- Every variable defined in the frontmatter block (at the top of the `.axcora`, `.md`, or `.yml` file) is available for use in that template.
- Arrays (such as `tags`) can be iterated for tag clouds or lists.
- Metadata like `date`, `category`, and `excerpt` are useful for navigation and previews.
- The `content` variable represents the fully processed, rich body of the page or post.

**Example Usage in Template:**
```html
<article class="post">
  <h1>{{ title }}</h1>
  <p>{{ description }}</p>
  <p><time>{{ date | formatDate }}</time></p>
  <div>{{{ content }}}</div>
  <div class="tags">
    {{#each tags}}
      <a href="/tags/{{ this | slugify }}/">{{ this }}</a>
    {{/each}}
  </div>
</article>
```

**Best Practices:**
- Use `{{ title }}` and `{{ description }}` in headers for SEO and accessibility.
- Render `{{ content }}` with triple braces (`{{{ content }}}`) for trusted HTML output.
- Display tags and categories for navigation and discovery.

These variables help you create dynamic, data-rich templates for every page and post using Axcora.