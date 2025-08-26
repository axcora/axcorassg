// src/core/MetaGenerator.ts
import { readFileSync } from 'fs';
import { join } from 'path';

interface BuildInfo {
  version: string;
  buildTime: string;
  environment: string;
  commit?: string;
  branch?: string;
}

interface GeneratorMeta {
  name: string;
  version: string;
  buildInfo: BuildInfo;
  framework: {
    css: string;
    components: number;
    themes: number;
  };
}

export class MetaGenerator {
  private config: any;
  private packageInfo: any;
  private buildInfo!: BuildInfo;

  constructor(configPath: string) {
    this.loadConfiguration(configPath);
    this.loadPackageInfo();
    this.initializeBuildInfo(); // ✅ RENAMED: generateBuildInfo -> initializeBuildInfo
  }

  private loadConfiguration(configPath: string) {
    try {
      // Load axcora.config.ts
      const configModule = require(configPath);
      this.config = configModule.default || configModule;
    } catch (error) {
      console.warn('⚠️ Could not load axcora.config.ts, using defaults');
      this.config = this.getDefaultConfig();
    }
  }

  private loadPackageInfo() {
    try {
      const packagePath = join(process.cwd(), 'package.json');
      this.packageInfo = JSON.parse(readFileSync(packagePath, 'utf-8'));
    } catch (error) {
      console.warn('⚠️ Could not load package.json');
      this.packageInfo = { name: 'axcora-site', version: '1.0.0' };
    }
  }

  private initializeBuildInfo(): void { // ✅ RENAMED: generateBuildInfo -> initializeBuildInfo
    this.buildInfo = {
      version: this.packageInfo.version,
      buildTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      commit: process.env.VERCEL_GIT_COMMIT_SHA || 
              process.env.GITHUB_SHA || 
              this.getGitCommit(),
      branch: process.env.VERCEL_GIT_COMMIT_REF || 
              process.env.GITHUB_REF_NAME || 
              this.getGitBranch()
    };
  }

  private getGitCommit(): string | undefined {
    try {
      const { execSync } = require('child_process');
      return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim().substring(0, 7);
    } catch {
      return undefined;
    }
  }

  private getGitBranch(): string | undefined {
    try {
      const { execSync } = require('child_process');
      return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    } catch {
      return undefined;
    }
  }

  // 🎯 GENERATE META TAGS
  generateMetaTags(): string {
    const generator = this.config.generator || {};
    const framework = generator.framework?.css || {};
    
    const metaTags = [
      `<meta name="generator" content="${this.getGeneratorString()}">`,
      `<meta name="build-time" content="${this.buildInfo.buildTime}">`,
      `<meta name="build-version" content="${this.buildInfo.version}">`,
      `<meta name="build-environment" content="${this.buildInfo.environment}">`
    ];

    // Add commit info if available
    if (this.buildInfo.commit) {
      metaTags.push(`<meta name="build-commit" content="${this.buildInfo.commit}">`);
    }

    if (this.buildInfo.branch) {
      metaTags.push(`<meta name="build-branch" content="${this.buildInfo.branch}">`);
    }

    // Add framework info
    if (framework.name) {
      metaTags.push(`<meta name="css-framework" content="${framework.name} v${framework.version || '1.0.0'}">`);
    }

    // Add feature flags
    if (generator.build?.features) {
      metaTags.push(`<meta name="features" content="${generator.build.features.join(', ')}">`);
    }

    return metaTags.join('\n  ');
  }

  // 🚀 ADVANCED GENERATOR STRING
  private getGeneratorString(): string {
    const generator = this.config.generator || {};
    const base = generator.name || "Axcora Static Site Generator";
    const version = generator.version || this.packageInfo.version;
    const codename = generator.codename ? ` "${generator.codename}"` : '';
    const environment = this.buildInfo.environment !== 'production' ? ` (${this.buildInfo.environment})` : '';
    
    return `${base} v${version}${codename}${environment}`;
  }

  // 🎨 GENERATE FULL BUILD INFO FOR DEBUG
  generateBuildInfo(): string { // ✅ KEPT: This one generates string, so keep the name
    return `
<!-- 🚀 AXCORA BUILD INFORMATION -->
<!-- 
  Generator: ${this.getGeneratorString()}
  Built: ${this.buildInfo.buildTime}
  Commit: ${this.buildInfo.commit || 'unknown'}
  Branch: ${this.buildInfo.branch || 'unknown'}
  Node: ${process.version}
  CSS Framework: ${this.config.generator?.framework?.css?.name || 'Axcora CSS'} v${this.config.generator?.framework?.css?.version || '1.0.0'}
  Components: ${this.config.generator?.framework?.css?.components || 22}
  Themes: ${this.config.generator?.framework?.css?.themes || 7}
-->`;
  }

  private getDefaultConfig() {
    return {
      generator: {
        name: "Axcora Static Site Generator",
        version: "2.0.0",
        framework: {
          css: {
            name: "Axcora CSS Framework",
            version: "1.5.0",
            components: 22,
            themes: 7
          }
        }
      }
    };
  }
}
