import { load } from "js-yaml";
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

// 🚀 CONDITIONAL HANDLEBARS IMPORT
let Handlebars: any = null;

async function loadHandlebars() {
  try {
    const handlebarsModule = await import('handlebars');
    Handlebars = handlebarsModule.default || handlebarsModule;
    registerHandlebarsHelpers();
    return true;
  } catch (error) {
    return false;
  }
}

function registerHandlebarsHelpers() {
  if (!Handlebars) return;

  try {
    Handlebars.registerHelper('formatDate', function(date: any) {
      if (!date) return '';
      if (date === 'now') {
        return new Date().getFullYear().toString();
      }
      try {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return date;
      }
    });

    Handlebars.registerHelper('eq', function(a: any, b: any) {
      return a === b;
    });

    Handlebars.registerHelper('ne', function(a: any, b: any) {
      return a !== b;
    });

    Handlebars.registerHelper('and', function(a: any, b: any) {
      return a && b;
    });

    Handlebars.registerHelper('or', function(a: any, b: any) {
      return a || b;
    });

    Handlebars.registerHelper('length', function(array: any) {
      if (Array.isArray(array)) return array.length;
      return 0;
    });

    // 🎯 FIXED: joinTags dengan slug URL
    Handlebars.registerHelper('joinTags', function(tags: any[]) {
      if (!Array.isArray(tags) || tags.length === 0) return '';
      return tags.map(tag => {
        const tagSlug = String(tag)
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
        return `<a href="/tags/${tagSlug}/" class="tag" style="display: inline-block; padding: 2px 8px; margin: 0 2px; background: #e3f2fd; color: #1976d2; text-decoration: none; border-radius: 12px; font-size: 0.85em;">#${tag}</a>`;
      }).join(' ');
    });

    Handlebars.registerHelper('firstTag', function(tags: any[]) {
      if (!Array.isArray(tags) || tags.length === 0) return '';
      return tags[0];
    });

    Handlebars.registerHelper('slugify', function(text: any) {
      return String(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    });

  } catch (error) {
    // Silent fail
  }
}

let handlebarsReady = false;
loadHandlebars().then(success => {
  handlebarsReady = success;
});

export function renderAxcora(template: string, data: any): string {
  if (!template || !data) {
    return template || '';
  }

  let result = template;

  try {
    // 🚀 Try Handlebars if available and ready
    if (handlebarsReady && Handlebars) {
      try {
        const hasHandlebarsConditionals = /\{\{#(if|unless|each)\s/.test(template);
        
        if (hasHandlebarsConditionals) {
          const contextData = {
            ...data,
            tags: Array.isArray(data.tags) ? data.tags : [],
            category: data.category || null,
            image: data.image || null,
            title: data.title || 'Untitled',
            excerpt: data.excerpt || '',
            date: data.date || new Date().toISOString(),
            url: data.url || '#'
          };

          const compiledTemplate = Handlebars.compile(template, {
            strict: false,
            noEscape: false
          });

          result = compiledTemplate(contextData);
          return result;
        }
      } catch (handlebarsError) {
        // Silent fallback to custom engine
      }
    }

    // 🔧 CUSTOM ENGINE: Simplified approach
    result = processIncludes(result, data);
    result = processLoops(result, data);
    result = processConditionals(result, data);
    result = processVariables(result, data);
    
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red('Template rendering error:'), errorMsg);
    }
    return template;
  }
}

function processIncludes(template: string, data: any): string {
  const includeRegex = /{%\s*include\s+([^\s%]+)\s*%}/g;
  
  return template.replace(includeRegex, (match, filename) => {
    try {
      const includePath = path.join(process.cwd(), 'src', 'templates', 'includes', filename);
      if (fs.existsSync(includePath)) {
        const includeContent = fs.readFileSync(includePath, 'utf-8');
        return renderAxcora(includeContent, data);
      }
      return `<!-- Include not found: ${filename} -->`;
    } catch (error) {
      return `<!-- Include not found: ${filename} -->`;
    }
  });
}

export async function processComponents(template: string, data: Record<string, any>): Promise<string> {
  try {
    const { getGlobalComponentParser } = await import('./component-parser.js');
    const componentParser = getGlobalComponentParser();
    
    if (!componentParser) {
      return template;
    }

    let processedTemplate = template;
    let hasChanges = true;
    let maxIterations = 10;
    
    while (hasChanges && maxIterations > 0) {
      const beforeTemplate = processedTemplate;
      
      // Process block components
      const componentMatches = Array.from(processedTemplate.matchAll(/{%\s*(\w+(?:-\w+)*)\s*([^%]*?)\s*%}([\s\S]*?){%\s*\/\1\s*%}/g));
      
      for (const match of componentMatches) {
        const [fullMatch, componentName, attributesStr, children] = match;
        
        try {
          const component = componentParser.getComponent(componentName);
          if (!component) {
            continue;
          }

          const props = parseComponentAttributes(attributesStr.trim());
          const result = renderAxcora(component.template, {
            ...data,
            ...props,
            children: children.trim()
          });
          
          processedTemplate = processedTemplate.replace(fullMatch, result);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(chalk.red(`❌ Error rendering component ${componentName}:`), error);
          const errorComment = `<!-- Component error: ${componentName} - ${errorMsg} -->`;
          processedTemplate = processedTemplate.replace(fullMatch, errorComment);
        }
      }

      // Process self-closing components
      const selfClosingMatches = Array.from(processedTemplate.matchAll(/{%\s*(\w+(?:-\w+)*)\s*([^%]*?)\s*\/%}/g));
      
      for (const match of selfClosingMatches) {
        const [fullMatch, componentName, attributesStr] = match;
        
        try {
          const component = componentParser.getComponent(componentName);
          if (!component) {
            continue;
          }

          const props = parseComponentAttributes(attributesStr.trim());
          const result = renderAxcora(component.template, {
            ...data,
            ...props,
            children: ''
          });
          
          processedTemplate = processedTemplate.replace(fullMatch, result);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(chalk.red(`❌ Error rendering component ${componentName}:`), error);
          const errorComment = `<!-- Component error: ${componentName} - ${errorMsg} -->`;
          processedTemplate = processedTemplate.replace(fullMatch, errorComment);
        }
      }
      
      hasChanges = processedTemplate !== beforeTemplate;
      maxIterations--;
    }
    
    return processedTemplate;
  } catch (error) {
    console.error(chalk.red('❌ Component processing error:'), error);
    return template;
  }
}

function parseComponentAttributes(attrString: string): Record<string, any> {
  if (!attrString) return {};
  
  const attrs: Record<string, any> = {};
  const regex = /(\w+(?:-\w+)*)=["']([^"']*)["']|(\w+(?:-\w+)*)=([^\s"']+)|(\w+(?:-\w+)*)(?=\s|$)/g;
  
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    if (match[1] && match[2] !== undefined) {
      attrs[match[1]] = parseAttributeValue(match[2]);
    } else if (match[3] && match[4] !== undefined) {
      attrs[match[3]] = parseAttributeValue(match[4]);
    } else if (match[5]) {
      attrs[match[5]] = true;
    }
  }
  
  return attrs;
}

function parseAttributeValue(value: string): any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value === 'undefined') return undefined;
  
  const numValue = Number(value);
  if (!isNaN(numValue) && value.trim() !== '') {
    return numValue;
  }
  
  return value;
}

function processConditionals(template: string, data: any): string {
  let result = template;
  let maxIterations = 10;
  let iteration = 0;

  while (iteration < maxIterations) {
    let hasChanges = false;
    
    const conditionalBlocks = findConditionalBlocks(result);
    
    for (const block of conditionalBlocks) {
      const { fullMatch, type, condition, content, elseContent } = block;
      
      let replacement = '';
      
      if (type === 'if') {
        const isTrue = evaluateCondition(condition, data);
        if (elseContent) {
          replacement = isTrue ? content : elseContent;
        } else {
          replacement = isTrue ? content : '';
        }
      } else if (type === 'unless') {
        const isTrue = evaluateCondition(condition, data);
        replacement = !isTrue ? content : '';
      }
      
      result = result.replace(fullMatch, replacement);
      hasChanges = true;
    }
    
    if (!hasChanges) break;
    iteration++;
  }
  
  return result;
}

function findConditionalBlocks(template: string): Array<{
  fullMatch: string;
  type: string;
  condition: string;
  content: string;
  elseContent?: string;
}> {
  const blocks: Array<any> = [];
  
  let ifStartIndex = 0;
  while (true) {
    const ifMatch = template.indexOf('{{#if ', ifStartIndex);
    if (ifMatch === -1) break;
    
    const conditionStart = ifMatch + 6;
    const conditionEnd = template.indexOf('}}', conditionStart);
    if (conditionEnd === -1) break;
    
    const condition = template.substring(conditionStart, conditionEnd);
    
    let depth = 1;
    let searchIndex = conditionEnd + 2;
    let elseIndex = -1;
    
    while (depth > 0 && searchIndex < template.length) {
      const nextIf = template.indexOf('{{#if', searchIndex);
      const nextElse = template.indexOf('{{else}}', searchIndex);
      const nextEndIf = template.indexOf('{{/if}}', searchIndex);
      
      const candidates = [nextIf, nextElse, nextEndIf].filter(i => i !== -1);
      if (candidates.length === 0) break;
      
      const nextToken = Math.min(...candidates);
      
      if (nextToken === nextIf) {
        depth++;
        searchIndex = nextToken + 5;
      } else if (nextToken === nextElse && depth === 1 && elseIndex === -1) {
        elseIndex = nextToken;
        searchIndex = nextToken + 8;
      } else if (nextToken === nextEndIf) {
        depth--;
        if (depth === 0) {
          const endIfStart = nextToken;
          const endIfEnd = nextToken + 7;
          
          const fullMatch = template.substring(ifMatch, endIfEnd);
          
          let content: string;
          let elseContent: string | undefined;
          
          if (elseIndex !== -1) {
            content = template.substring(conditionEnd + 2, elseIndex);
            elseContent = template.substring(elseIndex + 8, endIfStart);
          } else {
            content = template.substring(conditionEnd + 2, endIfStart);
          }
          
          blocks.push({
            fullMatch,
            type: 'if',
            condition: condition.trim(),
            content: content.trim(),
            elseContent: elseContent ? elseContent.trim() : undefined
          });
          
          break;
        }
        searchIndex = nextToken + 7;
      }
    }
    
    ifStartIndex = ifMatch + 1;
  }
  
  let unlessStartIndex = 0;
  while (true) {
    const unlessMatch = template.indexOf('{{#unless ', unlessStartIndex);
    if (unlessMatch === -1) break;
    
    const conditionStart = unlessMatch + 10;
    const conditionEnd = template.indexOf('}}', conditionStart);
    if (conditionEnd === -1) break;
    
    const condition = template.substring(conditionStart, conditionEnd);
    
    const endUnlessMatch = template.indexOf('{{/unless}}', conditionEnd);
    if (endUnlessMatch === -1) break;
    
    const content = template.substring(conditionEnd + 2, endUnlessMatch);
    const fullMatch = template.substring(unlessMatch, endUnlessMatch + 11);
    
    blocks.push({
      fullMatch,
      type: 'unless',
      condition: condition.trim(),
      content: content.trim()
    });
    
    unlessStartIndex = unlessMatch + 1;
  }
  
  blocks.sort((a, b) => template.indexOf(b.fullMatch) - template.indexOf(a.fullMatch));
  
  return blocks;
}

function findLoopBlocks(template: string): Array<{
  fullMatch: string;
  arrayPath: string;
  content: string;
}> {
  const blocks: Array<any> = [];
  
  let eachStartIndex = 0;
  while (true) {
    const eachMatch = template.indexOf('{{#each ', eachStartIndex);
    if (eachMatch === -1) break;
    
    const pathStart = eachMatch + 8;
    const pathEnd = template.indexOf('}}', pathStart);
    if (pathEnd === -1) break;
    
    const arrayPath = template.substring(pathStart, pathEnd);
    
    let depth = 1;
    let searchIndex = pathEnd + 2;
    
    while (depth > 0 && searchIndex < template.length) {
      const nextEach = template.indexOf('{{#each', searchIndex);
      const nextEndEach = template.indexOf('{{/each}}', searchIndex);
      
      const candidates = [nextEach, nextEndEach].filter(i => i !== -1);
      if (candidates.length === 0) break;
      
      const nextToken = Math.min(...candidates);
      
      if (nextToken === nextEach) {
        depth++;
        searchIndex = nextToken + 7;
      } else if (nextToken === nextEndEach) {
        depth--;
        if (depth === 0) {
          const endEachStart = nextToken;
          const endEachEnd = nextToken + 9;
          
          const content = template.substring(pathEnd + 2, endEachStart);
          const fullMatch = template.substring(eachMatch, endEachEnd);
          
          blocks.push({
            fullMatch,
            arrayPath: arrayPath.trim(),
            content: content.trim()
          });
          
          break;
        }
        searchIndex = nextToken + 9;
      }
    }
    
    eachStartIndex = eachMatch + 1;
  }
  
  blocks.sort((a, b) => template.indexOf(b.fullMatch) - template.indexOf(a.fullMatch));
  
  return blocks;
}

function processLoops(template: string, data: any): string {
  let result = template;
  let maxIterations = 10;
  let iteration = 0;

  while (iteration < maxIterations) {
    let hasChanges = false;
    
    const loopBlocks = findLoopBlocks(result);
    
    for (const block of loopBlocks) {
      const { fullMatch, arrayPath, content } = block;
      
      const array = getNestedValue(data, arrayPath.trim());
      
      if (!Array.isArray(array) || array.length === 0) {
        result = result.replace(fullMatch, '');
        hasChanges = true;
        continue;
      }

      const seenUrls = new Set();
      const uniqueArray = array.filter(item => {
        const url = item?.url || item?.id || JSON.stringify(item);
        if (seenUrls.has(url)) {
          return false;
        }
        seenUrls.add(url);
        return true;
      });

      const loopResult = uniqueArray.map((item, index) => {
        const loopData = {
          ...data,
          ...(typeof item === 'object' && item !== null ? item : {}),
          index,
          isFirst: index === 0,
          isLast: index === uniqueArray.length - 1,
          '@index': index,
          '@first': index === 0,
          '@last': index === uniqueArray.length - 1
        };
        
        if (typeof item === 'string') {
          loopData.this = item;
        } else if (typeof item === 'object' && item !== null) {
          loopData.this = item;
        } else {
          loopData.this = item;
        }
        
        let processedContent = content;
        processedContent = processConditionals(processedContent, loopData);
        processedContent = processVariables(processedContent, loopData);
        
        return processedContent;
      }).join('');
      
      result = result.replace(fullMatch, loopResult);
      hasChanges = true;
    }
    
    if (!hasChanges) break;
    iteration++;
  }
  
  return result;
}

function processVariables(template: string, data: any): string {
  let result = template;

  result = result.replace(/\{\{\s*([^}]+?)\s+or\s+([^}]+?)\s*\}\}/g, (match, primary, fallback) => {
    const primaryValue = getNestedValue(data, primary.trim());
    
    if (primaryValue !== undefined && primaryValue !== null && primaryValue !== '') {
      return String(primaryValue);
    }
    
    const fallbackTrimmed = fallback.trim();
    let fallbackValue;
    
    if ((fallbackTrimmed.startsWith('"') && fallbackTrimmed.endsWith('"')) || 
        (fallbackTrimmed.startsWith("'") && fallbackTrimmed.endsWith("'"))) {
      fallbackValue = fallbackTrimmed.slice(1, -1);
    } else {
      fallbackValue = getNestedValue(data, fallbackTrimmed);
    }
    
    return fallbackValue !== undefined && fallbackValue !== null ? String(fallbackValue) : '';
  });

  result = result.replace(/\{\{\s*([^}|]+?)\s*\|\s*(\w+)\s*\}\}/g, (match, varPath, filterName) => {
    const value = getNestedValue(data, varPath.trim());
    return applyFilter(value, filterName.trim());
  });

  result = result.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, varPath) => {
    const path = varPath.trim();
    const value = getNestedValue(data, path);
    return value !== undefined && value !== null ? String(value) : '';
  });

  return result;
}

function evaluateCondition(condition: string, data: any): boolean {
  try {
    if (condition.includes('===')) {
      const [left, right] = condition.split('===').map(s => s.trim());
      const leftVal = getNestedValue(data, left);
      const rightVal = right.startsWith('"') || right.startsWith("'") 
        ? right.slice(1, -1) 
        : getNestedValue(data, right);
      return leftVal === rightVal;
    }
    
    if (condition.includes('!==')) {
      const [left, right] = condition.split('!==').map(s => s.trim());
      const leftVal = getNestedValue(data, left);
      const rightVal = right.startsWith('"') || right.startsWith("'") 
        ? right.slice(1, -1) 
        : getNestedValue(data, right);
      return leftVal !== rightVal;
    }

    if (condition.includes('.hasPrev')) {
      const paginationPath = condition.replace('.hasPrev', '');
      const pagination = getNestedValue(data, paginationPath);
      return pagination && pagination.hasPrev === true;
    }
    
    if (condition.includes('.hasNext')) {
      const paginationPath = condition.replace('.hasNext', '');
      const pagination = getNestedValue(data, paginationPath);
      return pagination && pagination.hasNext === true;
    }

    if (condition.endsWith('.length')) {
      const arrayPath = condition.replace('.length', '');
      const array = getNestedValue(data, arrayPath);
      return Array.isArray(array) && array.length > 0;
    }

    const value = getNestedValue(data, condition);
    
    if (value === null || value === undefined) {
      return false;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length > 0;
    }
    
    return Boolean(value);
    
  } catch (error) {
    return false;
  }
}

function getNestedValue(obj: any, path: string): any {
  if (!path || typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  if (path === '@key') {
    return obj['@key'];
  }
  
  if (path.includes('[') && path.includes(']')) {
    const parts = path.split(/[$$$$.]/).filter(Boolean);
    return parts.reduce((current, key) => {
      if (current === null || current === undefined) return undefined;
      const numKey = parseInt(key);
      return isNaN(numKey) ? current[key] : current[numKey];
    }, obj);
  }

  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function applyFilter(value: any, filterName: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  switch (filterName) {
    case 'formatDate':
      if (value === 'now') {
        return new Date().getFullYear().toString();
      }
      try {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return String(value);
      }
      
    case 'length':
      if (Array.isArray(value)) {
        return value.length.toString();
      }
      if (typeof value === 'string' || typeof value === 'object') {
        return (value.length || Object.keys(value).length || 0).toString();
      }
      return '0';
      
    case 'uppercase':
      return String(value).toUpperCase();
      
    case 'lowercase':
      return String(value).toLowerCase();
      
    case 'capitalize':
      const str = String(value);
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      
    case 'slugify':
      return String(value)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
        
    case 'excerpt':
      const text = String(value);
      return text.length > 150 ? text.substring(0, 150) + '...' : text;
      
    // 🎯 FIXED: joinTags dengan slug URL
    case 'joinTags':
      if (Array.isArray(value)) {
        return value.map(tag => {
          const tagSlug = String(tag)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
          return `<a href="/tags/${tagSlug}/" class="tag" style="display: inline-block; padding: 2px 8px; margin: 0 2px; background: #e3f2fd; color: #1976d2; text-decoration: none; border-radius: 12px; font-size: 0.85em;">#${tag}</a>`;
        }).join(' ');
      }
      return '';
      
    case 'firstTag':
      if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
      }
      return '';
      
    default:
      return String(value);
  }
}

export function deduplicateArray<T>(array: T[], keyFn?: (item: T) => string): T[] {
  if (!Array.isArray(array)) return [];
  
  const seen = new Set();
  return array.filter(item => {
    const key = keyFn ? keyFn(item) : (item as any)?.url || (item as any)?.id || JSON.stringify(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
