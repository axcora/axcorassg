import { globSync } from "glob";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import postcss from "postcss";
import cssnano from "cssnano";

const DIST_DIR = 'static/css/dist/';
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

const pages = globSync('src/templates/**/*.axcora');
const mapping = {};

pages.forEach((filepath) => {
  const filecontent = fs.readFileSync(filepath, 'utf8');
  const meta = matter(filecontent).data;
  if (!meta.css) return;

  let cssFiles = [    'static/css/axcora-base.css',
    ...meta.css.components.map(c => `static/css/components/${c}.css`),
    `static/css/themes/${meta.css.theme}/theme.css`
  ];

  let css = '';
  cssFiles.forEach(f => { if (fs.existsSync(f)) css += fs.readFileSync(f) + '\n'; });

  postcss([cssnano]).process(css, { from: undefined }).then(result => {
    let slug = path.basename(filepath, '.axcora');
    let outName = `axcora-${slug}.min.css`;
    fs.writeFileSync(path.join(DIST_DIR, outName), result.css);
    // Simpan mapping (bisa juga simpan ke json)
    mapping[slug] = outName;
    // Optionally, save mapping to JSON for SSG HTML render
    fs.writeFileSync(path.join(DIST_DIR, 'css-bundle-map.json'), JSON.stringify(mapping, null, 2));
  });
});
