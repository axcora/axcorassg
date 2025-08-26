---
title: "Includes Partilas"
date: "2025-08-16"
tags: 
 - partials axcora templating
 - include axcora templating
 - axcora partials
 - axcora include
category: "templating"
description: "How to use Includes Partilas in Axcora Templating"
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
### Includes & Partials in Axcora Templates

Axcora makes large templates manageable and DRY (Don’t Repeat Yourself) by supporting **includes**, also known as **partials**. You can break your templates into smaller, reusable pieces—like headers, footers, cards, or buttons—and include them wherever needed.

---

#### Basic Includes

To include another template file (partial), use the `{% include ... %}` statement:

```
<!-- Include header partial -->
{% include header.axcora %}

<!-- Include footer partial -->  
{% include footer.axcora %}

<!-- Include from subdirectory -->
{% include components/card.axcora %}
```

- The included file will be rendered as if its content is placed right at the include statement.  
- Partials automatically inherit all parent template variables and context.

---

#### Directory Structure for Includes

By convention, partials and include files are stored under a dedicated `includes` directory:

```
src/templates/includes/
├── header.axcora
├── footer.axcora  
├── navigation.axcora
└── components/
    ├── card.axcora
    └── button.axcora
```
- Organize complex UI (like cards, buttons, or reusable views) within subdirectories.

---

#### Passing Data to Includes

Currently, includes inherit the parent template’s data context:

```
{% include card.axcora %}
```
- All the variables available in the parent template are automatically available in the included file.

**Coming soon:**  
In future releases, you’ll be able to pass custom data directly into includes:

```
{% include card.axcora title="Custom Title" %}
```
- This will let you override or provide specific values just for that partial instance.

---

#### Best Practices

- Use includes for shared site elements (headers, navigation, footers) and reusable content patterns (cards, buttons, alerts).
- Organize includes in logical subfolders for maintainability.
- Rely on inheritance for context, but watch for future updates to take advantage of explicit data passing.

**Tip:**  
Includes help keep your code clean, modular, and easy to update—change the partial file, and every template using it gets the update automatically!Here’s the documentation for **Includes & Partials** in Axcora templates:

---

### Includes & Partials

Axcora lets you split your templates into reusable chunks called **partials** or **includes**. This keeps your code DRY, maintainable, and organized, especially for elements that repeat across pages (such as headers, navigation, footers, cards, etc).

#### Basic Includes

To include another template (partial) inside your main template, use the `{% include ... %}` syntax:

```
<!-- Include header partial -->
{% include header.axcora %}

<!-- Include footer partial -->  
{% include footer.axcora %}

<!-- Include from subdirectory -->
{% include components/card.axcora %}
```
- The included file is inserted at the specified location.
- All parent variables and context are available in the included file.

---

#### Include Structure

Typically, partials are kept under `src/templates/includes/` or a similar directory for easy organization:
```
src/templates/includes/
├── header.axcora
├── footer.axcora  
├── navigation.axcora
└── components/
    ├── card.axcora
    └── button.axcora
```
Organize your partials by function (header, footer, navigation) or by UI components.

---

#### Passing Data to Includes

- **Current behavior:**  
  Includes automatically inherit all variables from the parent template.
  ```
  {% include card.axcora %}
  ```

- **Future support:**  
  You will be able to pass custom variables or override values at include-time:
  ```
  {% include card.axcora title="Custom Title" %}
  ```

---

**Best Practices**
- Use includes for all repeating UI sections and reusable widgets.
- Group and name files descriptively for clarity.
- Take advantage of future explicit data passing for advanced customization.

**With includes and partials, your Axcora templates remain clean, modular, and easy to update!**
