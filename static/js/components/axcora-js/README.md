# axcora-js

Universal JavaScript Component Suite for [Axcora SSG](https://axcora.com)

**Install:**
```
npm install axcora-js
```
Usage (SSG Frontmatter Example):
```
css:
  theme: 'essentials'
  components:
    - button
    - navbar
js:
  - navbar
  - button
  - modal
```

No manual copy required.

Components are resolved automatically by the Axcora SSG builder from either your local static/js/components/ or from node_modules/axcora-js.

Available Components:
+ accordion
+ axcora
+ button
+ carousel
+ dropdown
+ modal
+ navbar
+ scrollspy
+ search
+ tabs
+ theme
+ toast
+ youtube

Contributing - Fork, edit .js file(s) or add new ones.

Bump version in package.json.
```
npm publish --access public
```
