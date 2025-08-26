import express from 'express';
import path from 'path';
import chalk from 'chalk';
import chokidar from 'chokidar';
import { build } from '../core/builder.js';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

export async function startDevServer(port: number = 3000, host: string = 'localhost') {
  console.log(chalk.cyan('🔥 Starting development server...'));
  
  // Initial build
  try {
    await build({ isDev: true });
  } catch (error) {
    console.error(chalk.red('❌ Initial build failed:'), error);
    return;
  }

  // Create Express app
  const app = express();

  // Serve static files from public directory
  app.use(express.static(PUBLIC_DIR, {
    etag: true,
    lastModified: true
  }));

  // SPA fallback for client-side routing
  app.get('*', (req, res) => {
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    try {
      const fs = require('fs');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('404 - Page not found');
      }
    } catch (error) {
      res.status(404).send('404 - Page not found');
    }
  });

  // Start server
  const server = app.listen(port, host, () => {
    console.log(chalk.green(`✅ Development server running!`));
    console.log(chalk.cyan(`🌐 Local: http://localhost:${port}`));
    if (host !== 'localhost') {
      console.log(chalk.cyan(`🌐 Network: http://${host}:${port}`));
    }
    console.log(chalk.gray('\n👀 Watching for changes...'));
    console.log(chalk.gray('💡 Press Ctrl+C to stop'));
  });

  // Watch for file changes - FIXED: Use string pattern instead of broken regex
  const contentWatcher = chokidar.watch([
    'content/**/*.md',
    'content/**/*.yml', 
    'src/templates/**/*.axcora',
    'src/components/**/*.axcora',
    'static/**/*',
    'axcora.config.*'
  ], {
    ignored: '**/.*', // ✅ FIXED: Simple string pattern to ignore dotfiles
    persistent: true,
    ignoreInitial: true
  });

  let buildTimeout: NodeJS.Timeout;

  contentWatcher.on('change', async (filePath) => {
    console.log(chalk.blue(`📝 Changed: ${path.relative(process.cwd(), filePath)}`));
    
    // Debounce builds
    clearTimeout(buildTimeout);
    buildTimeout = setTimeout(async () => {
      try {
        console.log(chalk.cyan('🔄 Rebuilding...'));
        const startTime = Date.now();
        
        await build({ isDev: true });
        
        const buildTime = Date.now() - startTime;
        console.log(chalk.green(`✅ Rebuilt in ${buildTime}ms`));
      } catch (error) {
        console.error(chalk.red('❌ Build failed:'), error);
      }
    }, 100);
  });

  contentWatcher.on('add', async (filePath) => {
    console.log(chalk.green(`📄 Added: ${path.relative(process.cwd(), filePath)}`));
  });

  contentWatcher.on('unlink', async (filePath) => {
    console.log(chalk.red(`🗑️  Deleted: ${path.relative(process.cwd(), filePath)}`));
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down development server...'));
    contentWatcher.close();
    server.close(() => {
      console.log(chalk.green('✅ Development server stopped'));
      process.exit(0);
    });
  });
}
