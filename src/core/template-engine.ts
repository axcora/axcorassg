// src/core/template-engine.ts - FINAL FIX
import { readFileSync, existsSync } from "fs";
import path from "path";
import chalk from "chalk";

export function renderAxcora(template: string, data: Record<string, any>): string {
  try {
    console.log(chalk.gray(`🎨 Rendering template (${template.length} chars)...`));
    
    // Handle includes first
    template = processIncludes(template, data);
    
    // Handle conditional expressions with "or"
    template = processOrExpressions(template, data);
    
    // Handle each loops
    template = processEachLoops(template, data);
    
    // ✅ FIXED: Better if/else processing
    template = processIfElseConditions(template, data);
    
    // Handle unless conditions
    template = processUnlessConditions(template, data);
    
    // Handle simple variables and filters
    template = processVariables(template, data);

    console.log(chalk.gray(`✅ Template rendered successfully`));
    return template;
  } catch (error) {
    // FIXED: Proper error type handling
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Template rendering error:', errorMsg);
    return `<!-- Template rendering error: ${errorMsg} -->`;
  }
}

function processIncludes(template: string, data: Record<string, any>): string {
  return template.replace(
    /{%\s*include\s+([^\s%]+)\s*%}/g,
    (match, includePath) => {
      try {
        const fullIncludePath = path.join(process.cwd(), "src", "templates", "includes", includePath);
        
        if (!existsSync(fullIncludePath)) {
          return `<!-- Include ${includePath} not found -->`;
        }
        
        const includeContent = readFileSync(fullIncludePath, 'utf-8');
        return renderAxcora(includeContent, data);
      } catch (error) {
        return `<!-- Include ${includePath} error -->`;
      }
    }
  );
}

function processOrExpressions(template: string, data: Record<string, any>): string {
  return template.replace(
    /{{\s*([^{}]+?)\s+or\s+([^{}]+?)\s*}}/g,
    (match, primary, fallback) => {
      const primaryValue = evaluateExpression(primary.trim(), data);
      if (primaryValue && primaryValue !== '' && primaryValue !== 0) {
        return String(primaryValue);
      }
      
      const fallbackValue = evaluateExpression(fallback.trim(), data);
      return String(fallbackValue || '');
    }
  );
}

function processEachLoops(template: string, data: Record<string, any>): string {
  let maxIterations = 10;
  
  while (template.includes('{{#each') && maxIterations > 0) {
    const beforeTemplate = template;
    
    template = template.replace(
      /{{#each\s+(\w+(?:\.\w+)*)\s*}}((?:(?!{{#each|{{\/each}})[\s\S])*?){{\/each}}/,
      (match, key, content) => {
        const items = getNestedValue(data, key);
        
        if (!Array.isArray(items) || items.length === 0) {
          return '';
        }
        
        return items.map((item: any, index: number) => {
          if (typeof item === 'string' || typeof item === 'number') {
            return content.replace(/{{\s*this\s*}}/gi, String(item));
          } else {
            const itemContext = { 
              ...data,
              ...item,
              index: index + 1,
              isFirst: index === 0,
              isLast: index === items.length - 1
            };
            return renderAxcora(content, itemContext);
          }
        }).join('');
      }
    );
    
    if (template === beforeTemplate) break;
    maxIterations--;
  }
  
  return template;
}

// ✅ COMPLETELY REWRITTEN: If/Else condition processing
function processIfElseConditions(template: string, data: Record<string, any>): string {
  let maxIterations = 20;
  
  while ((template.includes('{{#if') || template.includes('{{else}}')) && maxIterations > 0) {
    const beforeTemplate = template;
    
    // ✅ NEW: Handle if/else/endif blocks properly
    template = template.replace(
      /{{#if\s+([^{}]+?)}}((?:(?!{{#if|{{else}}|{{\/if}})[\s\S])*?)(?:{{else}}((?:(?!{{#if|{{\/if}})[\s\S])*?))?{{\/if}}/g,
      (match, condition, ifContent, elseContent) => {
        console.log(chalk.gray(`   🔍 Processing if/else: "${condition.trim()}"`));
        
        const conditionResult = evaluateCondition(condition.trim(), data);
        console.log(chalk.gray(`   📊 Condition result: ${conditionResult}`));
        
        if (conditionResult) {
          console.log(chalk.gray(`   ✅ Taking IF branch`));
          return renderAxcora(ifContent, data);
        } else if (elseContent !== undefined) {
          console.log(chalk.gray(`   ❌ Taking ELSE branch`));
          return renderAxcora(elseContent, data);
        } else {
          console.log(chalk.gray(`   ❌ No ELSE branch, returning empty`));
          return '';
        }
      }
    );
    
    // ✅ Handle simple if blocks without else
    template = template.replace(
      /{{#if\s+([^{}]+?)}}((?:(?!{{#if|{{else}}|{{\/if}})[\s\S])*?){{\/if}}/g,
      (match, condition, content) => {
        console.log(chalk.gray(`   🔍 Processing simple if: "${condition.trim()}"`));
        
        const conditionResult = evaluateCondition(condition.trim(), data);
        console.log(chalk.gray(`   📊 Condition result: ${conditionResult}`));
        
        if (conditionResult) {
          console.log(chalk.gray(`   ✅ Taking IF branch`));
          return renderAxcora(content, data);
        } else {
          console.log(chalk.gray(`   ❌ Condition false, returning empty`));
          return '';
        }
      }
    );
    
    if (template === beforeTemplate) break;
    maxIterations--;
  }
  
  if (maxIterations === 0) {
    console.warn(chalk.yellow('⚠️ Maximum iterations reached in processIfElseConditions'));
  }
  
  return template;
}

function processUnlessConditions(template: string, data: Record<string, any>): string {
  return template.replace(
    /{{#unless\s+([^{}]+?)}}((?:(?!{{#unless|{{\/unless}})[\s\S])*?){{\/unless}}/g,
    (match, condition, content) => {
      if (!evaluateCondition(condition.trim(), data)) {
        return renderAxcora(content, data);
      }
      return '';
    }
  );
}

function processVariables(template: string, data: Record<string, any>): string {
  return template.replace(
    /{{\s*([^{}]+?)(?:\s*\|\s*(\w+))?\s*}}/g, 
    (match, expression, filter) => {
      // Handle quoted strings first
      if ((expression.startsWith('"') && expression.endsWith('"')) || 
          (expression.startsWith("'") && expression.endsWith("'"))) {
        const stringValue = expression.slice(1, -1);
        
        if (filter === 'formatDate') {
          return formatDate(stringValue, stringValue);
        }
        
        return stringValue;
      }
      
      // Handle object properties
      let value = getNestedValue(data, expression.trim());
      
      if (value === undefined || value === null) {
        return '';
      }
      
      if (filter === 'formatDate') {
        return formatDate(value, expression.trim());
      }
      
      if (filter === 'length') {
        return getLength(value);
      }
      
      return String(value);
    }
  );
}

function formatDate(value: any, key: string): string {
  if (key === 'now') {
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
}

function getLength(value: any): string {
  if (Array.isArray(value)) {
    return String(value.length);
  } else if (typeof value === 'object' && value !== null) {
    return String(Object.keys(value).length);
  } else {
    return String(String(value).length);
  }
}

// ✅ IMPROVED: Better condition evaluation
function evaluateCondition(condition: string, data: Record<string, any>): boolean {
  try {
    console.log(chalk.gray(`   🔍 Evaluating: "${condition}" with data keys: ${Object.keys(data).join(', ')}`));
    
    if (condition.includes('===')) {
      const [left, right] = condition.split('===').map(s => s.trim());
      const leftValue = evaluateExpression(left, data);
      const rightValue = evaluateExpression(right, data);
      console.log(chalk.gray(`   📊 Comparing: "${leftValue}" === "${rightValue}"`));
      return leftValue === rightValue;
    }
    
    if (condition.includes('.length')) {
      const arrayKey = condition.replace('.length', '');
      let arrayValue = getNestedValue(data, arrayKey);
      
      if (typeof arrayValue === 'string') {
        arrayValue = arrayValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
      
      const result = Array.isArray(arrayValue) ? arrayValue.length > 0 : false;
      console.log(chalk.gray(`   📊 Array length check: ${arrayKey} = ${JSON.stringify(arrayValue)} → ${result}`));
      return result;
    }
    
    const value = getNestedValue(data, condition);
    console.log(chalk.gray(`   📊 Value check: ${condition} = ${JSON.stringify(value)}`));
    
    // ✅ FIXED: Better truthiness evaluation
    if (value === undefined || value === null) {
      return false;
    }
    
    if (typeof value === 'boolean') {
      return value;
    }
    
    if (typeof value === 'string') {
      return value.length > 0 && value !== 'false' && value !== '0';
    }
    
    if (typeof value === 'number') {
      return value !== 0;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
    
    return !!value;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(chalk.red(`❌ Condition evaluation error: ${condition}`), errorMsg);
    return false;
  }
}

function evaluateExpression(expression: string, data: Record<string, any>): any {
  try {
    if ((expression.startsWith('"') && expression.endsWith('"')) || 
        (expression.startsWith("'") && expression.endsWith("'"))) {
      return expression.slice(1, -1);
    }
    
    return getNestedValue(data, expression);
  } catch {
    return '';
  }
}

function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  
  try {
    return path.split('.').reduce((current, prop) => {
      return current && typeof current === 'object' ? current[prop] : undefined;
    }, obj);
  } catch {
    return undefined;
  }
}
