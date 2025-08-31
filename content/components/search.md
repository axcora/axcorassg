---
title: "Search"
date: "2025-08-11"
tags: 
 - search
 - search axcora
 - search components
category: "components"
description: "How to use search component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - search
    - navbar
    - image
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
  - search
---
Certainly. Here is a technical documentation article for the **Axcora SSG Search Component**, in clear and structured English.

**installation**

```bash
npm i axcora-search
```

---
The **Axcora SSG** (Static Site Generator) provides a flexible component system to enhance your website with interactive features, such as the `search` component. This system allows you to use components both at the template level (site-wide) and within individual content (per-article), offering granular control over your site's features.

---

## 1. Component Usage Patterns

### a. **Template-level Import**

Template-level usage means you load and configure the component directly in your site or layout files (e.g., for blog posts or pages). Once imported, the component is available for use throughout the rendered content or markdown files processed by that template.

**Example: Enabling the Search Component in a Blog Post Template**

Suppose you are editing the file `templates/blog/single.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - search
js:
  - search
---
<main>{{content}}</main>
```

- Under the `components` list, add `search` to ensure the necessary search styles are included.
- Under `js`, include `search` so the interactive logic is loaded.

**Result:**  
Once this is set, the `search` component (and any other specified components) is available to be used anywhere in content or templates associated with this layout.

---

### b. **Content-level Usage**

If you want to use the `search` component within a specific article/content file (markdown or rich content), you can do so as long as the relevant template imports the required components.  
**Tip:** If you expect several different articles to use various components, it is best to import all needed components in your theme or base template.

---

## 2. Using the Search Component

Once you've imported the search component as above, you can instantiate it either directly in templates or within markdown article content using the designated shortcode:

```markdown
{% axcora-search /%}
```

ouptut
{% axcora-search /%}

**The component will be rendered in the output HTML wherever the shortcode appears.**  
For example, inside a markdown article or as part of a post template, simply insert the shortcode to display the search widget at that position.

---

## 3. Technical Notes

- **Component import at template level** ensures code reusability and performance (the search code is bundled for all associated content/pages).
- **Shortcode usage** in content or templates `axcora-search` provides flexibility to position the widget wherever needed.
- **Dependency management:** Components that rely on JavaScript (like search) must be declared in both `css.components` and `js` lists in the template frontmatter.

*This documentation applies to Axcora SSG 2025 Edition and later. Syntax and configuration may differ for older releases.*

