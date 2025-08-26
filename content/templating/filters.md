---
title: "Axcora Filter"
date: "2025-08-18"
tags: 
 - filter axcora templating
 - axcora filters
category: "templating"
description: "How to use filter in Axcora Templating"
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
### Filters in Axcora Templates

Axcora supports **filters** to transform, format, and manipulate data inside your templates. Filters are applied using the pipe syntax (`|`) after the variable. You can use built-in filters or (in future updates) define your own custom filters.

---

#### Built-in Filters

**1. Date Formatting**

Format date variables for user-friendly output:

```
{{ date | formatDate }}
<!-- Output: January 15, 2025 -->

{{ "now" | formatDate }}
<!-- Output: Current date or year -->
```
- The `formatDate` filter converts a date string (or "now") into a readable format.

---

**2. Length Filter**

Get the size (count) of an array:

```
{{ posts | length }}
<!-- Output: Number of posts in the collection -->

{{ tags | length }}
<!-- Output: Number of tags assigned to the post -->
```
- The `length` filter returns the number of elements in an array.

---

#### Custom Filters (Coming Soon)

You’ll soon be able to create and use custom filters to fit your content needs:

```
{{ content | excerpt:100 }}
<!-- Output: First 100 characters from content -->

{{ title | slugify }}
<!-- Output: "My Title" becomes "my-title" -->

{{ text | uppercase }}
<!-- Output: "hello" becomes "HELLO" -->
```
- `excerpt:100` takes the first 100 characters of a string.
- `slugify` transforms strings into URL-friendly slugs.
- `uppercase` converts all text to capital letters.

---

**Best Practices:**  
- Use filters to format dates, enumerate items, and generate clean URLs.
- Combine multiple filters for advanced transformations (e.g., `{{ title | slugify | uppercase }}`).
- Check future releases for new filter options and extensibility.

Filters empower you to keep your templates clean, readable, and flexible—no complex JavaScript or backend required!