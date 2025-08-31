---
title: "Modal"
date: "2025-08-14"
tags: 
 - modal
 - modal axcora
 - modal components
category: "components"
description: "How to use modal component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - modal
    - navbar
    - image
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
  - modal
---
The **Modal component** in Axcora SSG provides a modern, accessible popup dialog that can be used to display key information, prompts, forms, images, or complex content as overlays. Modals can be integrated seamlessly in both your templates and Markdown content, supporting advanced layouts and interactive features.

**installation**

```bash
npm i axcora-modal
```
---

## 1. Enabling Modal Components

To use the modal component, import both the CSS and JS files in your template's front matter, as in `templates/blog/single.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - modal
js:
  - modal
---
<main>{{content}}</main>
```

After import, modal dialogs can be invoked from Markdown or template files.

---

## 2. Example: Using the Modal Component

To implement a modal, use the following syntax:

```text
{% axcora-modal modal_button="🚀 Get Started" id="demo" title="demo" content="Hello World" content1="WOrld Lorep and ipsum" content2="Lopep ipsum dolor siamet amet" image="/img/ax.jpg" width="" height="" loading="" button1="Explore" button1_url="/explore" button1_color="primary" button2="View" button2_url="/views" button2_color="danger" /%}
```
**Output:**  
{% axcora-modal modal_button="🚀 Get Started" id="demo" title="demo" content="Hello World" content1="WOrld Lorep and ipsum" content2="Lopep ipsum dolor siamet amet" image="/img/ax.jpg" width="" height="" loading="" button1="Explore" button1_url="/explore" button1_color="primary" button2="View" button2_url="/views" button2_color="danger" /%}

---

## 3. Component Properties

| Property          | Type   | Description                                                      |
|-------------------|--------|------------------------------------------------------------------|
| `modal_button`    | string | Text or emoji for the outside trigger button                     |
| `id`              | string | Modal dialog identifier (must be unique per modal)               |
| `title`           | string | Modal header text                                                |
| `content`         | string | Main content in the modal body                                   |
| `content1/2/3...` | string | Additional content sections                                      |
| `image`           | string | Image URL to display in modal                                    |
| `width`           | string | Custom width for modal dialog                                    |
| `height`          | string | Custom height for modal dialog                                   |
| `loading`         | string | Loading attribute for deferred resources                         |
| `button1`         | string | First modal action button text                                   |
| `button1_url`     | string | URL for the first action button                                  |
| `button1_color`   | string | Color for the first action button                                |
| `button2`         | string | Second modal action button text (optional)                       |
| `button2_url`     | string | URL for the second action button                                 |
| `button2_color`   | string | Color for the second action button                               |

---

## 4. CSS Overview

The modal CSS ensures a smooth, glassmorphism-inspired dialog with backdrop, animations, and accessibility support:

```css
.modal {
  position: fixed;
  top: 0; left: 0;
  z-index: var(--z-modal);
  display: none;
  width: 100%; height: 100%;
  overflow-x: hidden; overflow-y: auto;
}
.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modal-fade-in var(--transition-normal) ease-out;
}
.modal-backdrop {
  position: fixed;
  width: 100vw; height: 100vh;
  background-color: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}
.modal-dialog {
  position: relative;
  max-width: 500px;
  pointer-events: none;
  animation: modal-scale-in var(--transition-normal) ease-out;
}
.modal-content {
  display: flex; flex-direction: column;
  background-color: var(--body-bg);
  border: 1px solid var(--s200);
  border-radius: var(--radius-xl);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--p500), var(--p600));
  color: white;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--s200);
}
.btn-close {
  background: rgba(255,255,255,0.1);
  border-radius: var(--radius-full);
  width: 32px; height: 32px;
  cursor: pointer;
}
.btn-close::before {
  content: '✕';
}
```

- **Backdrop blur and dim** for focus and modern design.
- **Animation** for sliding and fading in/out.
- **Header, body, and footer** areas for clear structure.
- **Responsive** layout for desktop and mobile.

---

## 5. Accessibility & Behavior

- **Focus lock:** When opened, keyboard focus moves into the modal, and returns to the trigger button on close.
- **Close options:** Users can close via the ESC key, clicking the “✕” button, or clicking the backdrop—all are supported best practices[5].
- **Multiple modals:** Each modal should have a unique `id` if used on the same page.

---

## 6. Best Practices

- Keep modal content concise and focused on a single task or message.
- Always provide accessible labels (`title`) and clear close behavior.
- Use modals for onboarding steps, forms, confirmations, or showcasing additional media without leaving the context of the current page.
- Test on both mobile and desktop for usability and responsiveness.

---

## 7. Summary Table

| Area           | Purpose                         | Related Props                         |
|----------------|--------------------------------|---------------------------------------|
| Trigger        | Shows modal on click            | `modal_button`                        |
| Title/Header   | Identifies modal content        | `title`                               |
| Body           | Main modal information/sections | `content`, `content1`, `content2`, etc|
| Media          | Image block in modal            | `image`, `width`, `height`, `loading` |
| Actions        | Action buttons                  | `button1/2`, `button1/2_url`, `button1/2_color` |
| Footer         | Action/confirmation area        | Buttons (see above)                   |

The **Axcora Modal component** is a flexible, modern solution for context-sensitive overlays, supporting advanced design, accessibility, and user interactivity across your site.The **Modal component** in Axcora SSG allows you to display modern, animated overlay dialogs for messages, forms, prompts, media, or feature callouts