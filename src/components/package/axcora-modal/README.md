### Axcora Modal

```
npm i axcora-modal
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - modal
js:
  - modal
---
{% axcora-modal modal_button="🚀 Get Started" id="demo" title="demo" content="Hello World"/%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

Simple Modal
```
{% axcora-modal modal_button="🚀 Get Started" id="demo" title="demo" content="Hello World" /%}
```

Complete Modal
```
{% axcora-modal modal_button="🚀 Get Started" id="demo" title="demo" content="Hello World" content1="WOrld Lorep and ipsum" content2="Lopep ipsum dolor siamet amet" image="/img/ax.jpg" width="" height="" loading="" button1="Explore" button1_url="/explore" button1_color="primary" button2="View" button2_url="/views" button2_color="danger" /%}
```
