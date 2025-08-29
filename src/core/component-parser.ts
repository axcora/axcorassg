// src/core/component-parser.ts - FIXED EXPORTS
import fs from 'fs/promises';
import path from 'path';
import { renderAxcora } from './engine.js';

export interface ComponentInfo {
  name: string;
  template: string;
}

export class ComponentParser {
  private components = new Map<string, ComponentInfo>();
  private componentsDir = path.join(process.cwd(), 'src', 'components');

async loadComponents(): Promise<void> {
  // --- Load local components from src/components
  try {
    await fs.access(this.componentsDir);
    const files = await fs.readdir(this.componentsDir);
    for (const file of files) {
      if (file.endsWith('.axc')) {
        const componentName = path.basename(file, '.axc');
        const filePath = path.join(this.componentsDir, file);
        const template = await fs.readFile(filePath, 'utf-8');
        this.components.set(componentName, {
          name: componentName,
          template: template.trim()
        });
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ No local components directory found or no local components loaded.');
    }
  }

  // --- Load external components from npm (node_modules/axcora-*)
  try {
    const nodeModules = path.join(process.cwd(), 'node_modules');
    const folders = await fs.readdir(nodeModules, { withFileTypes: true });
    for (const dirent of folders) {
      // Only pick directories with the axcora- prefix
      if (dirent.isDirectory() && dirent.name.startsWith('axcora-')) {
        const npmComponentName = dirent.name.replace(/^axcora-/, '');
        const axcPath = path.join(nodeModules, dirent.name, `${dirent.name}.axc`);
        try {
          const template = await fs.readFile(axcPath, 'utf-8');
          // Do not overwrite local component if present
          if (!this.components.has(npmComponentName)) {
            this.components.set(npmComponentName, {
              name: npmComponentName,
              template: template.trim()
            });
          }
        } catch {
          // Optional: log missing .axc file
          if (process.env.NODE_ENV === 'development') {
   //         console.log(`⚠️ NPM component "${dirent.name}" found but no .axc file present.`);
          }
        }
      }
    }
  } catch (error) {
    // node_modules may not exist or may be empty
    if (process.env.NODE_ENV === 'development') {
//    console.log('⚠️ node_modules not found or no external npm components detected.');
    }
  }

  // --- Log all loaded components
  if (process.env.NODE_ENV === 'development' && this.components.size > 0) {
    const componentNames = Array.from(this.components.keys());
  //console.log(`✅ Loaded ${this.components.size} components: ${componentNames.join(', ')}`);
  }
}


  getComponent(name: string): ComponentInfo | undefined {
    return this.components.get(name);
  }

  getAllComponents(): ComponentInfo[] {
    return Array.from(this.components.values());
  }

  hasComponent(name: string): boolean {
    return this.components.has(name);
  }

  getComponentNames(): string[] {
    return Array.from(this.components.keys());
  }

  clear(): void {
    this.components.clear();
  }
}

// Global component parser instance
let globalComponentParser: ComponentParser | null = null;

export function setComponentParser(parser: ComponentParser): void {
  globalComponentParser = parser;
}

export function getGlobalComponentParser(): ComponentParser | null {
  return globalComponentParser;
}

// Main component processing function
export async function processComponents(content: string, data: any): Promise<string> {
  if (!globalComponentParser) {
    return content;
  }

  let processedContent = content;
  let hasChanges = true;
  let iterations = 0;
  const maxIterations = 10;

  while (hasChanges && iterations < maxIterations) {
    hasChanges = false;
    iterations++;

    // Process self-closing components first
    const selfClosingRegex = /{%\s*([A-Za-z][A-Za-z0-9-]*)\s*([^%]*?)\s*\/%}/g;
    processedContent = processedContent.replace(selfClosingRegex, (match, componentName, attributesStr) => {
      const component = globalComponentParser!.getComponent(componentName);
      if (!component) {
        return match;
      }

      const attributes = parseAttributes(attributesStr);
      const props = { ...attributes, children: '', $component: componentName };
      
      try {
        const rendered = renderAxcora(component.template, props);
        hasChanges = true;
        return rendered;
      } catch {
        return match;
      }
    });

    // Process paired components
    const pairedRegex = /{%\s*([A-Za-z][A-Za-z0-9-]*)\s*([^%]*?)\s*%}([\s\S]*?){%\s*\/\1\s*%}/g;
    processedContent = processedContent.replace(pairedRegex, (match, componentName, attributesStr, children) => {
      const component = globalComponentParser!.getComponent(componentName);
      if (!component) {
        return match;
      }

      const attributes = parseAttributes(attributesStr);
      const props = { 
        ...attributes, 
        children: children.trim(), 
        $component: componentName 
      };
      
      try {
        const rendered = renderAxcora(component.template, props);
        hasChanges = true;
        return rendered;
      } catch {
        return match;
      }
    });
  }

  return processedContent;
}

function parseAttributes(attributesStr: string): Record<string, any> {
  const attributes: Record<string, any> = {};
  const regex = /(\w+(?:-\w+)*)=["']([^"']*)["']|(\w+(?:-\w+)*)=([^\s"']+)|(\w+(?:-\w+)*)(?=\s|$)/g;
  
  let match;
  while ((match = regex.exec(attributesStr)) !== null) {
    if (match[1] && match[2] !== undefined) {
      attributes[match[1]] = match[2];
    } else if (match[3] && match[4] !== undefined) {
      attributes[match[3]] = match[4];
    } else if (match[5]) {
      attributes[match[5]] = true;
    }
  }
  
  return attributes;
}

