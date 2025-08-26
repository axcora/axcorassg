import path from 'path';
import { pathToFileURL } from 'url';
import chalk from 'chalk';
import type { AxcoraConfig } from '../types/plugin.js';

export function defineConfig(config: AxcoraConfig): AxcoraConfig {
  return config;
}

export async function loadConfig(): Promise<AxcoraConfig> {
  // Try both .ts and .js config files
  const configPaths = [
    path.resolve(process.cwd(), 'axcora.config.ts'),
    path.resolve(process.cwd(), 'axcora.config.js'),
    path.resolve(process.cwd(), 'axcora.config.mjs')
  ];
  
  for (const configPath of configPaths) {
    try {
      const configUrl = pathToFileURL(configPath).href;
      const configModule = await import(configUrl);
      const config = configModule.default;
      
      console.log(chalk.green(`✅ Configuration loaded from ${path.basename(configPath)}`));
      
      return {
        site: {
          title: "Axcora Site",
          description: "Modern Static Site Generator",
          url: "http://localhost:3000",
          lang: "en", // Now matches the type
          author: "Axcora Team",
          ...config.site
        },
        build: {
          outDir: "public",
          assetsDir: "assets", // Now matches the type
          minify: true,
          sourcemap: false,
          clean: true,
          ...config.build
        },
        blog: {
          posts_per_page: 5,
          excerpt_length: 150,
          ...config.blog
        },
        plugins: config.plugins || [],
        ...config
      };
    } catch (error) {
      // Try next config file
      continue;
    }
  }
  
  // No config found, use defaults
  console.log(chalk.yellow('⚠️ No config file found, using defaults'));
  
  return {
    site: {
      title: "Axcora Site",
      description: "Modern Static Site Generator",
      url: "http://localhost:3000",
      lang: "en",
      author: "Axcora Team"
    },
    build: {
      outDir: "public",
      assetsDir: "assets",
      minify: true,
      sourcemap: false,
      clean: true
    },
    blog: {
      posts_per_page: 5,
      excerpt_length: 150
    },
    plugins: []
  };
}

// Fixed export type issue
export type { AxcoraConfig as Config };
export type { AxcoraConfig };
