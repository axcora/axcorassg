import express from 'express';
import path from 'path';
import chalk from 'chalk';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

export async function startProductionServer(port: number = 8000, host: string = '0.0.0.0') {
  console.log(chalk.cyan('🚀 Starting production server...'));
  
  // Check if public directory exists
  try {
    await import('fs').then(fs => fs.promises.access(PUBLIC_DIR));
  } catch (error) {
    console.error(chalk.red('❌ Public directory not found. Run "axcora build" first.'));
    return;
  }

  const app = express();

  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Serve static files with caching
  app.use(express.static(PUBLIC_DIR, {
    maxAge: '1y', // Cache static assets for 1 year
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Don't cache HTML files
      if (path.extname(filePath) === '.html') {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // SPA fallback - serve index.html for unmatched routes
  app.get('*', (req, res) => {
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).send('404 - Page not found');
      }
    });
  });

  // Start server
  const server = app.listen(port, host, () => {
    console.log(chalk.green(`✅ Production server running!`));
    console.log(chalk.cyan(`🌐 Local: http://localhost:${port}`));
    if (host !== 'localhost' && host !== '127.0.0.1') {
      console.log(chalk.cyan(`🌐 Network: http://${host}:${port}`));
    }
    console.log(chalk.gray('\n💡 Press Ctrl+C to stop'));
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down production server...'));
    server.close(() => {
      console.log(chalk.green('✅ Production server stopped'));
      process.exit(0);
    });
  });

  return server;
}
