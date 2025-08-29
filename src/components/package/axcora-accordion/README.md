### Axcora Accordion

```
npm i axcora-accordion
```

Accordion component for axcora SSG

```
{% axcora-accordion id="demo" title1="Axcora Accordion" text1="hello world lopre ipsum dolor" title2="Axcora Accordion 2" text2="hello world lopre ipsum dolor 2" title3="Axcora Accordion 3" text3="hello world lopre ipsum dolor 3" /%}
```

On markdown frontmatter format or axcora templating

```
---
title: "Hello World"
date: "2025-08-24"
description: "How to use hello world in components"
css:
  theme: 'essentials'
  components: 
    - accordion
image: "/img/ax-1.jpg"
js:
  - accordion
---
Your article in here....

{% axcora-accordion id="demo" title1="Axcora Accordion" text1="hello world lopre ipsum dolor" title2="Axcora Accordion 2" text2="hello world lopre ipsum dolor 2" title3="Axcora Accordion 3" text3="hello world lopre ipsum dolor 3" /%}

```
