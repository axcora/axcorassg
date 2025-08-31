---
title: "Youtube Lite"
date: "2025-08-10"
tags: 
 - youtube
 - youtube axcora
 - youtube components
category: "components"
description: "How to use youtube lite video component"
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
  - youtube
---

The **youtube-lite component** in Axcora SSG enables highly performant, low-bandwidth embedding of YouTube videos, ensuring your pages load quickly and honor modern web performance standards. It uses a "lite" embedding method, similar to Lite YouTube Embed, which defers loading the actual YouTube player until the user interacts, delivering a preview image and very small initial payload until play is requested.

**installation**

```bash
npm i axcora-youtube
```

---

## 1. Enabling the YouTube Lite Component

Add the component and its supporting JS in your template’s front-matter (for example, `templates/blog/single.axcora`):

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - video
js: 
  - youtube
---
<main>{{content}}</main>
```

After this, you may use YouTube Lite embeds anywhere in your Markdown or template content.

---

## 2. Usage Example

To embed a YouTube video in "lite" mode, provide only the YouTube video ID (not a full URL), the desired aspect ratio, and a title for accessibility:

```
{% axcora-youtube url="sBljFnEB7Sg" ratio="16x9" title="Youtube Lite Video" /%}
```

**Output:**  
{% axcora-youtube url="sBljFnEB7Sg" ratio="16x9" title="Youtube Lite Video" /%}

---

## 3. Component Properties

| Property   | Type   | Description                                             |
|------------|--------|---------------------------------------------------------|
| `url`      | string | The YouTube video’s unique ID (e.g., `sBljFnEB7Sg`)     |
| `ratio`    | string | Aspect ratio container: `16x9`, `4x3`, `21x9`, `1x1`   |
| `title`    | string | Accessible label/title for the video embed (required)   |

---

## 4. How It Works

- **Initial render:** Only a static thumbnail image and play button are displayed.
- **On click:** The actual YouTube iframe loads, saving users from loading the full video player and its dependencies upfront[5].
- **Aspect ratio:** Axcora uses a responsive CSS wrapper (per `ratio`) so your video fits any screen.

### Example HTML Output (under the hood)

```html
<lite-youtube videoid="sBljFnEB7Sg" title="Youtube Lite Video"></lite-youtube>
```

## 5. Performance & Accessibility

- **Web Vitals:** The lite embed method prevents major slowdowns and layout shifts, improving scores for site speed and delaying third-party scripts until user events[5][4].
- **Accessibility:** Always set a descriptive `title`, so screen readers and search engines can understand the embedded video[3].
- **Bandwidth savings:** Only the poster image loads at first, dramatically reducing data consumption for non-playing videos[4].

---

## 7. Best Practices

- Provide an informative title for each embedded video.
- Use _aspect ratios_ that match your page layout; common is `16x9` for landscape videos.
- Pass just the video ID, not the full YouTube URL.
- When possible, use the highest poster quality for crisp thumbnails (`maxresdefault` if available[1][2]).

---

## 8. Summary Table

| Property/Variant     | Use Case                | Example Usage                                  |
|----------------------|-------------------------|------------------------------------------------|
| `url` (video ID)     | Target video            | `url="sBljFnEB7Sg"`                            |
| `ratio`              | Aspect ratio container  | `ratio="16x9"`                                 |
| `title`              | Accessible label        | `title="Youtube Lite Video"`                   |

The **Axcora youtube-lite component** is perfect for embedding YouTube videos without significantly degrading page load and performance, making your site both fast and user-friendly.
