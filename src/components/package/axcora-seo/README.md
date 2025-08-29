### Axcora seo

```
npm i axcora-seo
```

import in to your layouts templating, for example on `src/layouts/base.axcora`
```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Axcora SEO -->
{% axcora-seo /%}
<!-- 🚀 AXCORA CSS FRAMEWORK - ALL IN ONE -->  
{{ cssLinks }}
</head>
<body>
{% include header.axcora %}
{{ content }}
{% include footer.axcora %}
</body>
</html>
```
