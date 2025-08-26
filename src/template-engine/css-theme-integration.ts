import { promises as fs } from 'fs';
import { join } from 'path';
import { EnhancedCSSLoader } from '../core/enhanced-css-loader.js';

interface ThemeConfig {
  name: string;
  variables: Record<string, string>;
  components: string[];
  fonts?: string[];
  customCSS?: string;
}

export class CSSThemeIntegration {
  private cssLoader: EnhancedCSSLoader;
  private themeCache: Map<string, ThemeConfig> = new Map();

  constructor(cssLoader: EnhancedCSSLoader) {
    this.cssLoader = cssLoader;
  }

  /**
   * Process theme selection in template
   */
  processThemeSelection(template: string): {
    cleanTemplate: string;
    theme: string;
    components: string[];
    customVars: Record<string, string>;
  } {
    const themeRegex = /{%\s*theme\s+name="([^"]+)"(?:\s+components="([^"]+)")?(?:\s+vars="([^"]+)")?\s*%}/;
    const match = template.match(themeRegex);

    if (!match) {
      return {
        cleanTemplate: template,
        theme: 'default',
        components: [],
        customVars: {}
      };
    }

    const [fullMatch, themeName, componentsStr = '', varsStr = ''] = match;
    
    return {
      cleanTemplate: template.replace(fullMatch, ''),
      theme: themeName,
      components: componentsStr ? componentsStr.split(',').map(c => c.trim()) : [],
      customVars: this.parseCustomVars(varsStr)
    };
  }

  /**
   * Parse custom variables from template
   */
  private parseCustomVars(varsStr: string): Record<string, string> {
    if (!varsStr) return {};

    const vars: Record<string, string> = {};
    const pairs = varsStr.split(',');

    pairs.forEach(pair => {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (key && value) {
        vars[key] = value;
      }
    });

    return vars;
  }

  /**
   * Process theme variables in template content
   */
  processThemeVariables(template: string, themeVariables: Record<string, string>): string {
    // Replace {% theme-var variable-name %} with CSS custom properties
    const themeVarRegex = /{%\s*theme-var\s+([a-zA-Z0-9-_]+)\s*%}/g;
    
    return template.replace(themeVarRegex, (match: string, variableName: string) => {
      if (themeVariables[variableName]) {
        return themeVariables[variableName];
      }
      // Return CSS custom property as fallback
      return `var(--${variableName})`;
    });
  }

  /**
   * Generate CSS imports for template
   */
  generateCSSImports(theme: string, components: string[] = []): string {
    const imports: string[] = [];

    // Base framework CSS
    imports.push('<link rel="stylesheet" href="/css/axcora.css">');

    // Theme CSS
    if (theme !== 'default') {
      imports.push(`<link rel="stylesheet" href="/css/themes/${theme}/theme.css">`);
    }

    // Component-specific CSS (if separated)
    if (components.length > 0) {
      imports.push('<link rel="stylesheet" href="/css/axcora-components.css">');
    }

    // Utilities CSS
    imports.push('<link rel="stylesheet" href="/css/axcora-utilities.css">');

    return imports.join('\n    ');
  }

  /**
   * Load theme configuration
   */
  async loadThemeConfig(themeName: string): Promise<ThemeConfig | null> {
    if (this.themeCache.has(themeName)) {
      return this.themeCache.get(themeName)!;
    }

    try {
      const configPath = join(process.cwd(), 'static/css/themes', themeName, 'config.json');
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent) as ThemeConfig;
      
      this.themeCache.set(themeName, config);
      return config;
    } catch (error) {
      console.warn(`Could not load theme config for: ${themeName}`);
      return null;
    }
  }

  /**
   * Generate runtime theme switcher JavaScript
   */
  generateThemeSwitcherJS(availableThemes: string[]): string {
    return `
// Axcora Theme Switcher
class AxcoraThemeSwitcher {
  constructor() {
    this.currentTheme = localStorage.getItem('axcora-theme') || 'default';
    this.availableThemes = ${JSON.stringify(availableThemes)};
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeSelector();
  }

  applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('axcora-theme', themeName);
    this.currentTheme = themeName;
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: themeName }
    }));
  }

  switchTheme(themeName) {
    if (this.availableThemes.includes(themeName)) {
      this.applyTheme(themeName);
    }
  }

  toggleDarkMode() {
    const newTheme = this.currentTheme === 'dark' ? 'default' : 'dark';
    this.switchTheme(newTheme);
  }

  setupThemeSelector() {
    const themeSelectors = document.querySelectorAll('[data-theme-selector]');
    themeSelectors.forEach(selector => {
      selector.addEventListener('change', (e) => {
        this.switchTheme(e.target.value);
      });
    });

    const darkModeToggles = document.querySelectorAll('[data-dark-mode-toggle]');
    darkModeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        this.toggleDarkMode();
      });
    });
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getAvailableThemes() {
    return this.availableThemes;
  }
}

// Initialize theme switcher
const axcoraTheme = new AxcoraThemeSwitcher();

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.AxcoraTheme = axcoraTheme;
}
`;
  }

  /**
   * Create theme configuration files
   */
  async createThemeConfig(themeName: string, config: ThemeConfig): Promise<void> {
    const themeDir = join(process.cwd(), 'static/css/themes', themeName);
    
    try {
      await fs.mkdir(themeDir, { recursive: true });
      
      const configPath = join(themeDir, 'config.json');
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      
      console.log(`✅ Created theme config: ${themeName}`);
    } catch (error) {
      console.error(`❌ Failed to create theme config: ${error}`);
    }
  }
}

export default CSSThemeIntegration;
