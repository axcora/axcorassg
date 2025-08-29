### Axcora Blockquote

```
npm i axcora-blockquote
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - blockquote
---
{% axcora-blockquote text="The greatest glory in living lies not in never falling, but in rising every time we fall" footer="Nelson Mandela" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:
```
{% axcora-blockquote text="The greatest glory in living lies not in never falling, but in rising every time we fall" footer="Nelson Mandela" /%}
```
