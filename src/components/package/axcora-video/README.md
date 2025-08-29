### Axcora video

```
npm i axcora-video
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - video
js:
  - video
---
{% axcora-video video_mp4="/video/video.mp4" ratio="4x3" title="Video Local" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

MP4 Format

```
{% axcora-video button="✨ Show video" color="success" text="Congratulations Lorep Ipsum is dolor siamet" /%}
```

WEBM Format

```
{% axcora-video video_webm="/video/video.mp4" ratio="4x3" title="Video Local" /%}
```
