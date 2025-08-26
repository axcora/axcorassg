#!/usr/bin/env node

/**
 * Axcora Framework Builder - FIXED VERSION
 * Compatible with existing SSG system 🚀
 */

import fs from 'fs/promises';
import path from 'path';
import {
    fileURLToPath
} from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// SIMPLIFIED build configuration
const config = {
    sourceDir: './static/css',
    outputDir: './static/css/dist',
    components: [
        // Use existing CSS structure
        'axcora-essentilas.css',
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

console.log(`
🚀 AXCORA FRAMEWORK BUILDER v1.0
================================
Building CSS Framework...
`);

async function buildFramework() {
    try {
        // Ensure directories exist
        await fs.mkdir(config.outputDir, {
            recursive: true
        });

        let cssContent = '';
        let componentCount = 0;

        // Add header
        cssContent += `/*!
 * Axcora CSS Framework v1.0.0
 * Modern Static Site Generator with Built-in CSS Framework
 * Build Date: ${new Date().toISOString()}
 */\n\n`;

        // Process existing components
        for (const component of config.components) {
            const componentPath = path.join(config.sourceDir, component);

            try {
                const content = await fs.readFile(componentPath, 'utf-8');
                cssContent += `/* === ${component.toUpperCase()} === */\n`;
                cssContent += content;
                cssContent += '\n\n';
                componentCount++;

                console.log(`✅ Processed: ${component}`);
            } catch (error) {
                console.log(`⚠️  Component ${component} not found, skipping...`);
            }
        }

        // Write main framework file
        const outputPath = path.join(config.outputDir, 'axcora.css');
        await fs.writeFile(outputPath, cssContent);

        // Also copy to root static for SSG
        await fs.writeFile('./static/axcora.css', cssContent);

        console.log(`
🎉 BUILD COMPLETED!
==================
✅ Components processed: ${componentCount}
📁 Output: ${outputPath}
📋 Also copied to: ./static/axcora.css

🚀 Framework ready for SSG integration!
`);

        return cssContent;

    } catch (error) {
        console.error(`❌ Build failed: ${error.message}`);
        process.exit(1);
    }
}

// Run build
buildFramework();