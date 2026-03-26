declare global {
  namespace om4u {
    function greet(name: string): string;
    const version: string;

    interface Config {
      apiKey: string;
      endpoint: string;
    }
  }
}

// Needed to make this file a module, so `declare global` works
export {};
