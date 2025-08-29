### Axcora Image

```
npm i axcora-image
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - image
---
{% axcora-image alt="Title" src="/img/ax.jpg" loading="lazy" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-image alt="Title" src="/img/ax.jpg" loading="lazy" /%}
```
