### Axcora Scrollspy

```
npm i axcora-scrollspy
```

import in to your frontmatter markdown or on axcora templating
```
---
css:
  theme: 'essentials'
  components:
    - scrollspy
js:
  - scrollspy
---
{% axcora-scrollspy section1="intro" title1="Introduction" text1_1="Welcome to the article." section2="features" title2="Features" text2_1="Feature one highlights the basics." section3="usage" title3="Usage" text3_1="Step-by-step setup." /%}
```

After including the component, you can use it both in Markdown articles and directly within your templating files.

### Implementation Example
Insert a component using the Axcora templating syntax:

3 scrollspy
```
{% axcora-scrollspy section1="intro" title1="Introduction" text1_1="Welcome to the article." section2="features" title2="Features" text2_1="Feature one highlights the basics." section3="usage" title3="Usage" text3_1="Step-by-step setup." /%}
```

5 scrollspy
```
{% axcora-scrollspy section1="intro" title1="Introduction" text1_1="Welcome to the article." text1_2="This is a brief overview." text1_3="Scroll to learn more." section2="features" title2="Features" text2_1="Feature one highlights the basics." text2_2="Feature two improves usability." text2_3="Feature three ensures accessibility." section3="usage" title3="Usage" text3_1="Step-by-step setup." text3_2="Template integration." text3_3="Content-based implementation." section4="faq" title4="FAQ" text4_1="Troubleshooting tips." text4_2="Customization options." text4_3="Support resources." /%}
```
