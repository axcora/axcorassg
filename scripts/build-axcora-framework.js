#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    sourceDir: './static/css',
    outputDir: './static/css/dist',
    components: [        'axcora-essentilas.css',
        'components/accordion.css',
        'components/alert.css',
        'components/badge.css',
        'components/blockquote.css',
        'components/breadcumb.css',
        'components/buttons.css',
        'components/cards.css',
        'components/carousel.css',
        'components/codes.css',
        'components/dropdown.css',
        'components/forms.css',
        'components/glass.css',
        'components/hero.css',
        'components/image.css',
        'components/modal.css',
        'components/navbar.css',
        'components/pagination.css',
        'components/scrollspy.css',
        'components/spinner.css',
        'components/table.css',
        'components/tabs.css',
        'components/toast.css',
        'components/video.css'
    ]
};

async function buildFramework() {
    try {
        await fs.mkdir(config.outputDir, { recursive: true });
        let cssContent = '';
        let componentCount = 0;

        cssContent += `/*!
 * Axcora CSS Framework v1.0.0
 * Modern Static Site Generator with Built-in CSS Framework
 * Build Date: ${new Date().toISOString()}
 */\n\n`;

        for (const component of config.components) {
            const componentPath = path.join(config.sourceDir, component);
            try {
                const content = await fs.readFile(componentPath, 'utf-8');
                cssContent += `/* === ${component.toUpperCase()} === */\n`;
                cssContent += content;
                cssContent += '\n\n';
                componentCount++;
                // (No per-file log)
            } catch (error) {
                // (No warning)
            }
        }

        const outputPath = path.join(config.outputDir, 'axcora.css');
        await fs.writeFile(outputPath, cssContent);
        await fs.writeFile('./static/axcora.css', cssContent);

        // *** Hanya log 1 baris summary saja ***
        console.log(`[AXCORA CSS] ${componentCount} components, output: static/css/dist/axcora.css`);

        return cssContent;

    } catch (error) {
        console.error(`❌ Build failed: ${error.message}`);
        process.exit(1);
    }
}

buildFramework();
