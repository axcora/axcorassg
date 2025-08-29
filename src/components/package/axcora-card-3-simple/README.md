### Axcora Card 3

```
npm i axcora-card-3-simple
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - cards
---
{% axcora-card-3-simple card_title1="Card Title" text1="Content in here" card_title2="Card Title 2" text2="Content 2 in here" card_title3="Card Title 3" text3="Content 3 in here" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-card-3-simple card_title1="Card Title" text1="Content in here" card_title2="Card Title 2" text2="Content 2 in here" card_title3="Card Title 3" text3="Content 3 in here" /%}
```
