### Axcora Hero Button

```
npm i axcora-hero-button
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - hero
---
{% axcora-hero-button title="Hero with button Title" text="Content Hero with button in here" button1="Get Started" button1_color="primary" button1_url="/start" button2="Learn More" button2_color="warning" button2_url="/learn" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

```
{% axcora-hero-button title="Hero with button Title" text="Content Hero with button in here" button1="Get Started" button1_color="primary" button1_url="/start" button2="Learn More" button2_color="warning" button2_url="/learn" /%}
```
