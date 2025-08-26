---
title: "Site Data"
date: "2025-08-21"
tags: 
 - site data
 - variables data
category: "templating"
description: "site configuration variables"
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
You can access **site configuration variables** in your Axcora templates using the `site` object, which maps directly to the contents defined in `content/_data/site.yml`. The most common fields are shown below, along with their actual mapping from your configuration file:

```
{{ site.title }}          <!-- Outputs: "Axcora Framework" -->
{{ site.description }}    <!-- Outputs: "Modern static site generator with built-in CSS framework" -->
{{ site.url }}           <!-- Outputs: "http://localhost:3000" -->
{{ site.author }}        <!-- Outputs: "Axcora Team" -->
{{ site.logo }}          <!-- Outputs: "/img/logo.png" (logo image path) -->
{{ site.image }}         <!-- Outputs: "/img/axs.jpg" (default main image) -->
{{ site.favicon }}       <!-- Outputs: "/img/logo.jpg" (site favicon) -->
```

**How this works:**
- All keys specified in `content/_data/site.yml`—including single values (`title`, `description`, etc.), arrays (`tags`, `navbar`), and objects (`theme`, `blog`, `social`, etc.)—are made available as properties of the `site` object within your templates.
- You can use these variables anywhere in your templates to provide global site data, for example in headers, footers, navigation menus, SEO tags, or sharing metadata.

**Accessing navigation, social, and more:**
- For lists or nested objects, use iteration or dot notation:
  - Navigation menu:  
    ```
    {{#each site.navbar }}
      <li><a href="{{ url }}">{{ title }}</a></li>
    {{/each}}
    ```
  - Social links:  
    ```
    <a href="{{ site.social.twitter }}">Twitter</a>
    <a href="{{ site.social.github }}">GitHub</a>
    ```

**Best practices:**
- Reference site metadata using `site` variables for centralized updates.
- Use lists and objects to power dynamic menus, social bars, and footers.
- Every data key from your YAML file (including theme options, SEO, build settings, and more) is available under `site` for full access in templates.

This centralizes all your site-wide data, making global updates efficient and consistent across every template.