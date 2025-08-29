### Axcora Hero

```
npm i axcora-hero
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - hero
---
{% axcora-hero title="Title" text="Content in here" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-hero title="Title" text="Content in here" /%}
```
