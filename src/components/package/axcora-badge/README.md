### Axcora Badge

```
npm i axcora-badge
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - badge
---
{% axcora-badge title="My Badge" color="primary" /%}
```

After including the badge component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a badge using the Axcora templating syntax:
```
{% axcora-badge title="My Badge" color="primary" /%}
```
