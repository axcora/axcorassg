---
title: "Tabs"
date: "2025-08-13"
tags: 
 - tabs
 - tabs axcora
 - tabs components
category: "components"
description: "How to use tabs component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - tabs
    - navbar
    - image
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
  - tabs
---
The **Tabs component** in Axcora SSG allows you to organize and display segmented content in a modern tabbed interface, offering users rapid switching between panels. Tabs may be configured and used per-template or directly in article content, providing flexibility for documentation, feature comparisons, dashboards, and more.

**installation**

```bash
npm i axcora-tabs
```

---

## 1. Enabling Tabs Components

Import the tabs component CSS and JS in your template’s front matter—for example, in `templates/blog/single.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - tabs
js:
  - tabs
---
<main>{{content}}</main>
```

Once imported, you can use tabbed navigation in both Markdown content and templates.

---

## 2. Usage Examples

### 3 Tabs Example

```
{% axcora-tabs tabs_id="demo" tabs1_id="1" tabs1_title="Profile" tabs1_content="Profile content in here" tabs2_id="2" tabs2_title="Media" tabs2_content="Media content in here" tabs3_id="3" tabs3_title="Video" tabs3_content="Video content in here" /%}
```
**Output:**  
Renders a tabbed panel with three sections: Profile, Media, Video.

---

### 6 Tabs Example

```
{% axcora-tabs tabs_id="demo" tabs1_id="1" tabs1_title="Profile" tabs1_content="Profile content in here" tabs2_id="2" tabs2_title="Media" tabs2_content="Media content in here" tabs3_id="3" tabs3_title="Video" tabs3_content="Video content in here" tabs4_id="4" tabs4_title="Music" tabs4_content="Music content in here" tabs5_id="5" tabs5_title="Game" tabs5_content="Game content in here" tabs6_id="6" tabs6_title="Streaming" tabs6_content="Streaming content in here" /%}
```
**Output:**  
Renders a tabbed panel with six content sections for comprehensive, organized navigation.

---

## 3. Component Properties

Use these keys to define each tab and its content:

| Property             | Type   | Description                       |
|----------------------|--------|-----------------------------------|
| `tabs_id`            | string | Unique ID for the tabs component  |
| `tabsX_id`           | string | Unique ID per tab (X = 1...N)     |
| `tabsX_title`        | string | Tab label/title                   |
| `tabsX_content`      | string | Tab panel content                 |

For each tab, increment the number and repeat the group of `id`, `title`, and `content` fields.

---

## 4. CSS Overview

The tabs component employs modern UI styling, clear visual separation, and smooth transitions:

```css
.nav-tabs {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  border-bottom: 2px solid var(--s200);
  margin-bottom: var(--spacing-lg);
}
.nav-tabs .nav-link {
  display: block;
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--text-muted);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  transition: all var(--transition-normal);
  font-weight: 500;
}
.nav-tabs .nav-link.active {
  color: var(--s100);
  background-color: var(--p500);
  border-color: var(--s200);
  border-bottom: 2px solid var(--body-bg);
}
.tab-content {
  padding: var(--spacing-lg);
  background-color: var(--s100);
  border-radius: 0 var(--radius-lg) var(--radius-lg) var(--radius-lg);
  border: 1px solid var(--s200);
}
.tab-pane {
  display: none;
}
.tab-pane.active {
  display: block;
  animation: tab-fade-in var(--transition-normal) ease-out;
}
@keyframes tab-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

- **Active tab** is visually highlighted via color and underline.
- **Non-active tabs** are subtly styled for clear navigation.
- **Animations** ensure smooth content transition when changing tabs.

---

## 5. Accessibility & Behavior

- **Keyboard navigation**: Tabs are focusable and can be switched with arrow keys for improved accessibility[3][5].
- **ARIA roles**: The underlying markup follows best practices for accessible tabbed interfaces.
- **Dynamic content**: Supports arbitrary markup inside each tab content, from text to images, code samples, lists, and forms.

---

## 6. Best Practices

- **Label tabs clearly** for discoverability; use concise, meaningful titles.
- **Limit tab count** for usability; if needed, use vertical tabs to display many panels[4].
- **Responsive design**: Tabs will adapt gracefully to mobile screens with easy touch navigation.
- **Use unique IDs** for each tab and entire tab group to avoid conflicts.

---

## 7. Summary Table

| Variant      | Purpose          | Essential Properties                        |
|--------------|------------------|---------------------------------------------|
| 3-tabs       | Sectioned layout | `tabs_id`, `tabs1/2/3_id`, `tabs1/2/3_title`, `tabs1/2/3_content` |
| 6-tabs       | Extensive layout | As above, extended for all six tabs         |

The **Axcora Tabs component** lets you present complex, categorized information in a space-efficient format that is accessible, highly customizable, and visually appealing for both documentation and web applications.
