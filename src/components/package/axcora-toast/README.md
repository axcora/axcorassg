### Axcora toast

```
npm i axcora-toast
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - toast
js:
  - toast
---
{% axcora-toast button="✨ Show Toast" color="success" text="Congratulations Lorep Ipsum is dolor siamet" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-toast button="✨ Show Toast" color="success" text="Congratulations Lorep Ipsum is dolor siamet" /%}
```
