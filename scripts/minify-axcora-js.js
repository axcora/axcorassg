import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import UglifyJS from 'uglify-js';

const inputFile = 'static/js/axcora.js';
const outputFile = 'static/js/dist/axcora.min.js';

const outputDir = dirname(outputFile);
mkdirSync(outputDir, { recursive: true });
const originalJS = readFileSync(inputFile, 'utf8');
const result = UglifyJS.minify(originalJS, {
  compress: true,
  mangle: true,
});

if (result.error) {
  console.error('❌ Error minifying:', result.error);
  process.exit(1);
}

writeFileSync(outputFile, result.code, 'utf8');
console.log('🎉 JS minify Success:', outputFile);
