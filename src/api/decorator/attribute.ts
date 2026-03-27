export interface AttributeOptions {
  name?: string;
  type?: NumberConstructor | BooleanConstructor | StringConstructor;
}

/**
 * Decorator to map a Web Component property to a DOM attribute.
 *
 * @param options Configuration object for the attribute or just the attribute name as a string.
 */
export function Attribute(options?: AttributeOptions | string) {
  return function (target: any, propertyKey: string | symbol) {
    const opts = typeof options === 'string' ? { name: options } : options || {};
    const attrName = opts.name || String(propertyKey);
    const type = opts.type || String;

    Object.defineProperty(target, propertyKey, {
      get(this: HTMLElement) {
        const val = this.getAttribute(attrName);
        if (type === Boolean) {
          return val !== null;
        }
        if (type === Number) {
          return val === null ? null : Number(val);
        }
        return val;
      },
      set(this: HTMLElement, value: any) {
        if (type === Boolean) {
          if (value) {
            this.setAttribute(attrName, '');
          } else {
            this.removeAttribute(attrName);
          }
        } else {
          if (value === null || value === undefined) {
            this.removeAttribute(attrName);
          } else {
            this.setAttribute(attrName, String(value));
          }
        }
      },
      enumerable: true,
      configurable: true
    });
  };
}
