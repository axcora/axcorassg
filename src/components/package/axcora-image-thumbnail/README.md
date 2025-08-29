### Axcora Image thumbnail

```
npm i axcora-image-thumbnail
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - image
---
{% axcora-image-thumbnail title="Title" image="/img/ax.jpg" width="" height="" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-image-thumbnail title="Title" image="/img/ax.jpg" width="" height="" /%}
```
