// Implementing the global namespace properties
(globalThis as any).om4u = {
  version: '1.0.0',
  greet: (name: string) => `Hello from om4u, ${name}!`
};

export const getVersion = () => globalThis.om4u.version;
export const sayHello = (name: string) => globalThis.om4u.greet(name);
