### Axcora Iframe

```
npm i axcora-iframe
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - video
---
{% axcora-iframe url="https://www.youtube.com/embed/sBljFnEB7Sg" ratio="16x9" title="Iframe Video" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-iframe url="https://www.youtube.com/embed/sBljFnEB7Sg" ratio="16x9" title="Iframe Video" /%}
```
