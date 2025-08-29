### Axcora tabs

```
npm i axcora-tabs
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - tabs
js:
  - tabs
---
{% axcora-tabs tabs_id="demo" tabs1_id="1" tabs1_title="Profile" tabs1_content="Profile content in here" tabs2_id="2" tabs2_title="Media" tabs2_content="Media content in here" tabs3_id="3" tabs3_title="Video" tabs3_content="Video content in here" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

3 Tabs
```
{% axcora-tabs tabs_id="demo" tabs1_id="1" tabs1_title="Profile" tabs1_content="Profile content in here" tabs2_id="2" tabs2_title="Media" tabs2_content="Media content in here" tabs3_id="3" tabs3_title="Video" tabs3_content="Video content in here" /%}
```

6 Tabs
```
{% axcora-tabs tabs_id="demo" tabs1_id="1" tabs1_title="Profile" tabs1_content="Profile content in here" tabs2_id="2" tabs2_title="Media" tabs2_content="Media content in here" tabs3_id="3" tabs3_title="Video" tabs3_content="Video content in here" tabs4_id="4" tabs4_title="Music" tabs4_content="Music content in here" tabs5_id="5" tabs5_title="Game" tabs5_content="Game content in here" tabs6_id="6" tabs6_title="Streaming" tabs6_content="Streaming content in here" /%}
```
