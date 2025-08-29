# axcora-css

A collection of modular, modern, and responsive CSS component files for Axcora SSG

---

## ⚡ Features

- Modular: Import only what you need (e.g. buttons, navbar, cards, forms, etc)
- Zero dependencies, pure CSS
- Optimized for static site generators & design system needs

---

## 📦 Installation

```
npm install axcora-css
```

## 🚀 Usage
You can use the Axcora CSS components in your build scripts, SSG, or even import directly in your HTML/CSS workflow.

A. In Static Site Generator (e.g., Axcora SSG):
Specify desired component files in your frontmatter or config (handled by your builder):
```
css:
  components:
    - buttons
    - navbar
    - cards
    - forms
```

The builder will auto-resolve from your local static folder first, then fallback to node_modules/axcora-css/file.css.

B. Import Manually in HTML
```
<link rel="stylesheet" href="node_modules/axcora-css/buttons.css">
<link rel="stylesheet" href="node_modules/axcora-css/navbar.css">
```

Or copy the CSS files to your own static folder as needed.

C. Import in JS/SCSS using bundler (Webpack/Vite/Parcel/etc)
```
import 'axcora-css/buttons.css';
import 'axcora-css/navbar.css';
```

## Available Components

- accordion.css
- alerts.css
- axcora-base.css
- axcora.css
- badge.css
- blockquote.css
- breadcrumb.css
- buttons.css
- cards.css
- carousel.css
- codes.css
- dropdown.css
- forms.css
- glass.css
- hero.css
- image.css
- modal.css
- navbar.css
- pagination.css
- scrollspy.css
- search.css
- spinner.css
- table.css
- tabs.css
- toast.css
- video.css

## Contributing

Feel free to PR improvements, bug fixes, more components, or docs updates!
