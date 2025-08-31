---
title: "cards"
date: "2025-08-20"
tags: 
 - cards
 - cards axcora
 - cards components
category: "components"
description: "How to use cards component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - cards
    - navbar
    - hero
    - breadcrumb
    - pagination
    - image
js:
  - navbar
  - theme
---
The **Card component** in Axcora SSG provides a flexible, modern way to display grouped content, such as titles, descriptions, and footers, in a structured container. Cards can be used for articles, product features, profiles, and more, and are available both in templates and article content with easy-to-use options and layouts.

**installation**

```bash
npm i axcora-card
```

## Usage in Templates

To enable card components, import them per template in your template’s front-matter—for example, in `templates/blog/single.axcora` or `templates/blog/list.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - cards
---
<main class="container">{{content}}</main>
```

After importing, you can use all card variants inside both your Markdown content and template files.

## Implementation Examples

Several card types are available, from single to triple and “simple” versions for more basic layouts.

### Single Card

```
{% axcora-card title="Card" card_title="Card Title" text="Content in here" footer="footer here" /%}
```
**Output:**  
{% axcora-card title="Card" card_title="Card Title" text="Content in here" footer="footer here" /%}

### Two Cards

```
{% axcora-card-2 title1="Card" card_title1="Card Title" text1="Content in here" footer1="footer here" title2="Card 2" card_title2="Card Title 2" text2="Content 2 in here" footer2="footer 2 here" /%}
```
**Output:**  
{% axcora-card-2 title1="Card" card_title1="Card Title" text1="Content in here" footer1="footer here" title2="Card 2" card_title2="Card Title 2" text2="Content 2 in here" footer2="footer 2 here" /%}

### Three Cards

```
{% axcora-card-3 title1="Card" card_title1="Card Title" text1="Content in here" footer1="footer here" title2="Card 2" card_title2="Card Title 2" text2="Content 2 in here" footer2="footer 2 here" title3="Card 3" card_title3="Card Title 3" text3="Content 3 in here" footer3="footer 3 here" /%}
```
**Output:**  
{% axcora-card-3 title1="Card" card_title1="Card Title" text1="Content in here" footer1="footer here" title2="Card 2" card_title2="Card Title 2" text2="Content 2 in here" footer2="footer 2 here" title3="Card 3" card_title3="Card Title 3" text3="Content 3 in here" footer3="footer 3 here" /%}

### Simple Card Variants

#### Single Simple Card
```
{% axcora-card-simple card_title="Card Title" text="Content in here" /%}
```
**Output:**  
{% axcora-card-simple card_title="Card Title" text="Content in here" /%}

#### Two Simple Cards
```
{% axcora-card-2-simple card_title1="Card Title" text1="Content in here" card_title2="Card Title 2" text2="Content 2 in here" /%}
```
**Output:**  
{% axcora-card-2-simple card_title1="Card Title" text1="Content in here" card_title2="Card Title 2" text2="Content 2 in here" /%}

#### Three Simple Cards
```
{% axcora-card-3-simple card_title1="Card Title" text1="Content in here" card_title2="Card Title 2" text2="Content 2 in here" card_title3="Card Title 3" text3="Content 3 in here" /%}
```
**Output:**  
{% axcora-card-3-simple card_title1="Card Title" text1="Content in here" card_title2="Card Title 2" text2="Content 2 in here" card_title3="Card Title 3" text3="Content 3 in here" /%}

## Usage in Content

The card components can also be used directly in your Markdown content. Simply use the card tag as shown above, and the component will render as styled cards, provided you have imported the component in your template.

## Card CSS Styling

Cards employ a modern, accessible design for clarity and emphasis:

```css
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: var(--s50);
  border: 1px solid var(--s200);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  color: var(--color);
  transition: all var(--transition-normal);
}
.card-header {
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--p500), var(--p600));
  color: white;
  font-weight: 600;
  border-bottom: 1px solid var(--s200);
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}
.card-body {
  flex: 1 1 auto;
  padding: var(--spacing-lg);
  color: var(--color);
}
.card-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--s200);
  background-color: var(--s100);
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
  color: var(--color);
}
[data-theme="dark"] .card {
  background-color: var(--s200);
  border-color: var(--s600);
}
[data-theme="dark"] .card-header {
  background: linear-gradient(135deg, var(--p500), var(--p400));
  border-color: var(--s600);
}
[data-theme="dark"] .card-footer {
  background-color: var(--s300);
  border-color: var(--s600);
}
```

## Card Properties

Certainly! Continuing and expanding the **Card Properties Table** for multiple card variants and providing additional best practices:

---

| Property           | Type   | Description                                               |
|--------------------|--------|-----------------------------------------------------------|
| `title`            | string | Main card title (for standard card)                       |
| `card_title`       | string | Section/heading inside the card                           |
| `text`             | string | Card content/body text                                    |
| `footer`           | string | Footer text (optional)                                    |
| `title1`           | string | Main title for first card (multi-card variants)           |
| `card_title1`      | string | Title/heading for first card                              |
| `text1`            | string | Body/content for first card                               |
| `footer1`          | string | Footer for first card (optional)                          |
| `title2`           | string | Main title for second card (multi-card variants)          |
| `card_title2`      | string | Title/heading for second card                             |
| `text2`            | string | Body/content for second card                              |
| `footer2`          | string | Footer for second card (optional)                         |
| `title3`           | string | Main title for third card (multi-card variants)           |
| `card_title3`      | string | Title/heading for third card                              |
| `text3`            | string | Body/content for third card                               |
| `footer3`          | string | Footer for third card (optional)                          |

> **Note:**  
> “Simple” card variants use only `card_title` and `text` (or add `card_title1/2/3` and `text1/2/3` for multiple simple cards without main titles or footers).

---

## Best Practices

- **Content Grouping:** Use cards to visually group related information, for example, service features, contributors, blog summaries, or product highlights.
- **Consistent Structure:** Always supply a heading (`title` or `card_title`) and content (`text`) for clear readability.
- **Minimalist Design:** Opt for simple card variants when you want a clean, less-detailed display.
- **Responsive Layouts:** The built-in card CSS ensures cards are flexible and adapt to different screen sizes, but always test your layouts on multiple devices.
- **Accessibility:** Make sure your card content uses semantic structure and clear language, ensuring clarity for all users.

## Accessibility Notes

- The card’s visual and structural distinctions help users scan content easily.
- Use meaningful, descriptive titles and body text for assistive technologies.
- For actions within cards (such as buttons or links), ensure proper use of accessible components.

## Summary

The **Card component in Axcora SSG** gives you a robust and easy way to present grouped, structured content anywhere on your site. You can use single, double, or triple card layouts—either in full or simplified versions—to match your content needs. With modern styles and built-in responsive design, cards help make your site more engaging and user-friendly.

---
