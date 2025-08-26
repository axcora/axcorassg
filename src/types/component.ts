// src/types/component.ts
export interface ComponentProps {
  [key: string]: any;
}

export interface ComponentMeta {
  name: string;
  props: Record<string, ComponentPropDefinition>;
  styles?: string;
  scripts?: string;
}

export interface ComponentPropDefinition {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  default?: any;
  description?: string;
}

export interface Component {
  name: string;
  template: string;
  meta: ComponentMeta;
  render: (props: ComponentProps, children?: string) => string;
}

export interface ComponentContext {
  props: ComponentProps;
  children?: string;
  slots?: Record<string, string>;
  globalData?: any;
}
