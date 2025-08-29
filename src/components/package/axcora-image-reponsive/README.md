### Axcora Image responsive

```
npm i axcora-image-responsive
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - image
---
{% axcora-image-responsive title="Title" image="/img/ax.jpg" loading="lazy" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-image-responsive title="Title" image="/img/ax.jpg" loading="lazy" /%}
```
