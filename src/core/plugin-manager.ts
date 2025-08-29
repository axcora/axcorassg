// FIXED: Remove conflicting import and create local interface if needed
import type { Config, AxcoraConfig } from '../types/plugin.js';

// Local interface to avoid conflicts
interface LocalPluginContext {
  config: AxcoraConfig;
  collections: any;
  utils: {
    renderTemplate: (template: string, data: any) => string;
    processMarkdown: (content: string) => Promise<string>;
  };
}

export class PluginManager {
  private plugins: any[] = [];
  private context: LocalPluginContext;

  constructor(config: AxcoraConfig, collections: any) {
    this.context = {
      config,
      collections,
      utils: {
        renderTemplate: (template: string, data: any) => template,
        processMarkdown: async (content: string) => content
      }
    };
  }

  async loadPlugins() {
    // Load plugins from config
    const pluginNames = this.context.config.plugins || [];
    
    for (const pluginName of pluginNames) {
      try {
        // Implementation for loading plugins
   //     console.log(`Loading plugin: ${pluginName}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Failed to load plugin ${pluginName}:`, errorMsg);
      }
    }
  }

  async executeHook(hookName: string) {
    for (const plugin of this.plugins) {
      if (plugin[hookName] && typeof plugin[hookName] === 'function') {
        try {
          await plugin[hookName](this.context);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.warn(`Plugin hook ${hookName} failed:`, errorMsg);
        }
      }
    }
  }

  async transformTemplate(template: string): Promise<string> {
    let result = template;
    for (const plugin of this.plugins) {
      if (plugin.transformTemplate) {
        try {
          result = await plugin.transformTemplate(result, this.context);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.warn(`Template transform failed:`, errorMsg);
        }
      }
    }
    return result;
  }
}
