---
title: "toast"
date: "2025-08-12"
tags: 
 - toast
 - toast axcora
 - toast components
category: "components"
description: "How to use toast component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - toast
    - navbar
    - image
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
  - toast
---
The **Toast component** in Axcora SSG provides a modern, animated way to display temporary notifications or feedback messages to users. Toasts are ideal for success confirmations, error alerts, warnings, or quick info messages, and can be used both in site templates and in Markdown-powered content.

---

## 1. Enabling Toast Components

To use toast notifications, add both CSS and JS modules to your template’s front-matter (example: `templates/blog/single.axcora`):

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - toast
js:
  - toast
---
<main>{{content}}</main>
```

Once imported, toast functionality is available sitewide—in templates and Markdown content.

---

## 2. Usage Example

To trigger a toast notification, use the following markup:

```text
{% axcora-toast button="✨ Show Toast" color="success" text="Congratulations Lorep Ipsum is dolor siamet" /%}
```

**Output:**  
A button labeled **"✨ Show Toast"** appears. When clicked, a toast notification styled with the "success" variant pops up and then dismisses automatically or when closed.

---

## 3. Component Properties

| Property  | Type   | Description                                                     |
|-----------|--------|-----------------------------------------------------------------|
| `button`  | string | The label for the toast trigger button (required)               |
| `color`   | string | The style variant: `success`, `error`, `warning`, or `info`     |
| `text`    | string | Notification/content message inside the toast (required)         |

Additional attributes (not currently in default spec but common in UI frameworks[2]) that you may add for further control:

- `duration` (number): Visibility time (ms) before auto-dismiss (default: 5000ms).
- `icon` (string): Custom icon displayed in the toast.
- `position` (string): Toast placement (`top`, `bottom`, `top-right`, etc.).

---

## 4. Toast CSS & Behavior

A typical toast presentation:

- **Overlay:** Toasts appear above normal content, rapidly gaining user attention.
- **Animation:** Fade/slide in, and automatically dismiss after a preset duration.
- **Variants:** Visual cues for status (color for success, error, warning, info).

Example CSS outline:

```css
.toast-container {
  position: fixed;
  z-index: 1090;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none;
  max-width: 90vw;
}
@media (max-width: 600px) {
  .toast-container {
    right: 8px;
    bottom: 8px;
    left: 8px;
    max-width: unset;
  }
}
.toast {
  min-width: 250px;
  max-width: 350px;
  background: var(--p700, #222);
  color: white;
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  transition: all 0.35s cubic-bezier(.22,1,.36,1);
  pointer-events: auto;
  border: none;
  display: flex;
  align-items: center;
  overflow: hidden;
  font-size: 1rem;
}
.toast.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast .toast-body {
  flex: 1 1 auto;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  line-height: 1.4;
}
.btn-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  opacity: 0.75;
  transition: opacity 0.2s;
}
.btn-close:hover {
  opacity: 1;
}
```

- **Position:** Toasts typically appear at the top or bottom corners of the viewport.
- **Close:** Toasts auto-dismiss after a timeout, or can be closed manually[2].

---

## 5. Accessibility & Usability

- **Accessible labeling**: Ensure toast messages are concise but descriptive.
- **Keyboard navigation**: Toasts can be closed via keyboard (ESC key).
- **Focus:** Toasts do not steal focus, allowing background interaction.

---

## 6. Best Practices

- Use toasts for **important but brief feedback** (not for persistent content).
- Avoid stacking too many toasts—if multiple are shown, limit the count to boost clarity[1].
- Match toast color to the nature of the message (e.g., green for success, red for error).
- Always provide a close/dismiss option for user control.

---

## 7. Summary Table

| Variant    | Usage Example                                                         | Key Properties              |
|------------|----------------------------------------------------------------------|----------------------------|
| Success    | `{% axcora-toast button="Show" color="success" text="All done!" /%}` | `button`, `color`, `text`  |
| Error      | `{% axcora-toast button="Show" color="error" text="Failed!" /%}`     | `button`, `color`, `text`  |
| Warning    | `{% axcora-toast button="Show" color="warning" text="Careful!" /%}`  | `button`, `color`, `text`  |
| Info       | `{% axcora-toast button="Show" color="info" text="Heads up!" /%}`    | `button`, `color`, `text`  |

The **Axcora Toast component** provides instant, friendly feedback to users with smart styling and effortless integration—making your site's notifications both beautiful and highly usable.