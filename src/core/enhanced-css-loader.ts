import { promises as fs } from 'fs';
import { join } from 'path';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

interface CSSFrameworkConfig {
  theme: string;
  components: string[];
  customVariables: Record<string, string>;
  optimize: boolean;
  criticalCSS: boolean;
}

interface ComponentUsage {
  template: string;
  usedComponents: string[];
  usedUtilities: string[];
}

export class EnhancedCSSLoader {
  private frameworkPath: string;
  private outputPath: string;
  private componentMap: Map<string, string[]> = new Map();

  constructor(frameworkPath: string, outputPath: string) {
    this.frameworkPath = frameworkPath;
    this.outputPath = outputPath;
    
    // Initialize component detection patterns
    this.initializeComponentMap();
  }

  /**
   * Initialize component detection patterns
   */
  private initializeComponentMap(): void {
    this.componentMap.set('accordion', ['.accordion', '.accordion-item', '.accordion-button']);
    this.componentMap.set('alert', ['.alert', '.alert-info', '.alert-success', '.alert-warning', '.alert-error']);
    this.componentMap.set('badge', ['.badge', '.badge-primary', '.badge-secondary']);
    this.componentMap.set('breadcrumb', ['.breadcrumb', '.breadcrumb-item']);
    this.componentMap.set('button', ['.btn', '.btn-primary', '.btn-secondary', '.btn-outline']);
    this.componentMap.set('card', ['.card', '.card-header', '.card-body', '.card-footer']);
    this.componentMap.set('carousel', ['.carousel', '.carousel-item', '.carousel-control']);
    this.componentMap.set('dropdown', ['.dropdown', '.dropdown-menu', '.dropdown-item']);
    this.componentMap.set('form', ['.form-group', '.form-input', '.form-label']);
    this.componentMap.set('modal', ['.modal', '.modal-dialog', '.modal-content']);
    this.componentMap.set('navbar', ['.navbar', '.navbar-nav', '.navbar-brand']);
    this.componentMap.set('table', ['.table', '.table-striped', '.table-hover']);
    this.componentMap.set('toast', ['.toast', '.toast-header', '.toast-body']);
    // Add more components...
  }

  /**
   * Analyze templates to detect used CSS components
   */
  async analyzeTemplateUsage(templateFiles: string[]): Promise<ComponentUsage[]> {
    const results: ComponentUsage[] = [];

    for (const templateFile of templateFiles) {
      const content = await fs.readFile(templateFile, 'utf-8');
      const usage = await this.detectComponentUsage(content);
      
      results.push({
        template: templateFile,
        usedComponents: usage.components,
        usedUtilities: usage.utilities
      });
    }

    return results;
  }

  /**
   * Detect which components are used in template content
   */
  private async detectComponentUsage(content: string): Promise<{components: string[], utilities: string[]}> {
    const usedComponents: string[] = [];
    const usedUtilities: string[] = [];

    // Detect components
    for (const [component, patterns] of this.componentMap) {
      const componentUsed = patterns.some(pattern => 
        content.includes(pattern) || 
        content.includes(pattern.replace('.', ''))
      );
      
      if (componentUsed) {
        usedComponents.push(component);
      }
    }

    // Detect utilities (basic detection)
    const utilityPatterns = [
      /\b(m|p)[tblrxy]?-\d+\b/g,        // margin/padding utilities
      /\btext-(left|center|right|sm|lg|xl)\b/g,  // text utilities
      /\bd-(none|block|flex|inline)\b/g,  // display utilities
      /\bbg-(primary|secondary|success|warning|error)\b/g,  // background utilities
      /\btext-(primary|secondary|muted)\b/g,  // text color utilities
    ];

    utilityPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        usedUtilities.push(...matches);
      }
    });

    return {
      components: [...new Set(usedComponents)],
      utilities: [...new Set(usedUtilities)]
    };
  }

  /**
   * Build optimized CSS bundle based on usage
   */
  async buildOptimizedCSS(config: CSSFrameworkConfig, usage: ComponentUsage[]): Promise<string> {
    let cssBundle = '';

    // 1. Always include base CSS
    cssBundle += await this.loadBaseCSS();

    // 2. Add theme CSS
    cssBundle += await this.loadThemeCSS(config.theme);

    // 3. Add only used components
    const allUsedComponents = new Set<string>();
    usage.forEach(u => u.usedComponents.forEach(c => allUsedComponents.add(c)));

    for (const component of allUsedComponents) {
      cssBundle += await this.loadComponentCSS(component);
    }

    // 4. Add utilities (can be optimized further)
    cssBundle += await this.loadUtilitiesCSS();

    // 5. Apply custom variables
    if (config.customVariables && Object.keys(config.customVariables).length > 0) {
      cssBundle = await this.applyCustomVariables(cssBundle, config.customVariables);
    }

    // 6. Optimize if requested
    if (config.optimize) {
      cssBundle = await this.optimizeCSS(cssBundle);
    }

    return cssBundle;
  }

  /**
   * Load base CSS (variables, reset, typography)
   */
  private async loadBaseCSS(): Promise<string> {
    const baseFiles = [
      'axcora-framework/01-variables.css',
      'axcora.css' // Includes reset, typography, base styles
    ];

    let baseCSS = '';
    for (const file of baseFiles) {
      try {
        const filePath = join(this.frameworkPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        baseCSS += content + '\n';
      } catch (error) {
        console.warn(`Warning: Could not load base CSS file: ${file}`);
      }
    }

    return baseCSS;
  }

  /**
   * Load theme-specific CSS
   */
  private async loadThemeCSS(themeName: string): Promise<string> {
    try {
      const themePath = join(this.frameworkPath, `themes/${themeName}/theme.css`);
      return await fs.readFile(themePath, 'utf-8');
    } catch (error) {
      console.warn(`Warning: Could not load theme: ${themeName}, using default`);
      return '';
    }
  }

  /**
   * Load specific component CSS
   */
  private async loadComponentCSS(componentName: string): Promise<string> {
    try {
      const componentPath = join(this.frameworkPath, `components/${componentName}.css`);
      const content = await fs.readFile(componentPath, 'utf-8');
      return content + '\n';
    } catch (error) {
      // Component CSS might be in main axcora.css already
      console.debug(`Component CSS not found: ${componentName}`);
      return '';
    }
  }

  /**
   * Load utilities CSS
   */
  private async loadUtilitiesCSS(): Promise<string> {
    try {
      const utilitiesPath = join(this.frameworkPath, 'axcora-utilities.css');
      return await fs.readFile(utilitiesPath, 'utf-8');
    } catch (error) {
      console.warn('Warning: Could not load utilities CSS');
      return '';
    }
  }

  /**
   * Apply custom CSS variables to override defaults
   */
  private async applyCustomVariables(css: string, variables: Record<string, string>): Promise<string> {
    let customCSS = css;

    // Add custom variables to :root
    let customVars = '\n:root {\n';
    for (const [key, value] of Object.entries(variables)) {
      customVars += `  --${key}: ${value};\n`;
    }
    customVars += '}\n';

    // Insert custom variables after existing :root declaration
    const rootRegex = /:root\s*\{[^}]*\}/;
    if (rootRegex.test(customCSS)) {
      customCSS = customCSS.replace(rootRegex, (match) => match + customVars);
    } else {
      customCSS = customVars + customCSS;
    }

    return customCSS;
  }

  /**
   * Optimize CSS with PostCSS
   */
  private async optimizeCSS(css: string): Promise<string> {
    const result = await postcss([
      autoprefixer,
      cssnano({
        preset: ['default', {
          discardComments: { removeAll: true },
          minifyFontValues: { removeQuotes: false }
        }]
      })
    ]).process(css, { from: undefined });

    return result.css;
  }

  /**
   * Generate critical CSS for above-the-fold content
   */
  async generateCriticalCSS(html: string, css: string): Promise<string> {
    // This is a simplified critical CSS extraction
    // In production, you'd use something like puppeteer + critical
    
    const criticalSelectors = [
      // Typography
      'body', 'h1', 'h2', 'h3', 'p', 'a',
      // Layout
      '.container', '.row', '.col',
      // Navigation  
      '.navbar', '.nav-links',
      // Above-the-fold components
      '.hero', '.header', '.main-content'
    ];

    const lines = css.split('\n');
    const criticalLines: string[] = [];
    let inCriticalRule = false;
    let braceCount = 0;

    for (const line of lines) {
      // Check if line contains critical selector
      const isCriticalSelector = criticalSelectors.some(selector => 
        line.includes(selector) && (line.includes('{') || line.includes(','))
      );

      if (isCriticalSelector) {
        inCriticalRule = true;
      }

      if (inCriticalRule) {
        criticalLines.push(line);
        
        // Count braces to determine when rule ends
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
        
        if (braceCount === 0) {
          inCriticalRule = false;
        }
      }

      // Always include variables and imports
      if (line.startsWith(':root') || line.startsWith('@import') || line.startsWith('/*')) {
        if (!criticalLines.includes(line)) {
          criticalLines.unshift(line);
        }
      }
    }

    return criticalLines.join('\n');
  }

  /**
   * Generate component CSS manifest for development
   */
  async generateManifest(usage: ComponentUsage[]): Promise<any> {
    const manifest = {
      timestamp: new Date().toISOString(),
      totalTemplates: usage.length,
      components: {} as Record<string, number>,
      utilities: {} as Record<string, number>,
      recommendations: [] as string[]
    };

    // Count component usage
    usage.forEach(u => {
      u.usedComponents.forEach(component => {
        manifest.components[component] = (manifest.components[component] || 0) + 1;
      });
      
      u.usedUtilities.forEach(utility => {
        manifest.utilities[utility] = (manifest.utilities[utility] || 0) + 1;
      });
    });

    // Generate recommendations
    const unusedComponents = Array.from(this.componentMap.keys()).filter(
      component => !manifest.components[component]
    );

    if (unusedComponents.length > 0) {
      manifest.recommendations.push(
        `Consider removing unused components: ${unusedComponents.join(', ')}`
      );
    }

    const totalUtilities = Object.keys(manifest.utilities).length;
    if (totalUtilities > 50) {
      manifest.recommendations.push(
        'High utility usage detected. Consider using semantic classes instead.'
      );
    }

    return manifest;
  }
}

export default EnhancedCSSLoader;
