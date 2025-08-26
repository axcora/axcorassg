import fs from 'fs/promises';
import path from 'path';
import { minify } from 'terser';

export async function generatePerPageJSBundle(jsList: string[], bundleName: string): Promise<string> {
  let bundle = '';
  let callInits: string[] = [];
  for (const name of jsList) {
    try {
      const filePath = path.join(process.cwd(), 'static/js/components', `${name}.js`);
      bundle += await fs.readFile(filePath, 'utf-8') + '\n';
      // Nama fungsi init: contoh accordion -> initAccordions
      // *** Pastikan nama function TANPA 'export' pada file component.js! ***
      const fnName = 'init' + name.charAt(0).toUpperCase() + name.slice(1) + 's';
      callInits.push(`try{${fnName}();}catch(e){}`);
    } catch {}
  }
  bundle += '\n' + callInits.join('\n');
  const minified = (await minify(bundle || '')).code;
  const outPath = path.join(process.cwd(), 'static/js/dist', bundleName);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, minified ?? '', 'utf-8');
  return `/js/dist/${bundleName}`;
}
