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

let total = 0; // counter

pages.forEach((filepath) => {
  const filecontent = fs.readFileSync(filepath, 'utf8');
  const meta = matter(filecontent).data;
  if (!meta.css) return;

  let cssFiles = [    'static/css/axcora-base.css',
    ...(meta.css.components||[]).map(c => `static/css/components/${c}.css`),
    `static/css/themes/${meta.css.theme}/theme.css`
  ];

  let css = '';
  cssFiles.forEach(f => { if (fs.existsSync(f)) css += fs.readFileSync(f) + '\n'; });

  postcss([cssnano]).process(css, { from: undefined }).then(result => {
    let slug = path.basename(filepath, '.axcora');
    let outName = `axcora-${slug}.min.css`;
    fs.writeFileSync(path.join(DIST_DIR, outName), result.css);
    mapping[slug] = outName;
    fs.writeFileSync(path.join(DIST_DIR, 'css-bundle-map.json'), JSON.stringify(mapping, null, 2));
    total++;
    // ONLY log after ALL done
    if (total === pages.length) {
      // Only print summary once everything is done
      console.log(`[AXCORA CSS-PAGES] Bundled ${total} css pages to static/css/dist`);
    }
  });
});
