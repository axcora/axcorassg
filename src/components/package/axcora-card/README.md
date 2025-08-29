### Axcora card

```
npm i axcora-card
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - card
---
{% axcora-card title="Card" card_title="Card Title" text="Content in here" footer="footer here" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-card title="Card" card_title="Card Title" text="Content in here" footer="footer here" /%}
```
