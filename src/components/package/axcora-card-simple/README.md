### Axcora card

```
npm i axcora-card-simple
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - card
---
{% axcora-card-simple card_title="Card Title" text="Content in here" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-card-simple card_title="Card Title" text="Content in here" /%}
```
