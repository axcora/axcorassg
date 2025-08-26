#!/usr/bin/env node

/**
 * Simple CSS Minifier - No External Dependencies
 * Basic CSS minification for production 🗜️
 */

import fs from 'fs/promises';
import path from 'path';

const config = {
    inputDir: './static/css/dist',
    inputFile: './static/css/dist/axcora.css',
    outputFile: './static/css/dist/axcora.min.css'
};

console.log(`
🗜️  AXCORA CSS MINIFIER
====================
Minifying CSS for production...
`);

function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove whitespace around specific characters
        .replace(/\s*{\s*/g, '{')
        .replace(/;\s*/g, ';')
        .replace(/}\s*/g, '}')
        .replace(/,\s*/g, ',')
        .replace(/:\s*/g, ':')
        // Remove trailing semicolons
        .replace(/;}/g, '}')
        // Remove empty rules
        .replace(/[^{}]+{\s*}/g, '')
        // Trim
        .trim();
}

async function minify() {
    try {
        // Check if source file exists
        const cssContent = await fs.readFile(config.inputFile, 'utf-8');
        const originalSize = Buffer.byteLength(cssContent, 'utf-8');

        // Minify CSS
        const minified = minifyCSS(cssContent);
        const minifiedSize = Buffer.byteLength(minified, 'utf-8');

        // Write minified version
        await fs.writeFile(config.outputFile, minified);

        // Also create backup in static root
        await fs.writeFile('./static/axcora.min.css', minified);

        const savings = ((originalSize - minifiedSize) / originalSize * 100);

        console.log(`
🎉 MINIFICATION COMPLETED!
=========================
📏 Original size: ${(originalSize/1024).toFixed(2)} KB
🗜️  Minified size: ${(minifiedSize/1024).toFixed(2)} KB  
💾 Savings: ${savings.toFixed(1)}%
📁 Output: ${config.outputFile}

🚀 CSS is production-ready!
`);

    } catch (error) {
        console.error(`❌ Minification failed: ${error.message}`);

        // Fallback: copy original file as minified
        try {
            const cssContent = await fs.readFile('./static/axcora.css', 'utf-8');
            await fs.writeFile('./static/axcora.min.css', cssContent);
            console.log('✅ Fallback: Copied original CSS as minified version');
        } catch (fallbackError) {
            console.error(`❌ Fallback failed: ${fallbackError.message}`);
        }
    }
}

minify();