---
title: "HTML-Safe Output"
date: "2025-08-22"
tags: 
 - output
 - html
 - HTML Safe Output
category: "templating"
description: "All variables in Axcora templates are automatically HTML-escaped for security"
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
preventing injection attacks and ensuring that browser-rendered output is safe by default. If you want to output **trusted raw HTML**, use triple braces syntax: `{{{ content }}}`.

**Details:**

- **Escaped Output (`{{ content }}`):**  
  By default, using double curly braces escapes HTML special characters like `<`, `>`, `&`, `"`, and `'`, so any data passed as a variable cannot break your page or run scripts. For example, if `content` is `<script>bad()</script>`, the output will display as plain text (`&lt;script&gt;bad()&lt;/script&gt;`) and not execute as HTML or JavaScript.

**Best Practices**:

- Always use regular double braces (`{{ variable }}`) for any data unless you are absolutely certain it is safe and trusted.
- Automatic escaping is a recommended security feature in template engines to prevent code injection and should be the default for any public-facing content.

**Example:**
```html
<!-- This will escape HTML -->
{{ content }}
```
