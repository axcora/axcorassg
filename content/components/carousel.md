---
title: "carousel"
date: "2025-08-19"
tags: 
 - carousel
 - carousel axcora
 - carousel components
category: "components"
description: "How to use carousel component"
image: "/img/ax-1.jpg"
css:
  theme: 'essentials'
  components:
    - buttons
    - carousel
    - navbar
    - table
    - breadcrumb
    - pagination
    - image
    - cards
js:
  - navbar
  - theme
  - carousel
---
The **Carousel component** in Axcora SSG allows you to create modern, interactive slideshows for images and text, enhancing visual engagement on your site. Carousels are fully responsive and accessible, enabling content rotation both within templates and Markdown content.

## Usage in Templates

To enable the carousel component, import it in your template’s front-matter, for example in `templates/blog/single.axcora` or `templates/blog/list.axcora`:

```yaml
---
layouts: base
css:
  theme: 'essentials'
  components:
    - carousel
js:
  - carousel
---
<main class="container">{{content}}</main>
```

Once imported, you can use carousel elements throughout your site in both templates and article content.

## Implementation Examples

### 3 Image Carousel

```
{% axcora-carousel title1="Image 1 Title" text1="Content 1 in here" image1="/img/ax.jpg" title2="image 2 Title" text2="Content 2 in here" image2="/img/axcora.jpg" title3="Image 3 Title" text3="Content 3 in here" image3="/img/axcora1.jpg" /%}
```
**Output:**  
{% axcora-carousel title1="Image 1 Title" text1="Content 1 in here" image1="/img/ax.jpg" title2="image 2 Title" text2="Content 2 in here" image2="/img/axcora.jpg" title3="Image 3 Title" text3="Content 3 in here" image3="/img/axcora1.jpg" /%} 

### 5 Image Carousel

```
{% axcora-carousel title1="Image 1 Title" text1="Content 1 in here" image1="/img/ax.jpg" title2="image 2 Title" text2="Content 2 in here" image2="/img/axcora.jpg" title3="Image 3 Title" text3="Content 3 in here" image3="/img/axcora1.jpg" title4="Image 4 Title" text4="Content 4 in here" image4="/img/axs.jpg" title5="Image 5 Title" text5="Content 5 in here" image5="/img/ax-1.jpg" /%}
```
**Output:**  
{% axcora-carousel title1="Image 1 Title" text1="Content 1 in here" image1="/img/ax.jpg" title2="image 2 Title" text2="Content 2 in here" image2="/img/axcora.jpg" title3="Image 3 Title" text3="Content 3 in here" image3="/img/axcora1.jpg" title4="Image 4 Title" text4="Content 4 in here" image4="/img/axs.jpg" title5="Image 5 Title" text5="Content 5 in here" image5="/img/ax-1.jpg" /%}

You can extend the number of slides as needed, simply by following the naming pattern for each new slide’s title, text, and image with max 5 slide.

## CSS Styling

The Axcora Carousel comes with advanced, modern styling features for smooth slide transitions and clear navigation, including indicator dots and navigation arrows.

```css
.carousel {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.carousel-inner {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-item {
  display: none;
  width: 100%;
  transition: transform var(--transition-slow) ease-in-out;
}

.carousel-item.active {
  display: block;
}

.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15%;
  color: white;
  opacity: 0.5;
  cursor: pointer;
  z-index: 1;
  transition: opacity var(--transition-normal);
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  opacity: 0.9;
}

.carousel-control-prev {
  left: 0;
}
.carousel-control-next {
  right: 0;
}

.carousel-control-prev-icon::before {
  content: '‹';
}

.carousel-control-next-icon::before {
  content: '›';
}

.carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
}

.carousel-indicators button.active {
  background-color: var(--p500);
}

.carousel-caption {
  position: absolute;
  right: 15%;
  bottom: 1.25rem;
  left: 15%;
  color: white;
  text-align: center;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
  border-radius: var(--radius-lg);
}
```

## Properties

| Property  | Type   | Description                              |
|-----------|--------|------------------------------------------|
| `titleX`  | string | Title for the Xth slide                  |
| `textX`   | string | Caption/description for the Xth slide    |
| `imageX`  | string | URL/path for the Xth slide image         |

Use consecutive numbering for each slide: `title1`, `text1`, `image1`, `title2`, `text2`, `image2`, etc.

## Features & Behavior

- **Responsive and touch-capable** for swiping through slides on mobile devices.
- **Navigation controls** (left/right arrows) for previous/next slide.
- **Slide indicators** for quick navigation between slides.
- **Captions** for each slide, displaying title and description.
- **Smooth CSS transitions** for a modern feel.

## Accessibility

The carousel uses proper roles and controls for accessibility, with:
- Visual focus for controls.
- Keyboard accessibility for navigation.
- Slide indicators and captions for clarity[5].

## Best Practices

- Use **high-quality images** with descriptive alt text for accessibility.
- Prefer short titles and captions for best visual appearance.
- Limit slide count to avoid overwhelming users; 3–5 slides is optimal for most cases.
- Test on both mobile and desktop browsers for best experience.

The **Axcora SSG Carousel** is ideal for portfolios, hero banners, testimonial rotations, featured content, or any scenario where visually rotating content improves engagement.