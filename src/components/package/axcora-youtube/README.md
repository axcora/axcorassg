### Axcora youtube

```
npm i axcora-youtube
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - youtube
js:
  - youtube
---
{% axcora-youtube youtube_mp4="/youtube/youtube.mp4" ratio="4x3" title="youtube Local" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

MP4 Format

```
{% axcora-youtube youtube_mp4="/youtube/youtube.mp4" ratio="4x3" title="youtube Local" /%}
```

WEBM Format

```
{% axcora-youtube youtube_webm="/youtube/youtube.mp4" ratio="4x3" title="youtube Local" /%}
```
