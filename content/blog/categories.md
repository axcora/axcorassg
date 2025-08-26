```
title: categories and tags
```
<p>Categories
{{#each collections.uniqueCategories}}
  <a href="/categories/{{slug}}/">{{name}}</a>
{{/each}}
</p>
<p>
  Tags
{{#each collections.uniqueTags}}
  <a href="/tags/{{slug}}/" class="tags">#{{name}}</a>
{{/each}}
</p>