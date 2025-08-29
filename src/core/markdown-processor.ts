// src/core/markdown-processor.ts - COMPLETE FIX
import { renderAxcora } from './engine.js';
import chalk from 'chalk';

export async function processShortcodes(content: string, data: any): Promise<string> {
  // STEP 1: Check if shortcodes exist
  const hasShortcodes = /{%\s*\w+(?:-\w+)*\s*.*?%}/.test(content);
  
  if (!hasShortcodes) {
    return content; // No shortcodes, return as-is
  }
  
//  console.log(chalk.blue('🔧 Processing shortcodes...'));
  
  // ✅ STEP 2: PROTECT raw blocks and code blocks (MINIMAL PROTECTION)
  const protectedItems: Record<string, string> = {};
  let counter = 0;
  
  let processed = content
    // Protect {% raw %} blocks
    .replace(/{%\s*raw\s*%}([\s\S]*?){%\s*endraw\s*%}/gi, (match) => {
      const placeholder = `__PROTECTED_${counter++}__`;
      protectedItems[placeholder] = match;
      return placeholder;
    })
    // Protect code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const placeholder = `__PROTECTED_${counter++}__`;
      protectedItems[placeholder] = match;
      return placeholder;
    });
  
  try {
    // STEP 3: Process shortcodes (existing code)
    const { getGlobalComponentParser } = await import('./component-parser.js');
    const componentParser = getGlobalComponentParser();
    
    if (!componentParser) {
      console.warn(chalk.yellow('⚠️ Component parser not available, skipping shortcodes'));
      return content;
    }
    
    // Process self-closing shortcodes first
    const selfClosingRegex = /{%\s*(\w+(?:-\w+)*)\s*([^%]*?)\s*\/%}/g;
    let matches = Array.from(processed.matchAll(selfClosingRegex));
    
//    console.log(chalk.gray(`  Found ${matches.length} self-closing shortcodes`));
    
    for (const match of matches) {
      const [fullMatch, componentName, attributesStr] = match;
      
      const component = componentParser.getComponent(componentName);
      if (!component) {
  //    console.warn(chalk.yellow(`  ⚠️ Component '${componentName}' not found`));
        continue;
      }
      
      const props = parseShortcodeAttributes(attributesStr.trim());
      const renderedComponent = renderAxcora(component.template, {
        ...data,
        ...props,
        children: ''
      });
      
      processed = processed.replace(fullMatch, renderedComponent);
//      console.log(chalk.green(`  ✅ Processed: ${componentName}`));
    }
    
    // Process block shortcodes
    const blockRegex = /{%\s*(\w+(?:-\w+)*)\s*([^%]*?)\s*%}([\s\S]*?){%\s*\/\1\s*%}/g;
    matches = Array.from(processed.matchAll(blockRegex));
    
//    console.log(chalk.gray(`  Found ${matches.length} block shortcodes`));
    
    for (const match of matches) {
      const [fullMatch, componentName, attributesStr, children] = match;
      
      const component = componentParser.getComponent(componentName);
      if (!component) {
//      console.warn(chalk.yellow(`  ⚠️ Component '${componentName}' not found`));
        continue;
      }
      
      const props = parseShortcodeAttributes(attributesStr.trim());
      const renderedComponent = renderAxcora(component.template, {
        ...data,
        ...props,
        children: children.trim()
      });
      
      processed = processed.replace(fullMatch, renderedComponent);
  //    console.log(chalk.green(`  ✅ Processed: ${componentName}`));
    }
    
    if (processed !== content) {
//      console.log(chalk.green('✅ Shortcode processing complete'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error processing shortcodes:'), error);
    return content; // Return original on error
  }
  
  // ✅ STEP 4: RESTORE protected items
  Object.entries(protectedItems).forEach(([placeholder, original]) => {
    processed = processed.replace(placeholder, original);
  });
  
  return processed;
}

function parseShortcodeAttributes(attrString: string): Record<string, any> {
  if (!attrString) return {};
  
  const attrs: Record<string, any> = {};
  
  // Enhanced regex for better attribute parsing
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

