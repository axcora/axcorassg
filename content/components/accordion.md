---
title: "Accordion"
date: "2025-08-24"
tags: 
 - accordion
 - accordion components
 - accordion axcora
category: "components"
description: "How to use accordion components"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - badge
    - hero
    - breadcrumb
    - pagination
    - cards
    - accordion
    - image
js:
  - accordion
  - navbar
  - theme
---
### Importing Accordion in Templates

To use the Accordions component in Markdown documents, you must first import the component into your template or content/*.md markdown file (for example, in templates/blog/single or layout/page.axcora or in to your content/blog/*.md). This is done by defining it in the front matter of your page. Here is a standard example:

**installation**

```
npm i axcora-accordion
```

on templates

```
---
layouts: base
css:
  theme: 'essentials'
  components:
    - accordion
js: 
 - accordion
---
<main class="container">{{content}}</main>
```

This import ensures that the required styles and component logic are available throughout the Markdowns or template file.

### Using Accordion in Markdown

Once imported finish, you can implement the Accordion directly within your Markdown or templating file using a custom tag. Here’s a basic usage example:

```
{% axcora-accordion id="demo" title1="Axcora Accordion" text1="hello world lopre ipsum dolor" title2="Axcora Accordion 2" text2="hello world lopre ipsum dolor 2" title3="Axcora Accordion 3" text3="hello world lopre ipsum dolor 3" /%}
```
Output: 

{% axcora-accordion id="demo" title1="Axcora Accordion" text1="hello world lopre ipsum dolor" title2="Axcora Accordion 2" text2="hello world lopre ipsum dolor 2" title3="Axcora Accordion 3" text3="hello world lopre ipsum dolor 3" /%}

Or, if you want to build custom CSS for your content (for example, for content/blog/helloworld.md):

First, you need to know that Axcora SSG comes with a default skeleton using axcora-base.css. So, if you want to style content such as content/blog/hello.md, you will need to add all the necessary components yourself—such as a navbar, buttons, and others.

Axcora SSG will then generate all your components as a .min.css adn .min.js file. This helps you build a website focused on speed and performance, as only the CSS adn JS components you need will be included.

you can simply use this concept format

```
---
title: "Hello World"
date: "2025-08-24"
tags: 
 - hello
 - world
category: "Hello"
description: "How to use hello world in components"
css:
  theme: 'essentials'
  components: // all component include for templates and content
    - buttons 
    - navbar
    - badge
    - hero
    - breadcrumb
    - pagination
    - cards
    - accordion
image: "/img/ax-1.jpg"
js:
  - accordion
  - navbar
  - themes
---
Your article in here....
```

+ The id attribute provides a unique identifier for the accordion block (helpful for labeling and reference).
+ Use title1, text1, title2, text2, etc. to define multiple accordion panels and their respective content.
+ You can add as many title/text pairs as needed with max 5 items.

### Features and Advantages
+ Space Efficiency: Accordions allow multiple content sections to share the same screen space by letting users expand only what they want to view.
+ Improved Navigation: Users can quickly scan panel headers and jump to the sections relevant to them, enhancing usability in dense documents.
+ User Experience: Collapsible panels reduce cognitive overload by exposing only one section at a time

### Accessibility Considerations
Well-designed Accordion components ensure:
+ Keyboard navigation (using arrow keys, Enter/Space for toggling, Home/End for navigation, etc.).
+ Adequate labeling and ARIA attributes, which improve experience for users with screen readers.
+ Automated accessibility checks to ensure compliance with guidelines like WAI-ARIA.

### Customization
You may customize the Accordion component further in your template’s configuration, such as:
+ Changing the theme or style (through your CSS settings),
+ Adjusting the panel order or default open/closed states,
+ Enabling/disabling specific panels as needed.
+ When you follow this structure, you ensure the Accordion component is fully functional and accessible within your Markdown-driven workflow.
