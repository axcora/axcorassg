### Axcora Glass

```
npm i axcora-glass
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - glass
---
{% axcora-glass title="Glass Title" text="Content in here" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-glass title="Glass Title" text="Content in here" /%}
```
