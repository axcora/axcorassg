// src/core/markdown.ts - INTEGRATED PROTECTION
import fs from "fs/promises";
import { marked } from "marked";
import { load } from "js-yaml";

interface ParsedMarkdown {
  frontmatter: Record<string, any>;
  content: string;
}

export async function parseMarkdown(filePath: string): Promise<ParsedMarkdown> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return await parseMarkdownContent(content);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error parsing markdown: ${filePath}`, errorMsg);
    throw error;
  }
}

async function parseMarkdownContent(content: string): Promise<ParsedMarkdown> {
  try {
    let frontmatter: Record<string, any> = {};
    let markdownContent = content;

    if (content.trim().startsWith('---')) {
      const frontmatterMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
      
      if (frontmatterMatch) {
        try {
          const frontmatterYaml = frontmatterMatch[1];
          const contentPart = frontmatterMatch[2];
          
          frontmatter = (load(frontmatterYaml) as Record<string, any>) || {};
          markdownContent = contentPart;
        } catch (yamlError) {
          const errorMsg = yamlError instanceof Error ? yamlError.message : 'Unknown YAML error';
          console.error("❌ Error parsing YAML frontmatter:", errorMsg);
          frontmatter = {};
          markdownContent = content;
        }
      }
    }

    // 🚀 CRITICAL FIX: PROCESS SHORTCODES BEFORE MARKDOWN!
    let processedContent = markdownContent;
    
    if (/{%\s*\w+(?:-\w+)*\s*.*?%}/.test(markdownContent)) {
      try {
        const { processShortcodes } = await import('./markdown-processor.js');
        
        const contextData = {
          ...frontmatter,
          site: {
            title: "Axcora Site",
            description: "Modern static site generator",
            url: "https://axcora.com"
          }
        };
        
        processedContent = await processShortcodes(markdownContent, contextData);
      } catch (shortcodeError) {
        console.warn("⚠️ Shortcode processing failed, using original content");
        processedContent = markdownContent;
      }
    }

    // THEN convert to HTML
    const htmlContent = await marked(processedContent);

    return {
      frontmatter,
      content: htmlContent
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ Error processing markdown content:", errorMsg);
    return {
      frontmatter: {},
      content: `<p>Error processing content: ${errorMsg}</p>`
    };
  }
}
