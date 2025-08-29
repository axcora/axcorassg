import fs from "fs/promises";
import path from "path";
import { load } from "js-yaml";
import { marked } from "marked";
import chalk from "chalk";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Post {
  title: string;
  date: string | Date;
  slug: string;
  url: string;
  image: string;
  excerpt?: string;
  description?: string;
  author?: string;
  content: string;
  tags?: string[];
  category?: string;
  filePath: string;
  [key: string]: any;
}

export interface Collections {
  posts: Post[];
  site: any;
//  pages: Post[];
  [key: string]: any;
}

function getCollectionFromPath(filePath: string): string {
  const relativePath = path.relative(path.join(process.cwd(), 'content'), filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || 'pages';
}

function generateExcerpt(content: string, length: number = 150): string {
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/$$([^$$]+)$$$$[^)]+$$/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .trim();
    
  if (cleanContent.length <= length) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, length).trim() + '...';
}

export async function buildCollections(): Promise<Collections> {
 // console.log(chalk.blue("📦 Building collections..."));
  
  try {
    const site = await loadSiteData();
//    console.log(chalk.green("✅ Site data loaded:", site.title));
    
    const collections: Collections = { 
      posts: [], 
//      pages: [], 
      site,
      tags: {},
      categories: {},
      recent: []
    };
    
    try {
      const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
      
      // Load static pages from root content/
      const staticPages = await loadStaticPages();
      if (staticPages.length > 0) {
        collections.pages = staticPages;
  //      console.log(chalk.green(`✅ ${staticPages.length} static pages loaded`));
      }
      
      // Load collections from subdirectories
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== '_data') {
          const collectionName = entry.name;
   //       console.log(chalk.blue(`📂 Found collection: ${collectionName}`));
          
          const items = await loadCollection(collectionName);
          
          if (items.length > 0) {
            collections[collectionName] = items;
     //       console.log(chalk.green(`✅ ${items.length} ${collectionName} items loaded`));
          }
        }
      }
    } catch (error) {
      console.error(chalk.red("❌ Error reading content directory:"), error);
    }
    
    // Set posts as alias for blog collection
    if (collections.blog) {
      collections.posts = collections.blog;
    }
    
    // Build tags and categories
    buildTagsAndCategories(collections);
    
    // Build recent posts
    collections.recent = buildRecent(collections);
        collections.uniqueCategories = Object.keys(collections.categories).map(categoryName => ({
      name: categoryName,
      slug: slugify(categoryName)
    }));

    // Build list tags unik dg slug
    collections.uniqueTags = Object.keys(collections.tags).map(tagName => ({
      name: tagName,
      slug: slugify(tagName)
    }));
    
    const tagCount = Object.keys(collections.tags).length;
    const categoryCount = Object.keys(collections.categories).length;
    
    if (tagCount > 0) console.log(chalk.green(`✅ ${tagCount} tags found`));
    if (categoryCount > 0) console.log(chalk.green(`✅ ${categoryCount} categories found`));
    
    return collections;
    
  } catch (error) {
    console.error(chalk.red("❌ Failed to build collections:"), error);
    throw error;
  }
}

async function loadSiteData() {
  try {
    const siteFile = path.join(CONTENT_DIR, "_data", "site.yml");
    
    try {
      await fs.access(siteFile);
    } catch {
      console.log(chalk.yellow("⚠️ site.yml not found, using defaults"));
      return getDefaultSiteConfig();
    }
    
    const siteContent = await fs.readFile(siteFile, "utf-8");
    const siteData = load(siteContent) as any;
    
    return {
      ...getDefaultSiteConfig(),
      ...siteData
    };
  } catch (error) {
    console.error(chalk.red("❌ Error loading site config:"), error);
    return getDefaultSiteConfig();
  }
}

function getDefaultSiteConfig() {
  return {
    title: "Axcora Tech",
    description: "All-In-One Modern static site generator CSS Framework Components",
    author: "Axcora Tech",
    url: "http://localhost:3000",
    logo: "AXCORA",
    logo_text: "AXCORA",
    logo_image: "/img/logo.png",
    favicon: "/img/logo.png",
    navbar: [
      { title: "Home", url: "/" },
      { title: "Blog", url: "/blog/" },
      { title: "Tags", url: "/tags/" },
      { title: "Categories", url: "/categories/" },
      { title: "About", url: "/about/" }
    ],
    social: [
      { name: "GitHub", url: "https://github.com/axcora", icon: "📦" },
      { name: "Twitter", url: "https://twitter.com/axcora", icon: "🐦" }
    ],
    search: {
      enabled: true,
      placeholder: "Search posts..."
    },
    blog: {
      posts_per_page: 6,
      show_excerpts: true
    }
  };
}

async function loadStaticPages(): Promise<Post[]> {
  const pages: Post[] = [];
  
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const mdFiles = files.filter(file => 
      file.endsWith('.md') && file !== 'index.md'
    );
    
    for (const file of mdFiles) {
      try {
        const filePath = path.join(CONTENT_DIR, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isFile()) {
          const page = await parseMarkdownFile(filePath);
          if (page) {
            const slug = file.replace('.md', '');
            pages.push({
              ...page,
              slug,
              url: `/${slug}/`,
              layout: page.layout || page.layouts || 'page'
            });
          }
        }
      } catch (fileError) {
        console.error(chalk.red(`❌ Error processing static page ${file}:`), fileError);
      }
    }
    
    return pages;
  } catch (error) {
    return [];
  }
}

async function loadCollection(collectionName: string): Promise<Post[]> {
  const items: Post[] = [];
  
  try {
    const collectionPath = path.join(CONTENT_DIR, collectionName);
    await fs.access(collectionPath);
    
    const files = await fs.readdir(collectionPath);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    for (const file of mdFiles) {
      try {
        const filePath = path.join(collectionPath, file);
        const item = await parseMarkdownFile(filePath);
        
        if (item) {
          const slug = file.replace('.md', '');
          items.push({
            ...item,
            slug,
            url: `/${collectionName}/${slug}/`
          });
        }
      } catch (fileError) {
        console.error(chalk.red(`❌ Error processing file ${file}:`), fileError);
      }
    }
    
    // Sort by date (newest first)
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return items;
    
  } catch (error) {
    return [];
  }
}

// src/core/collections.ts - FIX parseMarkdownFile
async function parseMarkdownFile(filePath: string): Promise<Post | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    const frontmatterMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      return null;
    }
    
    const frontmatter = load(frontmatterMatch[1]) as any || {};
    const markdownContent = frontmatterMatch[2];
    
    // Check if shortcodes exist in content
    const hasShortcodes = /{%\s*\w+(?:-\w+)*\s*.*?%}/.test(markdownContent);
    
    let processedContent = markdownContent;
    
    if (hasShortcodes) {
      const fileName = path.basename(filePath);
 //     console.log(chalk.cyan(`🔍 Found shortcodes in ${fileName}`));
      
      try {
        // Dynamic import to avoid circular dependency
        const { processShortcodes } = await import('./markdown-processor.js');
        
        const contextData = {
          ...frontmatter,
          site: {
            title: "Axcora Tecg",
            description: "Modern static site generator",
            url: "https://axcora.com"
          }
        };
        
        // Process shortcodes BEFORE markdown conversion
        processedContent = await processShortcodes(markdownContent, contextData);
        
        // Check if processing was successful
        const remainingShortcodes = /{%\s*\w+(?:-\w+)*\s*.*?%}/.test(processedContent);
        
        if (!remainingShortcodes) {
   //       console.log(chalk.green(`✅ All shortcodes processed in ${fileName}`));
        } else {
//          console.warn(chalk.yellow(`⚠️ Some shortcodes remain unprocessed in ${fileName}`));
        }
        
      } catch (shortcodeError) {
        console.error(chalk.red(`❌ Shortcode processing failed for ${filePath}:`), shortcodeError);
        console.warn(chalk.yellow('   Falling back to original content'));
        processedContent = markdownContent; // Fallback to original
      }
    }
    
    // Convert to HTML AFTER shortcode processing
    const htmlContent = marked(processedContent);
    
    // Normalize tags
let tags = frontmatter.tags || [];
if (typeof tags === 'string') {
  tags = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
} else if (!Array.isArray(tags)) {
  tags = [];
}
// Normalisasi ke lowercase dan hapus duplikat
tags = Array.from(
  new Set(
    tags.map((t: string) => t.trim().toLowerCase())
  )
);
    
    const excerpt = frontmatter.excerpt || generateExcerpt(markdownContent);
    
    return {
      ...frontmatter,
      content: htmlContent,
      filePath,
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      title: frontmatter.title || path.basename(filePath, '.md').replace(/-/g, ' '),
      excerpt,
      description: frontmatter.description,
      
  image: frontmatter.image ? String(frontmatter.image).trim() : null,
      author: frontmatter.author || 'Unknown',
      tags,
      category: frontmatter.category || undefined,
  category_slug: frontmatter.category ? slugify(frontmatter.category) : undefined,
      layout: frontmatter.layout || frontmatter.layouts || undefined
    } as Post;
  } catch (error) {
    console.error(chalk.red(`❌ Error parsing markdown file ${filePath}:`), error);
    return null;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function buildTagsAndCategories(collections: Collections) {
  const tags: Record<string, Post[]> = {};
  const categories: Record<string, Post[]> = {};
  
  Object.entries(collections).forEach(([collectionName, items]) => {
    if (collectionName === 'site' || !Array.isArray(items)) return;
    
    items.forEach((post: Post) => {
      // Process tags
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (!tags[tag]) tags[tag] = [];
          tags[tag].push(post);
        });
      }
      
      // Process categories
      if (post.category) {
        if (!categories[post.category]) categories[post.category] = [];
        categories[post.category].push(post);
      }
    });
  });
  
  collections.tags = tags;
  collections.categories = categories;
}

function buildRecent(collections: Collections, limit: number = 5): Post[] {
  const allItems: Post[] = [];
  
  Object.entries(collections).forEach(([collectionName, items]) => {
    if (['site', 'tags', 'categories', 'recent', 'posts', 'pages'].includes(collectionName)) {
      return;
    }
    
    if (Array.isArray(items)) {
      allItems.push(...items);
    }
  });
  
  return allItems
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function loadPageContent(filename: string) {
  try {
    const filePath = path.join(CONTENT_DIR, `${filename}.md`);
    
    try {
      await fs.access(filePath);
    } catch {
      return null;
    }
    
    const parsed = await parseMarkdownFile(filePath);
    
    if (parsed) {
      return {
        ...parsed,
        slug: filename,
        url: filename === 'index' ? '/' : `/${filename}/`
      };
    }
    
    return null;
  } catch (error) {
    console.error(chalk.yellow(`⚠️ Error loading ${filename}.md:`), error);
    return null;
  }
}

