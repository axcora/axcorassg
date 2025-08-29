import fs from "fs/promises";
import path from "path";
import { generatePerPageJSBundle } from './js-bundle-builder.js';
import { generatePerPageCSSBundle } from './css-bundle-builder.js';
import { buildCollections, loadPageContent } from "./collections.js";
import chalk from "chalk";
import { load } from "js-yaml";
import { PluginManager } from './plugin-manager.js';
import { loadConfig } from '../config/index.js';
import { ComponentParser, setComponentParser } from './component-parser.js';
import { renderAxcora, processComponents } from "./engine.js";
import { EnhancedCSSLoader } from './enhanced-css-loader.js';
import { CSSThemeIntegration } from '../template-engine/css-theme-integration.js';

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const TEMPLATES_DIR = path.join(process.cwd(), "src", "templates");
const STATIC_DIR = path.join(process.cwd(), "static");

const CSS_BUNDLE_MAP_PATH = path.join(process.cwd(), "static/css/dist/css-bundle-map.json");
let cssBundleMap: Record<string, string> = {};

// FUNGSI UNTUK LOAD MAPPING BUNDLE
async function loadCssBundleMap() {
  try {
    const data = await fs.readFile(CSS_BUNDLE_MAP_PATH, "utf-8");
    cssBundleMap = JSON.parse(data);
  } catch (err) {
    cssBundleMap = {};
  }
}

// ===== DYNAMIC CSS CONFIGURATION =====
interface CssConfig {
  components?: string[];
  theme?: string;
  utilities?: string[];
}

function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// 🚀 NEW: BUILD INFO INTERFACE
interface BuildInfo {
  generator: {
    name: string;
    version: string;
    timestamp: string;
    environment: string;
    commit?: string;
  };
}

// 🎯 FIXED META GENERATOR CLASS
class MetaGenerator {
  private buildInfo: BuildInfo;

  constructor() {
    this.buildInfo = this.initializeBuildInfo();
  }

  private initializeBuildInfo(): BuildInfo {
    const packageJson = this.loadPackageJson();
    
    return {
      generator: {
        name: packageJson.name || 'Axcora SSG',
        version: packageJson.version || '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        commit: this.getGitCommit()
      }
    };
  }

  private loadPackageJson() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const content = require(packagePath);
      return content;
    } catch {
      return { name: 'Axcora ', version: '1.0.0' };
    }
  }

  private getGitCommit(): string | undefined {
    try {
      const { execSync } = require('child_process');
      return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch {
      return undefined;
    }
  }

  generateMetaGenerator(): string {
    const { generator } = this.buildInfo;
    
    let content = `${generator.name} v${generator.version}`;
    
    if (generator.environment !== 'production') {
      content += ` (${generator.environment})`;
    }
    
    if (generator.commit && generator.environment === 'development') {
      content += ` - ${generator.commit}`;
    }

    return `<meta name="generator" content="${content}">`;
  }

  getBuildInfo(): BuildInfo {
    return this.buildInfo;
  }
}

// 🚀 INSTANTIATE META GENERATOR
const metaGenerator = new MetaGenerator();

function generateCssLinks(cssConfig?: CssConfig, globalTheme?: string): string {
  if (!cssConfig) {
    return '<link rel="stylesheet" href="/css/axcora-base.css" media="all">';
  }

  const links: string[] = [
    '<link rel="stylesheet" href="/css/axcora-base.css" media="all">'
  ];

  // Process components
  if (cssConfig.components) {
    const components = Array.isArray(cssConfig.components) ? cssConfig.components : [cssConfig.components];
    components.forEach(component => {
      links.push(`<link rel="stylesheet" href="/css/components/${component}.css" media="all">`);
    });
  }

  // Process theme - prioritize CSS theme over global theme
  const selectedTheme = cssConfig.theme || globalTheme || 'default';
  if (selectedTheme && selectedTheme !== 'default') {
    links.push(`<link rel="stylesheet" href="/css/themes/${selectedTheme}/theme.css" media="all">`);
  }

  // Process utilities
  if (cssConfig.utilities) {
    const utilities = Array.isArray(cssConfig.utilities) ? cssConfig.utilities : [cssConfig.utilities];
    utilities.forEach(utility => {
      links.push(`<link rel="stylesheet" href="/css/${utility}.css" media="all">`);
    });
  }

  return links.join('\n');
}

function deduplicatePosts(posts: any[]): any[] {
  const seen = new Set();
  return posts.filter(post => {
    if (seen.has(post.url)) {
      return false;
    }
    seen.add(post.url);
    return true;
  });
}

export async function build(options: { isDev: boolean }) {
  process.env.NODE_ENV = options.isDev ? 'development' : 'production';
  const isDev = options.isDev;
  await loadCssBundleMap();
  const cssLoader = new EnhancedCSSLoader('./static/css', './dist/css');
  const themeIntegration = new CSSThemeIntegration(cssLoader);
  
  try {
    const config = await loadConfig();
        // ONLY CLEAN FOLDER IN PRODUCTION!
    if (!isDev) {
      await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
      await fs.mkdir(PUBLIC_DIR, { recursive: true });
    } else {
      try { await fs.mkdir(PUBLIC_DIR, { recursive: true }); } catch {}
    }
    // full reubild
    await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    // CRITICAL FIX: Load components FIRST before everything else
//    console.log(chalk.blue("🧩 Loading components..."));
    const componentParser = new ComponentParser();
    await componentParser.loadComponents();
    setComponentParser(componentParser);
    
    const loadedComponents = componentParser.getComponentNames();
  //  console.log(chalk.green(`✅ ${loadedComponents.length} components loaded: ${loadedComponents.join(', ')}`));

    // THEN build collections (markdown processing will have components available)
//    console.log(chalk.blue("📦 Building collections..."));
    const collections = await buildCollections();
	
    const pluginManager = new PluginManager(config, collections);
    await pluginManager.loadPlugins();
    
    await pluginManager.executeHook('setup');
    await pluginManager.executeHook('buildStart');
    
    // Continue with rest of build...
    if (!isDev) {
      console.log(chalk.cyan("📊 Collections:"));
      Object.entries(collections).forEach(([key, value]) => {
        if (key === 'site') {
          console.log(chalk.blue(`  ${key}: ${(value as any).title || 'config'}`));
        } else if (Array.isArray(value)) {
          console.log(chalk.blue(`  ${key}: ${value.length} items`));
        }
      });
    }
    
    // Generate collections
    for (const [collectionName, items] of Object.entries(collections)) {
      if (['site', 'tags', 'categories', 'recent', 'posts', 'pages', 'uniqueTags', 'uniqueCategories'].includes(collectionName)) {
        continue;
      }
      
      if (Array.isArray(items) && items.length > 0) {
        await generateCollectionPages(collections, collectionName, items, pluginManager, isDev);
      }
    }

    if (collections.pages && collections.pages.length > 0) {
      await generateStaticPages(collections, pluginManager, isDev);
    }

    if (collections.tags && Object.keys(collections.tags).length > 0) {
      await generateTagsPages(collections, pluginManager, isDev);
    }

    if (collections.categories && Object.keys(collections.categories).length > 0) {
      await generateCategoriesPages(collections, pluginManager, isDev);
    }

    await generateHomepage(collections, pluginManager);
    await generate404Page(collections, pluginManager);
	
	    await copyStaticFiles(isDev);
	try {
  await fs.mkdir(path.join(PUBLIC_DIR, "css", "dist"), { recursive: true });
  await fs.cp(
    path.join(process.cwd(), "static/css/dist"),
    path.join(PUBLIC_DIR, "css/dist"),
    { recursive: true }
  );
//  console.log('✅ [BUILD] Copied CSS bundle to public/css/dist');
} catch (err) {
  console.warn('⚠️ [BUILD] Error copying CSS bundle', err);
}
	
    await generateSearchIndex(collections, isDev);
    await generateRSSFeed(collections, isDev);
    await generateSitemap(collections, isDev);
    
    await pluginManager.executeHook('generateAssets');
    await pluginManager.executeHook('buildEnd');
    
    if (!isDev) {

      console.log(chalk.green('✅ Build completed successfully!'));
      console.log(chalk.blue(`📁 Output: ${PUBLIC_DIR}`));
      // 🎯 NEW: Show generator info
      console.log(chalk.cyan(`🚀 ${metaGenerator.generateMetaGenerator().replace('<meta name="generator" content="', '').replace('">', '')}`));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Build failed:'), error);
    throw error;
  }
}

async function copyStaticFiles(isDev: boolean) {
  try {
    await fs.access(STATIC_DIR);
    await fs.cp(STATIC_DIR, PUBLIC_DIR, { recursive: true });
    if (!isDev) console.log(chalk.green("✅ Static files copied"));
  } catch {
    // Static folder doesn't exist, that's fine
  }
}

async function generateCollectionPages(collections: any, collectionName: string, items: any[], pluginManager: PluginManager, isDev: boolean) {
  const POSTS_PER_PAGE = collections.site.blog?.posts_per_page || 5;
  const totalPages = Math.ceil(items.length / POSTS_PER_PAGE);

  await ensureTemplatesExist(collectionName, isDev);

  // Generate list pages
  for (let page = 0; page < totalPages; page++) {
    const paginatedItems = items
    .slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE)
      .map(item => ({
    ...item,
    tagsSlugged: (item.tags || []).map((tag: string) => ({
      name: tag,
      slug: slugify(tag)
    })),
      categorySlug: item.category ? slugify(item.category) : ''
  }));
    let prevLink = '';
    let nextLink = '';
    
    if (page > 0) {
      if (page === 1) {
        prevLink = `/${collectionName}/`;
      } else {
        prevLink = `/${collectionName}/page/${page}/`;
      }
    }
    
    if (page < totalPages - 1) {
      nextLink = `/${collectionName}/page/${page + 2}/`;
    }
const pagination = {
  hasPrev: page > 0,
  hasNext: page < totalPages - 1,
  prevLink: page > 0 
    ? (page === 1 
        ? `/${collectionName}/` 
        : `/${collectionName}/page/${page}/`
      ) 
    : undefined,
  nextLink: page < totalPages - 1 
    ? `/${collectionName}/page/${page + 2}/` 
    : undefined,
  currentPage: page + 1,
  totalPages
};

    const outputPath = page === 0 
      ? path.join(PUBLIC_DIR, collectionName, "index.html")
      : path.join(PUBLIC_DIR, collectionName, "page", String(page + 1), "index.html");

    await renderPageWithPlugins(
      `${collectionName}/list.axcora`,
      { 
        title: `${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}${page > 0 ? ` - Page ${page + 1}` : ''}`,
        description: `${collectionName} posts${page > 0 ? ` page ${page + 1}` : ''}`,
        posts: paginatedItems,
        items: paginatedItems,
        pagination,
        site: collections.site,
        collections,
        url: `/${collectionName}/${page > 0 ? `page/${page + 1}/` : ''}`
      },
      outputPath,
      pluginManager
    );
    
  }

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const prev = items[i + 1] || null;
  const next = items[i - 1] || null;

  // FIXED: tipe tag pada parameter map → (tag: string)
  const tagsSlugged = (item.tags || []).map((tag: string) => ({
    name: tag,
    slug: slugify(tag)
  }));
const categorySlug = item.category ? slugify(item.category) : '';
  await renderPageWithPlugins(
    `${collectionName}/single.axcora`,
    { 
      ...item,
      prev, 
      next,
      site: collections.site,
      tagsSlugged,
    categorySlug,
      collections
    },
    path.join(PUBLIC_DIR, collectionName, item.slug, "index.html"),
    pluginManager
  );
}


}

async function renderPageWithPlugins(templatePath: string, data: any, outputPath: string, pluginManager: PluginManager) {
	
	
  const fullTemplatePath = path.join(TEMPLATES_DIR, templatePath);
  
  try {
    const templateContent = await fs.readFile(fullTemplatePath, "utf-8");
    
    let frontmatter: any = {};
    let content = templateContent;
    
    if (templateContent.startsWith('---')) {
      const frontmatterMatch = templateContent.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
      if (frontmatterMatch) {
        try {
          frontmatter = load(frontmatterMatch[1]) as any || {};
          content = frontmatterMatch[2];
        } catch (yamlError) {
          console.error(chalk.yellow(`⚠️ YAML parse error in ${templatePath}`));
        }
      }
    }
    
    const siteData = data.site || data.collections?.site || {};
    
    const completeData = {
      collections: data.collections || {},
      ...frontmatter,
      ...data,
      site: {
        title: "Axcora Framework",
        description: "All-in-one Static site generator plus CSS Framework - Axcora", 
        author: "Axcora Tech",
        url: "https://axcora.com",
        lang: "en",
        ...siteData,
        ...(data.site || {})
      }
    };
    // ===== INJECT CSS BUNDLE PER PAGE (OTOMATIS) =====
    
// Ambil konfigurasi dari data/completeData
const cssConfig: CssConfig = completeData.css || {};
const globalTheme: string = completeData.theme || '';

const baseName = path.basename(templatePath, path.extname(templatePath)); // Single, List, Archive etc
function hashConfig(str: string) {
    let hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Gabungkan semua properti css, supaya hasil hash unik per konfigurasi
const bundleSeed = [  baseName,
  ...(cssConfig.components || []),
  ...(cssConfig.utilities || []),
  (cssConfig.theme && cssConfig.theme !== 'default') ? cssConfig.theme : ''
].filter(Boolean).join('-');

const bundleHash = hashConfig(bundleSeed);

const bundleName = `axcora${bundleHash}.min.css`; // <--- hasil akhirnya SINGKAT!

// ===== PER-PAGE JS BUNDLE =====
const jsList = completeData.js || [];
const jsSeed = jsList.filter(Boolean).join('-');
const jsHash = hashConfig(jsSeed); // Pakai fungsi hash yang sama dengan css, deklarasikan di builder.ts jika belum ada
const jsBundleName = `axcora${jsHash}.min.js`;


const siteUrl = completeData.site && completeData.site.url ? completeData.site.url.replace(/\/$/, '') : '';
const perPageCssLink = await generatePerPageCSSBundle(cssConfig, globalTheme, bundleName);

completeData.cssLinks = `<link rel="stylesheet" href="${siteUrl}${perPageCssLink}" media="all">`;


const perPageJsLink = await generatePerPageJSBundle(jsList, jsBundleName);
completeData.jsLinks = `<script src="${siteUrl}${perPageJsLink}"></script>`;


    // 🚀 NEW: INJECT META GENERATOR =====
    completeData.metaGenerator = metaGenerator.generateMetaGenerator();
    completeData.buildInfo = metaGenerator.getBuildInfo();
    completeData.title = completeData.title || completeData.site.title;
    completeData.description = completeData.description || completeData.site.description;
    completeData.author = completeData.author || completeData.site.author;
    // Transform with plugins and process components
    content = await pluginManager.transformTemplate(content);
    content = await processComponents(content, completeData);
    
    let html = content;
    
    if (frontmatter.layouts || frontmatter.layout) {
      const layoutName = frontmatter.layouts || frontmatter.layout;
      let layoutPath = path.join(TEMPLATES_DIR, "layouts", `${layoutName}.axcora`);
      let layoutContent;

      try {
        // Coba di /layouts/
        layoutContent = await fs.readFile(layoutPath, "utf-8");
      } catch (err) {
        // Kalau gagal, coba root /templates/
        layoutPath = path.join(TEMPLATES_DIR, `${layoutName}.axcora`);
        try {
          layoutContent = await fs.readFile(layoutPath, 'utf-8');
        } catch (err2) {
          // Layout tidak ada di dua lokasi, log error & fallback
          console.error(
            chalk.red(`❌ Layout '${layoutName}' not found in either:\n- ${path.join(TEMPLATES_DIR, 'layouts', layoutName + '.axcora')}\n- ${path.join(TEMPLATES_DIR, layoutName + '.axcora')}`)
          );
          html = renderAxcora(html, completeData);
          layoutContent = null;
        }
      }
      
      if (layoutContent) {
        try {
          layoutContent = await pluginManager.transformTemplate(layoutContent);
          layoutContent = await processComponents(layoutContent, completeData);
          const layoutData = { 
            ...completeData,
            content: renderAxcora(html, completeData)
          };
          html = renderAxcora(layoutContent, layoutData);
        } catch (layoutError) {
          console.error(chalk.red(`❌ Layout error for ${layoutName}:`), layoutError);
          html = renderAxcora(html, completeData);
        }
      }
    } else {
      html = renderAxcora(html, completeData);
    }

    if (completeData.jsLinks) {
   html = html.replace('</body>', `${completeData.jsLinks}\n</body>`);
}
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, "utf-8");
  } catch (error) {
    console.error(chalk.red(`❌ Error rendering ${templatePath}:`), error);
    throw error;
  }
}

async function generateHomepage(collections: any, pluginManager: PluginManager) {
  try {
//    console.log(chalk.blue("🏠 Generating homepage..."));
    
    const indexContent = await loadPageContent('index');
    
    // 🔧 FIX: Pastikan blog posts dengan URL dan data lengkap
    const blogPosts = collections.blog || [];
    
    // 🐛 DEBUG: Log blog posts info
  //  console.log(chalk.cyan(`📝 Blog posts for homepage: ${blogPosts.length} found`));
    if (blogPosts.length > 0) {
//      console.log(chalk.blue(`🔗 Sample post: ${blogPosts[0]?.title} -> ${blogPosts[0]?.url}`));
    }
    
    // ✅ FIX: Pastikan setiap post punya URL yang benar
    const postsForHomepage = blogPosts.slice(0, 6).map((post: any) => {
      // Pastikan URL format yang benar
      const url = post.url || `/blog/${post.slug}/`;
      
      return {
        ...post,
        url: url,
        // Pastikan data essential ada
        title: post.title || 'Untitled Post',
        image: post.image,
        tag: post.tags,
        category: post.category,
        excerpt: post.excerpt || post.description || 'Read more about this post...',
        date: post.date || new Date().toISOString(),
        slug: post.slug
      };
    });
    
    const homeData = {
      // ✅ Collections dengan data lengkap
      collections: {
        ...collections,
        blog: blogPosts
      },
      // ✅ Site data
      site: {
        title: "Axcora Framework",
        description: "Modern static site generator with built-in CSS framework",
        url: "https://axcora.com",
        ...collections.site
      },
      // ✅ Homepage specific data
      title: indexContent?.title || collections.site?.title || "Welcome to Axcora",
      description: indexContent?.description || collections.site?.description || "Modern static site generator", 
      image: indexContent?.image|| collections.site?.image || "/img/ax-1.jpg", 
      author: indexContent?.author || collections.site?.author || "Axcora Tech",
      // ✅ Posts dengan URL yang sudah diperbaiki
      posts: postsForHomepage,
      // ✅ Flags
      show_blog_list: true,
      url: '/',
      // ✅ Merge dengan content dari index.md jika ada
      ...(indexContent || {})
    };
    
    // 🐛 DEBUG: Log home data
  //  console.log(chalk.cyan(`📊 Homepage data: ${homeData.posts.length} posts ready`));
    
    // ✅ Render index.axcora template directly
    await renderPageWithPlugins(
      'index.axcora', 
      homeData, 
      path.join(PUBLIC_DIR, "index.html"), 
      pluginManager
    );
    
//    console.log(chalk.green("✅ Homepage generated successfully"));
    
  } catch (error) {
    console.error(chalk.red("❌ Homepage generation failed:"), error);
    
    // 🚨 Fallback: Create simple homepage
    const fallbackHTML = `<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Axcora Framework | Homepage Template Error</title>
  <meta name="description" content="Modern static site generator, homepage template not found or error.">
  <style>
    body {
      background: linear-gradient(135deg, #181c28 0%, #232946 100%);
      min-height: 100vh;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    }
    .container {
      background: rgba(34, 37, 51, 0.98);
      border-radius: 22px;
      max-width: 440px;
      padding: 2.5rem 2rem 2rem 2rem;
      box-shadow: 0 6px 32px 0 rgba(18,21,40,0.24), 0 1.5px 8px 0 rgba(70,71,148,0.10);
      text-align: center;
      color: #eceffd;
      position: relative;
    }
    .logo {
      width: 64px;
      height: 64px;
      border-radius: 14px;
      background: #232946;
      margin: 0 auto 1.5rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(60,70,95,.13);
    }
    .logo img {
      width: 42px;
      height: 42px;
      object-fit: contain;
      filter: drop-shadow(0 0 1px #fff5) brightness(1.11);
      opacity: 0.93;
    }
    h1 {
      font-size: 2.4rem;
      margin: 0 0 0.4em 0;
      font-weight: 900;
      line-height: 1.07;
      letter-spacing: -1px;
      color: #ff37a4;
      text-shadow:
        0 4px 24px #471c3480,
        0 1px 0 #232946;
    }
    .subtitle {
      font-size: 1.07rem;
      font-weight: 600;
      color: #aeadfe;
      margin-bottom: 0.7em;
      letter-spacing: 1.1px;
      text-transform: uppercase;
    }
    .desc {
      font-size: 1.16rem;
      color: #b3b6c7;
      margin: 0.45em 0 2em 0;
      font-weight: 400;
    }
    .brand {
      font-size: 1.15rem;
      color: #f9a826;
      margin-bottom: 0.2em;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1.7px;
      font-family: 'Montserrat', 'Inter', Arial, sans-serif;
    }
    .tagline {
      color: #c0cafc;
      margin-bottom: 1.2em;
      font-size: 1.03rem;
    }
    .cta {
      display: inline-block;
      font-size: 1rem;
      background: linear-gradient(90deg, #ff37a4 0%, #5be3c8 100%);
      color: #232946;
      border-radius: 40px;
      font-weight: 600;
      text-decoration: none;
      padding: 0.90em 2.1em;
      letter-spacing: 0.9px;
      transition: background 0.17s, color 0.17s, box-shadow 0.22s;
      box-shadow: 0 3px 18px 0 #2e273c29;
      border: none;
      outline: none;
    }
    .cta:hover,
    .cta:focus {
      background: linear-gradient(90deg, #ed5e5e 0%, #ffb951 100%);
      color: #181c28;
      box-shadow: 0 2px 16px 0 #ed5e5e44;
    }
    .explore {
      margin-top: 1.6em;
    }
    @media (max-width: 500px) {
      .container { padding: 1.1rem 0.35rem 2.0rem 0.35rem; max-width: 97vw;}
      h1 {font-size: 1.7rem;}
      .logo {width:44px;height:44px;}
      .desc {font-size: 1rem;}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="/img/logo.jpg" alt="Axcora Logo" loading="lazy">
    </div>
    <div class="subtitle">Homepage Template Error</div>
    <h1>Axcora Framework</h1>
    <div class="brand">axcora technology</div>
    <div class="tagline">All-in-one Static Site Generator<br>and CSS Framework</div>
    <div class="desc">
      Could not find or render the file <strong>index.axcora</strong>.<br>
Please check and fix your homepage template.<br>
You can still browse the blog, or other features.
    </div>
    <a href="/blog/" class="cta">Browse Blog →</a>
    <div class="explore">
      <a href="/docs/" class="cta" style="background:linear-gradient(90deg, #4fdaf8 0%, #8ce57a 100%);color:#232946;margin-right:0.5em;">📚 Documentation</a>
      <a href="/" class="cta" style="background:linear-gradient(90deg, #ed5e5e 0%, #ffb951 100%);color:#232946;">← Back to Homepage</a>
    </div>
  </div>
</body>
</html>
`;
    
    await fs.writeFile(path.join(PUBLIC_DIR, "index.html"), fallbackHTML);
    console.log(chalk.yellow("⚠️ Fallback homepage created"));
  }
}

async function generateStaticPages(collections: any, pluginManager: PluginManager, isDev: boolean) {
  for (const page of collections.pages) {
//  console.log("STATIC PAGE BUILD:", page.slug, "layout:", page.layout);
    try {
      let templatePath = "page.axcora";
      
      if (page.layout && typeof page.layout === 'string') {
        if (page.layout.startsWith('src/templates/')) {
          templatePath = page.layout.replace('src/templates/', '');
        } else if (page.layout.includes('/')) {
          templatePath = page.layout;
        } else {
          templatePath = `${page.layout}.axcora`;
        }
      }
      
      await renderPageWithPlugins(
        templatePath,
        { ...page, site: collections.site, collections, url: page.url },
        path.join(PUBLIC_DIR, page.slug, "index.html"),
        pluginManager
      );
    } catch (error) {
      console.error(chalk.red(`❌ Error generating page ${page.slug}:`), error);
    }
  }
  
}

async function generateTagsPages(collections: any, pluginManager: PluginManager, isDev: boolean) {
  for (const [tagName, posts] of Object.entries(collections.tags)) {
    const deduplicatedPosts = deduplicatePosts(posts as any[]);
    
    // 🎯 CREATE SLUG from tag name
    const tagSlug = String(tagName)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    await renderPageWithPlugins(
      "archive.axcora",
      {
        title: `Tag: ${tagName}`,
        description: `Posts tagged with ${tagName}`,
        posts: deduplicatedPosts,
        type: "tag",
        name: tagName,
        site: collections.site,
        collections,
        url: `/tags/${tagSlug}/`
      },
      path.join(PUBLIC_DIR, "tags", tagSlug, "index.html"),
      pluginManager
    );
  }
  
}

async function generateCategoriesPages(collections: any, pluginManager: PluginManager, isDev: boolean) {
  for (const [categoryName, posts] of Object.entries(collections.categories)) {
    const deduplicatedPosts = deduplicatePosts(posts as any[]);
    
    // 🎯 CREATE SLUG from category name
    const categorySlug = String(categoryName)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    await renderPageWithPlugins(
      "archive.axcora", 
      {
        title: `Category: ${categoryName}`,
        description: `Posts in ${categoryName} category`,
        posts: deduplicatedPosts,
        type: "category", 
        name: categoryName,
        site: collections.site,
        collections,
        url: `/categories/${categorySlug}/`
      },
      path.join(PUBLIC_DIR, "categories", categorySlug, "index.html"), 
      pluginManager
    );
  }
  
}

async function generate404Page(collections: any, pluginManager: PluginManager) {
  try {
    const content404 = await loadPageContent('404');
    
    if (content404) {
      await renderPageWithPlugins(
        "404.axcora",
        { ...content404, site: collections.site, collections, url: '/404/' },
        path.join(PUBLIC_DIR, "404.html"),
        pluginManager
      );
    }
  } catch {
    // 404 page is optional
  }
}


async function ensureTemplatesExist(collectionName: string, isDev: boolean) {
  const listTemplate = path.join(TEMPLATES_DIR, collectionName, "list.axcora");
  const singleTemplate = path.join(TEMPLATES_DIR, collectionName, "single.axcora");
  
  try {
    await fs.access(listTemplate);
  } catch {
 //   if (!isDev) console.log(chalk.yellow(`⚠️ Creating default ${collectionName}/list.axcora`));
    await createDefaultListTemplate(collectionName);
  }
  
  try {
    await fs.access(singleTemplate);
  } catch {
//    if (!isDev) console.log(chalk.yellow(`⚠️ Creating default ${collectionName}/single.axcora`));
    await createDefaultSingleTemplate(collectionName);
  }
}

async function createDefaultListTemplate(collectionName: string) {
  const templateDir = path.join(TEMPLATES_DIR, collectionName);
  await fs.mkdir(templateDir, { recursive: true });
  
  const listContent = `---
layouts: base
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - badge
    - hero
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
---
<header class="hero container content-start mb-3">
  <div class="hero-content">
    <h1>
	  <a href="{{url}}" class="text-white text-decoration-none">${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}</a>
    </h1>
    <p class="lead text-muted">${collectionName}</p>
  </div>
</header>

  <article class="container">
  <div class="row mt-3">
  {{#each posts}}
	<div class="col-6 p-2">
	<div class="card p-3">  
	        {{#if category}}
        <a href="/categories/{{ category | slugify }}/"><span class="badge badge-success badge-sm p-2 text-small float-end">
		{{ category }}
		</span></a>
     {{/if}}
	  {{#if image}}
	     <a href="{{ url }}" title="{{description}}">
		{% axcora-image src="{{image}}" alt="{{title}}" /%}
		</a>
	  {{/if}}
    {{#if date}}
      <time class="meta-item text-small">{{ date | formatDate }}</time>
	  {{/if}}
	<h2 class="display-4">
      <strong><a href="{{ url }}" class="text-decoration-none">{{ title }}</a></strong>
    </h2>	 
{{#if tags.length}}
<div class="d-flex mt-1 mb-2">{{ tags | joinTags }}</div>
{{/if}}
	 <p>{{ description }}</p>
    <div class="mt-3">
      <a href="{{ url }}" class="btn btn-primary full">Read {{title}} →</a>
    </div>
	</div>
	</div>
  {{/each}}
  </div>
<ul class="pagination">
  {{#if pagination.hasPrev}} <li class="page-item">
    <a class="btn btn-primary" href="{{ pagination.prevLink }}" tabindex="-1">Previous</a>
  </li>{{/if}}

    <li class="page-item">
        <span class="p-2">Page {{pagination.currentPage}} of {{pagination.totalPages}}</span>
    </li>
    {{#if pagination.hasNext}}<li class="page-item">
        <a class="btn btn-primary" href="{{ pagination.nextLink }}">Next</a>
    </li>{{/if}}
</ul>
 </article>
</main>`;

  await fs.writeFile(path.join(templateDir, "list.axcora"), listContent);
}

async function createDefaultSingleTemplate(collectionName: string) {
  const templateDir = path.join(TEMPLATES_DIR, collectionName);
  await fs.mkdir(templateDir, { recursive: true });
  
  const singleContent = `---
layouts: base
css:
  theme: 'essentials'
  components:
    - buttons
    - navbar
    - badge
    - hero
    - breadcrumb
    - pagination
    - cards
js:
  - navbar
  - theme
---
<main class="container">
<div class="card p-3 content-start p-3 mb-3">
<header class="container text-center">
{{#if title}}<h1 class="text-3xl"><strong><a href="{{url}}">{{ title }}</a></strong></h1>{{/if}}
{{#if image}}
{% axcora-image src="{{image}}" alt="{{title}}" /%}
{{/if}}
<div class="text-start bg-gradient-primary rounded-lg p-5 mb-3"> 
{{#if description}}<h2 class="mb-3">{{description}}</h2>{{/if}}
<p><time class="text-small">Publish On : {{ date | formatDate }}</time><p>
{{#if tagsSlugged.length}}
<p>
  {{#each tagsSlugged}}
    <a href="/tags/{{slug}}/" class="btn btn-info btn-sm me-1 mb-1">#{{name}}</a>
  {{/each}}
{{#if category}}
<a href="/categories/{{ categorySlug }}/" class="btn btn-sm btn-primary">{{ category }}</a>
{{/if}}
{{/if}}
</p>
</div>
</header>
<article class="container">
{{ content }}
</article>
<footer class="row p-3">
      {{#if prev}}
      <div class="col-6">
        <p class="text-muted mb-1">Previous Post</p>
        <a href="{{ prev.url }}" class="btn btn-primary">← {{ prev.title }}</a>
      </div>
      {{/if}}
      
      {{#if next}}
      <div class="text-right col-6 px-4 py-4 text-end">
        <p class="text-muted mb-1">Next Post</p>
        <a href="{{ next.url }}" class="btn btn-primary">{{ next.title }} →</a>
      </div>
      {{/if}}
</footer>
</div>
</main>
`;

  await fs.writeFile(path.join(templateDir, "single.axcora"), singleContent);
}

async function generateSearchIndex(collections: any, isDev: boolean) {
  try {
    const searchIndex: any[] = [];
    
    Object.entries(collections).forEach(([collectionName, items]) => {
      if (['site', 'tags', 'categories', 'recent', 'posts', 'pages', 'uniqueTags', 'uniqueCategories'].includes(collectionName)) return;
      
      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          if (item.slug === '404' || item.url === '/404/') return;
          
          searchIndex.push({
            title: item.title,
            image: item.image,
            excerpt: item.excerpt || item.description || '',
            url: item.url,
            date: item.date,
            tags: item.tags || [],
            category: item.category || '',
            type: collectionName
          });
        });
      }
    });

    await fs.writeFile(
      path.join(PUBLIC_DIR, "search.json"),
      JSON.stringify(searchIndex, null, 2),
      "utf-8"
    );

    if (!isDev) {
  //    console.log(chalk.green(`✅ Search index: ${searchIndex.length} items`));
    }
  } catch (error) {
    console.error(chalk.yellow("⚠️ Failed to create search index"));
  }
}

async function generateRSSFeed(collections: any, isDev: boolean) {
  try {
    const siteData = collections.site;
    const recentPosts = (collections.blog || []).slice(0, 10);
    
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteData.title || 'Axcora Site'}</title>
    <description>${siteData.description || 'Modern static site generator'}</description>
    <link>${siteData.url || 'https://axcora.dev'}</link>
    <atom:link href="${siteData.url || 'https://axcora.dev'}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>${metaGenerator.generateMetaGenerator().replace('<meta name="generator" content="', '').replace('">', '')}</generator>
    ${recentPosts.map((post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>${siteData.url}${post.url}</link>
      <guid isPermaLink="true">${siteData.url}${post.url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.category ? `<category>${post.category}</category>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    await fs.writeFile(path.join(PUBLIC_DIR, "rss.xml"), rssContent.trim(), "utf-8");
    if (!isDev) console.log(chalk.green("✅ RSS feed created"));
  } catch (error) {
    console.error(chalk.yellow("⚠️ Failed to create RSS feed"));
  }
}

async function generateSitemap(collections: any, isDev: boolean) {
  try {
    const siteData = collections.site;
    const allUrls: string[] = ['/'];
    
Object.entries(collections).forEach(([collectionName, items]) => {
  if (['site', 'tags', 'categories', 'recent', 'posts', 'uniqueTags', 'uniqueCategories'].includes(collectionName)) return;
  if (Array.isArray(items) && items.length > 0) {
    if (collectionName !== 'pages') allUrls.push(`/${collectionName}/`);
    items.forEach((item: any) => {
      if (!item.url || typeof item.url !== "string") return;
      if (item.slug === '404' || item.url === '/404/' || item.slug === '404.html' || item.url === '/404.html') return;
      allUrls.push(item.url);
    });
  }
});


Object.keys(collections.tags || {}).forEach(tag => allUrls.push(`/tags/${slugify(tag)}/`));
Object.keys(collections.categories || {}).forEach(category => allUrls.push(`/categories/${slugify(category)}/`));

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(url => `
  <url>
    <loc>${siteData.url || 'https://axcora.com'}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), sitemapContent.trim(), "utf-8");
    if (!isDev) console.log(chalk.green(`✅ Sitemap: ${allUrls.length} URLs`));
  } catch (error) {
    console.error(chalk.yellow("⚠️ Failed to create sitemap"));
  }
}
