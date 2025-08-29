### Axcora carousel

```
npm i axcora-carousel
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - carousel
js:
  - carousel
---
{% axcora-carousel title1="Image 1 Title" text1="Content 1 in here" image1="/img/ax.jpg" title2="image 2 Title" text2="Content 2 in here" image2="/img/axcora.jpg" title3="Image 3 Title" text3="Content 3 in here" image3="/img/axcora1.jpg" /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

#### 3 Image Carousel

```
{% axcora-carousel title1="Image 1 Title" text1="Content 1 in here" image1="/img/ax.jpg" title2="image 2 Title" text2="Content 2 in here" image2="/img/axcora.jpg" title3="Image 3 Title" text3="Content 3 in here" image3="/img/axcora1.jpg" /%}
```

#### 5 Image Carousel

```
{% axcora-carousel title1="Image 1 Title" text1="Content 1 in here" image1="/img/ax.jpg" title2="image 2 Title" text2="Content 2 in here" image2="/img/axcora.jpg" title3="Image 3 Title" text3="Content 3 in here" image3="/img/axcora1.jpg" title4="Image 4 Title" text4="Content 4 in here" image4="/img/axs.jpg" title5="Image 5 Title" text5="Content 5 in here" image5="/img/ax-1.jpg" /%}
```
