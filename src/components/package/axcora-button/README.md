### Axcora Button

```
npm i axcora-button
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - button
---
{% axcora-button text="Click Me" href="/" color="primary" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-button text="Click Me" href="/" color="primary" /%}
```
