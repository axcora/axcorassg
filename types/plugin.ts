// src/types/plugin.ts
export interface PluginContext {
  config: AxcoraConfig;
  collections: Collections;
  addAsset: (asset: Asset) => void;
  addPage: (page: Page) => void;
  transformContent: (content: string, filePath: string) => string;
  addBuildHook: (hook: string, fn: Function) => void;
}

export interface Plugin {
  name: string;
  version?: string;
  setup?: (ctx: PluginContext) => void | Promise<void>;
  buildStart?: (ctx: PluginContext) => void | Promise<void>;
  transformTemplate?: (template: string, ctx: PluginContext) => string | Promise<string>;
  generateAssets?: (ctx: PluginContext) => void | Promise<void>;
  buildEnd?: (ctx: PluginContext) => void | Promise<void>;
}

export interface Asset {
  name: string;
  type: 'image' | 'script' | 'style' | 'font' | 'other';
  source: string;
  destination: string;
  optimize?: boolean;
}

export interface AxcoraConfig {
  site: SiteConfig;
  build: BuildConfig;
  plugins: (string | [string, any])[];
  [key: string]: any;
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author?: string;
  lang?: string;
}

export interface BuildConfig {
  outDir: string;
  assetsDir: string;
  minify: boolean;
  sourcemap: boolean;
}
