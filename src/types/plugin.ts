export interface AxcoraConfig {
  site: {
    title: string;
    description: string;
    url: string;
    author?: string;
    language?: string;
    lang?: string; // Add this for compatibility
  };
  build?: {
    outDir?: string;
    clean?: boolean;
    assetsDir?: string; // Add this missing property
    minify?: boolean;
    sourcemap?: boolean;
  };
  blog?: {
    posts_per_page?: number;
    excerpt_length?: number;
  };
  plugins?: string[];
  [key: string]: any;
}

export interface PluginContext {
  config: AxcoraConfig;
  collections: any;
  utils: {
    renderTemplate: (template: string, data: any) => string;
    processMarkdown: (content: string) => Promise<string>;
  };
}

export interface AxcoraPlugin {
  name: string;
  setup?: (context: PluginContext) => void | Promise<void>;
  buildStart?: (context: PluginContext) => void | Promise<void>;
  generateAssets?: (context: PluginContext) => void | Promise<void>;
  buildEnd?: (context: PluginContext) => void | Promise<void>;
  transformTemplate?: (template: string, context: PluginContext) => string | Promise<string>;
}

export type Config = AxcoraConfig;
