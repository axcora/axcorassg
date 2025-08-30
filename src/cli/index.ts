import { Command } from "commander";
import { dev } from "./dev.js";
import { build } from "../core/builder.js";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { startDevServer } from '../server/dev-server.js';
import { startProductionServer } from '../server/prod-server.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(__dirname, "../../package.json"), "utf8"));
function showBanner() {
  console.log(chalk.cyan(`
╔═════════════════════════════════════════════════════╗
║  ${chalk.magenta('█████')}  ${chalk.blue('██╗  ██╗')} ${chalk.cyan('██████')}  ${chalk.green('██████')}  ${chalk.red('█████████')}  ${chalk.yellow('█████')}   ║
║ ${chalk.magenta('██╔══██╗')}${chalk.blue('╚██╗██╔╝')}${chalk.cyan('██╔════╝')}${chalk.green('██╔═══██╗')}${chalk.red('██     ██')} ${chalk.yellow('██╔══██╗')} ║
║ ${chalk.magenta('███████║')} ${chalk.blue('╚███╔╝')} ${chalk.cyan('██║     ')}${chalk.green('██║   ██║')}${chalk.red('█████████')} ${chalk.yellow('███████║')} ║
║ ${chalk.magenta('██╔══██║')} ${chalk.blue('██╔██╗')} ${chalk.cyan('██║     ')}${chalk.green('██║   ██║')}${chalk.red('██ ██ ')}    ${chalk.yellow('██╔══██║')} ║
║ ${chalk.magenta('██║  ██║')}${chalk.blue('██╔╝ ██╗')}${chalk.cyan('╚██████╗')}${chalk.green('╚██████╔╝')}${chalk.red('██ ██████╗')}${chalk.yellow('██║  ██║')} ║
╚═════════════════════════════════════════════════════╝
  `));
  
  console.log(chalk.bold.cyan("  Modern and Super Light Static Site Generator"));
  console.log(chalk.gray("   ════════════════════════════════════════════════"));
}

const program = new Command();

program
  .name("axcora")
  .description("Modern and Super Light Static Site Generator")
  .version(pkg.version)
  .hook('preAction', () => {
    if (process.argv.length === 2) {
      showBanner();
    }
  });

// Dev command
program
  .command("dev")
  .description("Start development server with hot reload")
  .action(async () => {
    try {
      await dev();
    } catch (error) {
      console.error(chalk.red("Development server failed:"), error);
      process.exit(1);
    }
  });

// Build command
program
  .command("build")
  .description("Generate static site for production")
  .action(async () => {
    try {
      showBanner();
      console.log(chalk.yellow("\nBuilding for production...\n"));
      
      const startTime = Date.now();
      await build({ isDev: false });
      const buildTime = Date.now() - startTime;
      
      console.log(chalk.green(`\nProduction build completed in ${chalk.bold(buildTime + 'ms')}`));
      console.log(chalk.white(`Output directory: ${chalk.underline('./public/')}`));
      console.log(chalk.gray("\n💡 Tip: Deploy the 'public' folder to your hosting provider"));
    } catch (error) {
      console.error(chalk.red("Build failed:"), error);
      process.exit(1);
    }
  });

// New post command
program
  .command("new")
  .description("Create a new blog post")
  .argument("<title>", "Post title")
  .option("-c, --category <category>", "Post category", "general")
  .option("-t, --tags <tags>", "Post tags (comma-separated)", "blog")
  .action(async (title, options) => {
    try {
      await createNewPost(title, options);
    } catch (error) {
      console.error(chalk.red("Failed to create new post:"), error);
      process.exit(1);
    }
  });

// Serve command
program
  .command("serve")
  .description("Serve the built site locally")
  .option("-p, --port <port>", "Port number", "8080")
  .option("-o, --open", "Open browser automatically", false)
  .action(async (options) => {
    try {
      await serveBuiltSite(options.port, options.open);
    } catch (error) {
      console.error(chalk.red("Failed to serve site:"), error);
      process.exit(1);
    }
  });

// Clean command
program
  .command("clean")
  .description("Clean the public directory")
  .action(async () => {
    try {
      await cleanPublicDirectory();
    } catch (error) {
      console.error(chalk.red("Failed to clean:"), error);
      process.exit(1);
    }
  });

// Init command
program
  .command("init")
  .description("Initialize a new Axcora project")
  .argument("[name]", "Project name", "my-axcora-site")
  .action(async (name) => {
    try {
      await initProject(name);
    } catch (error) {
      console.error(chalk.red("Failed to initialize project:"), error);
      process.exit(1);
    }
  });

// Show help if no arguments
if (!process.argv.slice(2).length) {
  showBanner();
  program.outputHelp();
}

program.parse(process.argv);

// Helper Functions

async function createNewPost(title: string, options: any) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const date = new Date().toISOString().split('T')[0];
  const fileName = `${date}-${slug}.md`;
  const filePath = path.join(process.cwd(), 'content', 'blog', fileName);
  
  const tags = options.tags.split(',').map((tag: string) => tag.trim());
  
  const template = `---
title: "${title}"
date: ${date}
description: "Write your post excerpt here..."
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
category: "${options.category}"
author: "Your Name"
---

# ${title}

Write your blog post content here using Markdown.

## Introduction

Start with an engaging introduction to hook your readers.

## Main Content

### Subsection 1

Add your main content here.

### Code Examples

You can include code blocks:

\`\`\`javascript
console.log("Hello from Axcora!");
const greeting = "Welcome to my blog!";
\`\`\`

### Lists

- Item 1
- Item 2  
- Item 3

Or numbered lists:

1. First item
2. Second item
3. Third item

## Conclusion

Wrap up your post with a conclusion.

---

*Happy blogging with ⚡ Axcora!*
`;

  try {
    // Ensure content/blog directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // Check if file already exists
    try {
      await fs.access(filePath);
      console.log(chalk.yellow(`⚠️  Post already exists: ${fileName}`));
      console.log(chalk.cyan(`📁 Location: ${filePath}`));
      return;
    } catch {
      // File doesn't exist, continue
    }
    
    // Write the new post
    await fs.writeFile(filePath, template, 'utf-8');
    
    console.log(chalk.green(`✅ New post created successfully!`));
    console.log(chalk.cyan(`📁 File: ${fileName}`));
    console.log(chalk.cyan(`📍 Location: ${filePath}`));
    console.log(chalk.gray('💡 Edit the file and run `npm run dev` to see changes'));
  } catch (error) {
    throw new Error(`Failed to create post: ${error}`);
  }
}

async function serveBuiltSite(port: string, openBrowser: boolean) {
  const http = await import('http');
  const fs = await import('fs');
  const publicDir = path.join(process.cwd(), 'public');
  
  // Check if public directory exists
  if (!fs.existsSync(publicDir)) {
    console.error(chalk.red('❌ Public directory not found!'));
    console.log(chalk.yellow('💡 Run `npm run build` first to generate the site'));
    process.exit(1);
  }
  
  const server = http.createServer((req, res) => {
    let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url || '');
    
    // Handle clean URLs and trailing slashes
    if (req.url?.endsWith('/') && req.url !== '/') {
      filePath = path.join(publicDir, req.url, 'index.html');
    }
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentTypes: Record<string, string> = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.avif': 'image/avif',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml',
        '.xml': 'application/xml',
        '.txt': 'text/plain',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
      };
      
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(fs.readFileSync(filePath));
    } else {
      // 404 page
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>404 - Not Found | axcora technology</title>
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
      max-width: 420px;
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
      font-size: 5rem;
      margin: 0 0 0.2em 0;
      font-weight: 900;
      line-height: 0.97;
      letter-spacing: -3px;
      color: #ff37a4;
      text-shadow:
        0 4px 24px #471c3480,
        0 1px 0 #232946;
    }
    .subtitle {
      font-size: 1.12rem;
      font-weight: 600;
      color: #aeadfe;
      margin-bottom: 0.7em;
      letter-spacing: 0.7px;
      text-transform: uppercase;
    }
    .desc {
      font-size: 1.12rem;
      color: #b3b6c7;
      margin: 0.45em 0 3em 0;
      font-weight: 400;
    }
    .brand {
      font-size: 1.26rem;
      color: #f9a826;
      margin-bottom: 0.25em;
      font-weight: 700;
      letter-spacing: 1.7px;
      font-family: 'Montserrat', 'Inter', Arial, sans-serif;
    }
    .tagline {
      color: #c0cafc;
      margin-bottom: 2em;
      font-size: 1.08rem;
      line-height: 1.46;
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
      transition: background 0.15s, color 0.15s, box-shadow 0.17s;
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
    @media (max-width: 500px) {
      .container { padding: 1.2rem 0.5rem 2.2rem 0.5rem; max-width: 95vw;}
      h1 {font-size: 3.1rem;}
      .logo {width:44px;height:44px;}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="/img/logo.png" alt="Axcora Logo" loading="lazy">
    </div>
    <span class="subtitle">Oops, page not found</span>
    <h1>404</h1>
    <div class="brand">axcora technology</div>
    <div class="tagline">All in one static site generator<br>and CSS Framework</div>
    <div class="desc">Sorry, the page you are looking for doesn't exist, was moved, or removed.<br>
      Don't worry, you can safely return to the homepage.
    </div>
    <a href="/" class="cta">← Back to Homepage</a>
  </div>
</body>
</html>
      `);
    }
  });
  
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(chalk.red(`❌ Port ${port} is already in use!`));
      console.log(chalk.yellow(`💡 Try a different port: npm run serve -- --port 8081`));
      process.exit(1);
    } else {
      throw err;
    }
  });
  
  server.listen(parseInt(port), () => {
    console.log(chalk.green(`🌐 Site served at http://localhost:${port}`));
    console.log(chalk.gray('📁 Serving from: ./public/'));
    console.log(chalk.gray('⏹️  Press Ctrl+C to stop'));
    
    if (openBrowser) {
      const { exec } = require('child_process');
      const url = `http://localhost:${port}`;
      
      // Cross-platform browser opening
      const command = process.platform === 'win32' ? 'start' : 
                     process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${command} ${url}`);
      
      console.log(chalk.cyan(`🚀 Opening ${url} in your browser...`));
    }
  });
}

async function cleanPublicDirectory() {
  const publicDir = path.join(process.cwd(), 'public');
  
  try {
    await fs.rm(publicDir, { recursive: true, force: true });
    console.log(chalk.green('✅ Public directory cleaned'));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Public directory not found or already clean'));
  }
}

async function initProject(projectName: string) {
  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.resolve(process.cwd(), "static", "templates", "default"); 

  try {
    try {
      await fs.access(targetDir);
      console.log(chalk.yellow(`⚠️  Directory '${projectName}' already exists!`));
      return;
    } catch {
      
    }

    // Copy folder template rekursif 👇
    await fs.cp(templateDir, targetDir, { recursive: true, force: true }); 

    console.log(chalk.green(`✅ Project '${projectName}' initialized successfully!`));
    console.log(chalk.cyan(`📁 Location: ${targetDir}`));
    console.log(chalk.gray('\n💡 Next steps:'));
    console.log(chalk.gray(`   cd ${projectName}`));
    console.log(chalk.gray('   npm install'));
    console.log(chalk.gray('   axcora dev'));
    console.log(chalk.gray('   or'));
    console.log(chalk.gray('   npm run dev'));
  } catch (error) {
    throw new Error(`Failed to initialize project: ${error}`);
  }
}