---
layout: index
title: "Axcora Framework - All-in-One Static Site Generator & CSS Framework"
description: "Modern static site generator with built-in CSS framework, components, dark mode, and automatic build system for developers."
hero:
 title1: "All-in-One Static Site Generator"
 title2: "& CSS Framework"
 description: "Build beautiful, responsive websites with our modern static site generator ,commplete CSS framework with the components, automatic build system, and dark mode support" 
 version: 🚀 Axcora v1.0 is launch now!
 button1: 
   text: 📚 View Documentation
   url: /install/
 button2: 
   text:  🎯 Explore Components
   url: /components/
 info: 
   - title: 15.6KB
     text: Base
   - title: 19.6KB
     text: Essentilas
   - title: 43.7KB
     text: Minified
   - title: 11.8KB
     text: Javascript
features:
 title: 🚀 Key Features
 section1:
  title: Out-of-the-Box SEO Automation
  icon: /img/icon/seo.svg
  text: Each page gets auto-generated meta tags (including generator hints, Open Graph support), canonical links, and sitemap/RSS feeds for search engine optimization—no plugin dance required.
  start: 
    title: Get Start Now with Axcora SSG
    text: "Download Node Js and run terminal"
    download: 
      text: "Downlod Node Js"
      url: "https://nodejs.org/en/download"
    commandline: 
      - text: "installation axcora"
        sort: "1"
        command: "npm install axcora"
      - text: "Check Version"
        sort: "2"
        command: "axcora -version"
      - text: "First Project"
        sort: "3"
        command: "axcora init myproject && cd myproject"
      - text: "Dev mode"
        sort: "4"
        command: "axcora dev"
      - text: "Open Browser"
        sort: "5"
        command: "http://localhost:3000"
      - text: "Build Production"
        sort: "6"
        command: "axcora build"
      - text: "Run Serve"
        sort: "7"
        command: "axcora serve"
  css: 
    title: Get Start with Axcora CSS Framework
    text: How to use axcora css framework for your projects.
    button: 
      text: Download Axcora CSS
      url: "https://github.com"
    npm:
      text: Install Via NPM
      command: "npm install axcora css"
    node:
      text: Import from Node Modules
      command: 'import "axcora-css/axcora.min.css";'
    cdn:
      text: Inject CSS from CDN
      command: '&lt;link href="https://cdn.jsdelivr.net/npm/axcora-css@1.0.1/axcora.min.css" rel="stylesheet"/&gt;'
    js:
      text: Inject JS from CDN
      command: '&lt;script src="https://cdn.jsdelivr.net/npm/axcora-js@1.0.1/axcora.min.js"&gt;&lt;/script&gt;'
 section2:
  title: CSS Framework, Modular & Themed
  icon: /img/icon/modules.svg
  text: "Choose your CSS components (buttons, navbar, cards, badges, etc.) and theme (dark, minimal, brutalist, and more) per page or globally using frontmatter config:"
 list1: 
  - title: SSG with Built-in CSS Framework
    icon: /img/icon/CSS-framework.svg
    text: "Generate static sites directly from markdown/YAML content while utilizing a full-featured, modular CSS framework. No need for separate frontend or external CSS dependencies—styling and content are integrated by design."
  - title: Component-based Development
    icon: /img/icon/web-component.svg
    text: "Utilize and customize reusable UI components (in src/components/, e.g., Button.axc, Card.axc, Alert.axc) straight from your markdown or template files via easy shortcodes."
  - title: Automatic Markdown Collection
    icon: /img/icon/markdown.svg
    text: "All markdown files in the content/ folder are automatically collected and turned into pages, posts, categories and tags—no manual configuration necessary. Slugs, URLs, previous/next links and more are handled for you."
  - title: Axcora Templating Engine - Handlebars
    icon: /img/icon/handlebars-js.svg
    text: "No plain HTML! Use the special .axcora templating language (with support for layouts, slots, partials, YAML frontmatter, and direct component inclusion) for DRY, flexible, and powerful page structures."
  - title: Axcora Templating Engine - Handlebars
    icon: /img/icon/handlebars-js.svg
    text: "No plain HTML! Use the special .axcora templating language (with support for layouts, slots, partials, YAML frontmatter, and direct component inclusion) for DRY, flexible, and powerful page structures."
 list2: 
  - title: Fast Build, Minified Output
    icon: /img/icon/production.svg
    text: All CSS is bundled and minified per page for optimal performance and CDN readiness.
  - title: Auto Sitemap & RSS
    icon: /img/icon/rss-sitemap.svg
    text: Generates a complete sitemap.xml and rss.xml feed for discovery and syndication, automatically, every build.
  - title: Search Index
    icon: /img/icon/search.svg
    text: Auto-generates a JSON search index for local/fuzzy search capabilities—perfect for documentation and large blogs.
work: 
 title: 🛠 How it Works
 list: 
    - text: "Drop your content as markdown in content/"
    - text: "Configure appearance and structure with YAML frontmatter"
    - text: "Custom layouts: .axcora supports template inheritance, slots, block content, partials"
    - text: "CSS is auto-selected/minified per page"
    - text: "Every build auto-creates: sitemap, RSS, minified CSS, search index"
    - text: "Every page/post is SEO-optimized with meta tags, easily extendable via plugins"
why: 
 title: "✨ Why Use Axcora?"
 list: 
    - text: "Speed: All output is plain static HTML & minified CSS—delivered at lightning speed, perfect for global CDNs."
    - text: "Flexibility: Write only as much structure as you need: simple blog to advanced web doc site."
    - text: "Productivity: Reusable UI components, auto-generation of navigation, tags, categories, and feeds minimizes boilerplate."
    - text: "No Lock-in: Standard markdown/YAML content; output is industry-standard HTML/CSS, easy to migrate or deploy anywhere."
    - text: "Modern Development: Suitable for blogs, portfolios, docs sites, landing pages, and more."    
---
