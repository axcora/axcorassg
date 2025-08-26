// src/template-engine/template-inheritance.ts
export class TemplateInheritance {
  private activeBlocks: Map<string, string> = new Map();
  private variables: Map<string, any> = new Map();

  /**
   * Process template inheritance with {% extends %} and {% block %}
   */
  processExtends(childTemplate: string, parentTemplate: string): string {
    // Remove {% extends %} directive from child
    const cleanChild = childTemplate.replace(/{%\s*extends\s+['"][^'"]+['"]\s*%}/g, '').trim();
    
    // Extract blocks from child template
    const blockRegex = /{%\s*block\s+(\w+)\s*%}([\s\S]*?){%\s*endblock\s*%}/g;
    const childBlocks = new Map<string, string>();
    
    let match;
    while ((match = blockRegex.exec(cleanChild)) !== null) {
      const [, blockName, blockContent] = match;
      
      // Validate: block must exist in parent template
      if (!parentTemplate.includes(`{% block ${blockName} %}`)) {
        throw new Error(`Block "${blockName}" not defined in parent template`);
      }
      
      childBlocks.set(blockName, blockContent.trim());
    }

    // Replace blocks in parent template
    let result = parentTemplate;
    result = result.replace(blockRegex, (fullMatch: string, blockName: string, parentContent: string) => {
      if (childBlocks.has(blockName)) {
        const childContent = childBlocks.get(blockName)!;
        
        // Handle {{ super }} calls
        if (childContent.includes('{{ super }}')) {
          return childContent.replace(/{{\s*super\s*}}/g, parentContent.trim());
        }
        
        return childContent;
      }
      return fullMatch;
    });

    return result;
  }

  /**
   * ENHANCED: Process complete template with Nunjucks-like features
   */
  processTemplate(template: string, data: any = {}): string {
    let processed = template;
    
    // 1. Process set variables first
    processed = this.processSetVariables(processed, data);
    
    // 2. Process enhanced conditionals
    processed = this.processEnhancedConditionals(processed, data);
    
    // 3. Process enhanced loops
    processed = this.processEnhancedLoops(processed, data);
    
    // 4. Process variables with filters
    processed = this.processVariablesWithFilters(processed, data);
    
    // 5. Process math operations
    processed = this.processMathOperations(processed, data);
    
    return processed;
  }

  /**
   * ENHANCED: Set variables - {% set variable = value %}
   */
processSetVariables(template: string, data: any): string {
  const setRegex = /{%\s*set\s+(\w+)\s*=\s*([^%]+)\s*%}/g;
  
  return template.replace(setRegex, (match: string, variable: string, value: string) => {
    let evalValue: any = value.trim(); // ✅ Type: any (can be string or number)
    
    // Remove quotes if string literal
    if ((evalValue.startsWith('"') && evalValue.endsWith('"')) ||
        (evalValue.startsWith("'") && evalValue.endsWith("'"))) {
      evalValue = evalValue.slice(1, -1);
    }
    // If it's a number
    else if (/^\d+(\.\d+)?$/.test(evalValue)) {
      evalValue = Number(evalValue); // ✅ OK: any can accept number
    }
    // If it's a variable reference
    else if (data[evalValue] !== undefined) {
      evalValue = data[evalValue];
    }
    
    // Store variable for later use
    data[variable] = evalValue;
    
    return ''; // Remove set statement from output
  });
}


  /**
   * ENHANCED: Advanced conditionals with AND/OR
   */
  processEnhancedConditionals(template: string, data: any): string {
    // Enhanced {% if %} with AND/OR logic
    const ifRegex = /{%\s*if\s+(.+?)\s*%}([\s\S]*?)(?:{%\s*else\s*%}([\s\S]*?))?{%\s*endif\s*%}/g;
    
    return template.replace(ifRegex, (match: string, condition: string, trueBlock: string, falseBlock: string = '') => {
      const result = this.evaluateCondition(condition, data);
      return result ? trueBlock : falseBlock;
    });
  }

  /**
   * ENHANCED: Advanced loops with filtering
   */
  processEnhancedLoops(template: string, data: any): string {
    // Enhanced {% for %} with conditions
    const forRegex = /{%\s*for\s+(\w+)\s+in\s+(\w+)(?:\s+if\s+(.+?))?\s*%}([\s\S]*?){%\s*endfor\s*%}/g;
    
    return template.replace(forRegex, (match: string, itemVar: string, arrayVar: string, condition: string | undefined, loopContent: string) => {
      const array = this.getNestedProperty(data, arrayVar);
      if (!Array.isArray(array)) return '';
      
      let filteredArray = array;
      if (condition) {
        filteredArray = array.filter((item: any, index: number) => {
          const itemData = { ...data, [itemVar]: item, loop: { index, first: index === 0, last: index === array.length - 1 } };
          return this.evaluateCondition(condition.replace(new RegExp(`\\b${itemVar}\\b`, 'g'), `${itemVar}`), itemData);
        });
      }
      
      return filteredArray.map((item: any, index: number) => {
        const itemData = {
          ...data,
          [itemVar]: item,
          loop: {
            index,
            index0: index,
            index1: index + 1,
            first: index === 0,
            last: index === filteredArray.length - 1,
            length: filteredArray.length
          }
        };
        
        return this.processVariablesWithFilters(loopContent, itemData);
      }).join('');
    });
  }

  /**
   * ENHANCED: Variables with advanced filters
   */
  processVariablesWithFilters(template: string, data: any): string {
    // Process {{ variable | filter:param }}
    const variableRegex = /{{\s*([^}]+?)\s*}}/g;
    
    return template.replace(variableRegex, (match: string, expression: string) => {
      return this.processExpression(expression, data);
    });
  }

  /**
   * ENHANCED: Math operations - {{ price * 1.1 }}
   */
  processMathOperations(template: string, data: any): string {
    // Simple math operations in variables
    const mathRegex = /{{\s*([^}]+?[\+\-\*\/\%][^}]+?)\s*}}/g;
    
    return template.replace(mathRegex, (match: string, expression: string) => {
      try {
        // Safety: only allow basic math with variables
        let mathExpr = expression;
        
        // Replace variables with their values
        const varRegex = /\b([a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*)\b/g;
        mathExpr = mathExpr.replace(varRegex, (varMatch: string) => {
          const value = this.getNestedProperty(data, varMatch);
          return typeof value === 'number' ? value.toString() : '0';
        });
        
        // Evaluate simple math (basic safety check)
        if (/^[\d\+\-\*\/$$$$\.\s]+$/.test(mathExpr)) {
          const result = Function('"use strict"; return (' + mathExpr + ')')();
          return isNaN(result) ? '0' : result.toString();
        }
        
        return match;
      } catch (error) {
        console.warn('Math operation failed:', expression, error);
        return '0';
      }
    });
  }

  /**
   * Process single expression with filters
   */
  processExpression(expression: string, data: any): string {
    const parts = expression.split('|').map((p: string) => p.trim());
    let value = parts[0];
    
    // Handle fallbacks - title or "Default"
    if (value.includes(' or ')) {
      const fallbackParts = value.split(' or ').map((p: string) => p.trim());
      value = fallbackParts[0];
      
      let result = this.getNestedProperty(data, value);
      if (!result) {
        for (let i = 1; i < fallbackParts.length; i++) {
          const fallback = fallbackParts[i];
          if (fallback.startsWith('"') && fallback.endsWith('"')) {
            result = fallback.slice(1, -1);
            break;
          } else {
            result = this.getNestedProperty(data, fallback);
            if (result) break;
          }
        }
      }
      value = result || '';
    } else {
      // Simple variable or literal
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1); // String literal
      } else {
        value = this.getNestedProperty(data, value) || '';
      }
    }
    
    // Apply filters
    for (let i = 1; i < parts.length; i++) {
      const filterPart = parts[i];
      const [filterName, ...filterArgs] = filterPart.split(':');
      
      value = this.applyFilter(value, filterName.trim(), filterArgs.map((arg: string) => arg.trim()));
    }
    
    return String(value);
  }

  /**
   * ENHANCED: Comprehensive filter system
   */
  applyFilter(value: any, filterName: string, args: string[] = []): any {
    switch (filterName) {
      // Date filters
      case 'formatDate':
      case 'date':
        if (value === 'now') return new Date().toLocaleDateString();
        const format = args[0] || 'long';
        const date = new Date(value);
        switch (format) {
          case 'short': return date.toLocaleDateString();
          case 'long': return date.toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
          });
          case 'iso': return date.toISOString().split('T')[0];
          default: return date.toLocaleDateString();
        }
        
      // String filters
      case 'upper':
      case 'uppercase':
        return String(value).toUpperCase();
        
      case 'lower':
      case 'lowercase':
        return String(value).toLowerCase();
        
      case 'capitalize':
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
        
      case 'title':
        return String(value).replace(/\w\S*/g, (txt: string) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        
      case 'truncate':
        const maxLength = parseInt(args[0]) || 100;
        const suffix = args[1] || '...';
        return String(value).length > maxLength 
          ? String(value).substring(0, maxLength) + suffix 
          : String(value);
          
      case 'slugify':
        return String(value)
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[-\s]+/g, '-')
          .trim();
          
      case 'escape':
      case 'e':
        return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
          
      case 'striptags':
        return String(value).replace(/<[^>]*>/g, '');
        
      case 'wordcount':
        return String(value).split(/\s+/).length;
        
      // Array filters
      case 'length':
      case 'count':
        if (Array.isArray(value)) return value.length;
        if (typeof value === 'object') return Object.keys(value).length;
        return String(value).length;
        
      case 'first':
        return Array.isArray(value) ? value[0] : value;
        
      case 'last':
        return Array.isArray(value) ? value[value.length - 1] : value;
        
      case 'join':
        const separator = args[0] || ', ';
        return Array.isArray(value) ? value.join(separator) : value;
        
      case 'reverse':
        return Array.isArray(value) ? [...value].reverse() : value;
        
      case 'sort':
        if (!Array.isArray(value)) return value;
        const sortKey = args[0];
        return sortKey 
          ? [...value].sort((a: any, b: any) => (a[sortKey] > b[sortKey] ? 1 : -1))
          : [...value].sort();
          
      case 'unique':
      case 'uniq':
        return Array.isArray(value) ? [...new Set(value)] : value;
        
      case 'slice':
        const start = parseInt(args[0]) || 0;
        const end = args[1] ? parseInt(args[1]) : undefined;
        if (Array.isArray(value)) return value.slice(start, end);
        return String(value).slice(start, end);
        
      // Number filters
      case 'abs':
        return Math.abs(Number(value));
        
      case 'round':
        const precision = parseInt(args[0]) || 0;
        return Number(Number(value).toFixed(precision));
        
      case 'ceil':
        return Math.ceil(Number(value));
        
      case 'floor':
        return Math.floor(Number(value));
        
      case 'int':
        return parseInt(String(value));
        
      case 'float':
        return parseFloat(String(value));
        
      // Utility filters
      case 'default':
        return value || args[0] || '';
        
      case 'safe':
        return value; // Return raw HTML (be careful!)
        
      case 'json':
        return JSON.stringify(value);
        
      case 'urlencode':
        return encodeURIComponent(String(value));
        
      default:
        console.warn(`Unknown filter: ${filterName}`);
        return value;
    }
  }

  /**
   * Evaluate complex conditions (AND, OR, comparisons)
   */
  evaluateCondition(condition: string, data: any): boolean {
    // Handle AND/OR logic
    if (condition.includes(' and ')) {
      return condition.split(' and ').every((cond: string) => 
        this.evaluateSingleCondition(cond.trim(), data));
    }
    
    if (condition.includes(' or ')) {
      return condition.split(' or ').some((cond: string) => 
        this.evaluateSingleCondition(cond.trim(), data));
    }
    
    return this.evaluateSingleCondition(condition, data);
  }

  /**
   * Evaluate single condition
   */
  evaluateSingleCondition(condition: string, data: any): boolean {
    // Handle comparisons
    const operators = ['===', '!==', '==', '!=', '>=', '<=', '>', '<'];
    
    for (const op of operators) {
      if (condition.includes(op)) {
        const [left, right] = condition.split(op).map((s: string) => s.trim());
        const leftValue = this.getValueOrLiteral(left, data);
        const rightValue = this.getValueOrLiteral(right, data);
        
        switch (op) {
          case '===': return leftValue === rightValue;
          case '!==': return leftValue !== rightValue;
          case '==': return leftValue == rightValue;
          case '!=': return leftValue != rightValue;
          case '>=': return Number(leftValue) >= Number(rightValue);
          case '<=': return Number(leftValue) <= Number(rightValue);
          case '>': return Number(leftValue) > Number(rightValue);
          case '<': return Number(leftValue) < Number(rightValue);
        }
      }
    }
    
    // Simple truthiness check
    const value = this.getNestedProperty(data, condition);
    return Boolean(value);
  }

  /**
   * Get value or literal from expression
   */
  getValueOrLiteral(expr: string, data: any): any {
    expr = expr.trim();
    
    // String literal
    if ((expr.startsWith('"') && expr.endsWith('"')) ||
        (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    
    // Number literal
    if (/^-?\d+(\.\d+)?$/.test(expr)) {
      return Number(expr);
    }
    
    // Boolean literal
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (expr === 'undefined') return undefined;
    
    // Variable reference
    return this.getNestedProperty(data, expr);
  }

  /**
   * Get nested property value (e.g., "site.title", "user.profile.name")
   */
  getNestedProperty(obj: any, path: string): any {
    if (!path || !obj) return obj;
    
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Process theme variables in templates
   */
  processThemeVariables(template: string, themeVariables: Record<string, string>): string {
    const themeVarRegex = /{%\s*theme-var\s+([a-zA-Z0-9-_]+)\s*%}/g;
    
    return template.replace(themeVarRegex, (match: string, variableName: string) => {
      const cssVar = `var(--${variableName})`;
      return themeVariables[variableName] || cssVar;
    });
  }

  /**
   * Extract all block names from a template
   */
  extractBlocks(template: string): string[] {
    const blockRegex = /{%\s*block\s+(\w+)\s*%}/g;
    const blocks: string[] = [];
    let match;
    
    while ((match = blockRegex.exec(template)) !== null) {
      blocks.push(match[1]);
    }
    
    return blocks;
  }

  /**
   * Generate theme-specific CSS imports
   */
  generateThemeCSSImports(theme: string, components: string[] = []): string {
    const baseCSS = `
      <link rel="stylesheet" href="/css/axcora.css">
      <link rel="stylesheet" href="/css/axcora-utilities.css">
      <link rel="stylesheet" href="/css/themes/${theme}/theme.css">
    `;

    const componentCSS = components.length > 0 
      ? `<link rel="stylesheet" href="/css/themes/${theme}/components.css">`
      : '';

    return baseCSS + componentCSS;
  }
}

export default TemplateInheritance;
