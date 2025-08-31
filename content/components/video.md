---
title: "Video"
date: "2025-08-11"
tags: 
 - video
 - video axcora
 - video components
category: "components"
description: "How to use video component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - video
    - navbar
    - image
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
---

The **Video component** in Axcora SSG allows you to seamlessly embed responsive, aspect-ratio-controlled video content directly in your templates or Markdown-based content. This component supports common video formats, local files, and accommodates accessibility via `alt` text, while automatically adapting to various layouts and device screens.

**installation**

```bash
npm i axcora-video
```

---

## 1. Enabling the Video Component

To activate video embedding for a template, add the component to your template’s front-matter, for example in `templates/blog/single.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - video
---
<main>{{content}}</main>
```

Once imported, you can use the video component in Markdown articles and within template markup.

---

## 2. Usage Example

Embed a local or hosted video with a specified aspect ratio and alternative text:

mp4 format
```
{% axcora-video video_mp4="/video/video.mp4" ratio="4x3" title="Video Local" /%}
```
webm format
```
{% axcora-video video_webm="/video/video.mp4" ratio="4x3" title="Video Local" /%}
```

**Output:**  
{% axcora-video video_mp4="/video/axcora.mp4" ratio="4x3" title="Video 0Local" /%}

---

## 3. Component Properties

| Property  | Type   | Description                                                        |
|-----------|--------|--------------------------------------------------------------------|
| `video`     | string | Path to the video file (required)                           |
| `ratio`   | string | Aspect ratio: `21x9`, `16x9`, `4x3`, or `1x1` (required)           |
| `title`     | string | Accessible description or title for the video (recommended)         |

---

## 4. Responsive Video CSS

The video component uses a modern, fluid aspect-ratio container to ensure your video always displays correctly:

```css
.embed-21x9,
.embed-16x9,
.embed-4x3,
.embed-1x1 {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
.embed-21x9::before { padding-top: 42.857143%; }
.embed-16x9::before { padding-top: 56.25%; }
.embed-4x3::before  { padding-top: 75%; }
.embed-1x1::before  { padding-top: 100%; }
.embed-21x9 > *,
.embed-16x9 > *,
.embed-4x3 > *,
.embed-1x1 > *,
.embed-21x9 video,
.embed-16x9 video,
.embed-4x3 video,
.embed-1x1 video {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 100%; height: 100%;
  border: 0;
  border-radius: var(--radius-xl);
}
```

- **Aspect ratio** is controlled with a pseudo-element and flexibly handled container.
- **Border radius** and **box shadow** create a modern, accessible video frame on both light and dark themes.

---

## 5. Features & Best Practices

- **Native controls:** Users can play, pause, or scrub video using the browser’s built-in player UI.
- **Accessible:** Always provide a descriptive `alt` for screen reader support[1].
- **Flexible sources:** Supports local MP4s, hosted videos, and can be extended to embed streaming services (using `<iframe>` instead of `<video>`).
- **Aspect ratio:** Choose the appropriate ratio for your use case (16x9 for landscape, 4x3 for classic, etc).
- **Responsive:** Videos automatically fit parent containers, working on mobile and desktop.

---

## 6. Advanced Tips

- You may include `poster`, `autoplay`, `muted`, or `loop` attributes if your theme/component supports them, enhancing the video experience.
- For best accessibility, always supply captions when possible for longer or important videos.

---

## 7. Summary Table

| Variant         | Use Case                       | Essential Properties           |
|-----------------|-------------------------------|-------------------------------|
| Local/Hosted    | Embed `.mp4` or `webm`       | `video`, `ratio`, `title`         |
| Responsive      | Always fits container, mobile  | CSS: `.embed-16x9` (etc)      |

The **Axcora Video component** delivers modern, responsive, and accessible video integration—making it easy to enrich your content with high-quality multimedia across all devices.