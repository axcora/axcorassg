### Axcora Image ratio

```
npm i axcora-image-ratio
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - image
---
{% axcora-image-ratio title="Title" image="/img/ax.jpg" ratio="16x9" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-image-ratio title="Title" image="/img/ax.jpg" ratio="16x9" /%}
```

Ratio
+ 1x1
+ 4x3
+ 16x9
+ 21x9
