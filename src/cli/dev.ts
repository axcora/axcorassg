import { build } from "../core/builder.js";
import chalk from "chalk";
import chokidar from "chokidar";
import http from "http";
import fs from "fs";
import path from "path";

export async function dev() {
  console.log(chalk.cyan(`
╔═════════════════════════════════════════════════════╗
║  ${chalk.red('█████')}  ${chalk.white('██╗  ██╗')} ${chalk.cyan('██████')}  ${chalk.yellow('██████')}  ${chalk.magenta('█████████')}  ${chalk.green('█████')}   ║
║ ${chalk.red('██╔══██╗')}${chalk.white('╚██╗██╔╝')}${chalk.cyan('██╔════╝')}${chalk.yellow('██╔═══██╗')}${chalk.magenta('██     ██')} ${chalk.green('██╔══██╗')} ║
║ ${chalk.red('███████║')} ${chalk.white('╚███╔╝')} ${chalk.cyan('██║     ')}${chalk.yellow('██║   ██║')}${chalk.magenta('█████████')} ${chalk.green('███████║')} ║
║ ${chalk.red('██╔══██║')} ${chalk.white('██╔██╗')} ${chalk.cyan('██║     ')}${chalk.yellow('██║   ██║')}${chalk.magenta('██ ██ ')}    ${chalk.green('██╔══██║')} ║
║ ${chalk.red('██║  ██║')}${chalk.white('██╔╝ ██╗')}${chalk.cyan('╚██████╗')}${chalk.yellow('╚██████╔╝')}${chalk.magenta('██ ██████╗')}${chalk.green('██║  ██║')} ║
╚═════════════════════════════════════════════════════╝
  `));
  
  console.log(chalk.bold.cyan("  Axcora Modern and Super Light Static Site Generator"));
  console.log(chalk.gray("    ════════════════════════════════════════════════\n"));
  
  
  const startTime = Date.now();
  
  try {
    // Build first
    console.log(chalk.yellow('🔄 Building...'));
    await build({ isDev: true });
    
    const buildTime = Date.now() - startTime;
    console.log(chalk.green(`✅ Build completed in ${buildTime}ms`));
    
    // Start file watcher
const watcher = chokidar.watch(
  [    path.join(process.cwd(), "content"),
    path.join(process.cwd(), "src", "templates"),
    path.join(process.cwd(), "static", "*.css"),
    path.join(process.cwd(), "static", "*.js"),
  ],
  {
    ignored: (filePath) => {
      const rel = path.relative(process.cwd(), filePath).split(path.sep)
      return (
        rel.includes("public")
        || rel.includes("node_modules")
        || rel.includes(".git")
        || rel.includes("dist")
        || rel.includes("img")
      );
    },
    persistent: true,
    ignoreInitial: true
  }
)

    watcher.on("change", async (changedPath) => {
      const changeTime = Date.now();
      console.log(chalk.yellow(`📝 ${path.basename(changedPath)} changed`));
      
      try {
        await build({ isDev: true });
        const rebuildTime = Date.now() - changeTime;
        console.log(chalk.green(`✅ Rebuilt in ${rebuildTime}ms`));
      } catch (error) {
        console.error(chalk.red("❌ Rebuild failed!"));
      }
    });

    // Start dev server - PERBAIKAN DI SINI
    const port = await startDevServer();
    displayServerInfo(port);
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 Shutting down...'));
      watcher.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red("❌ Failed to start dev server!"));
    console.error(error);
    process.exit(1);
  }
}

async function startDevServer(): Promise<number> {
  const FIXED_PORT = 3000;
  
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      handleRequest(req, res);
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(chalk.red(`❌ Port ${FIXED_PORT} is already in use!`));
        console.error(chalk.yellow(`💡 Kill the process using port ${FIXED_PORT} first`));
        process.exit(1);
      } else {
        reject(err);
      }
    });
    
    // PERBAIKAN: Pastikan server benar-benar start sebelum resolve
    server.listen(FIXED_PORT, () => {
      console.log(chalk.blue(`🚀 Server listening on port ${FIXED_PORT}`));
      resolve(FIXED_PORT);
    });
  });
}

function handleRequest(req: any, res: any) {
  let filePath = path.join(process.cwd(), "public", req.url === "/" ? "index.html" : req.url);
  
  // Handle clean URLs
  if (req.url?.endsWith("/") && req.url !== "/") {
    filePath = path.join(process.cwd(), "public", req.url, "index.html");
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
      '.txt': 'text/plain'
    };
    
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
    res.end(fs.readFileSync(filePath));
  } else {
    // Simple 404 page
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
}

function displayServerInfo(port: number) {
  const url = `http://localhost:${port}`;
  
  console.log(`
${chalk.bgGreen.black(' ✅ AXCORA SERVER READY ')}

${chalk.cyan.underline(url)} ${chalk.gray('← Click here!')}

${chalk.gray('📁 Serving:')} ${chalk.white('./public/')}
${chalk.gray('🔥 Hot reload:')} ${chalk.green('enabled')}

${chalk.yellow('Press Ctrl+C to stop')}
${chalk.gray('─'.repeat(50))}
`);
}