### Axcora Glass

```
npm i axcora-glass-2
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - glass
---
{% axcora-glass-2 title1="Glass Title" text1="Content in here" title2="Glass Title 2" text2="Content 2 in here" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-glass-2 title1="Glass Title" text1="Content in here" title2="Glass Title 2" text2="Content 2 in here" /%}
```
