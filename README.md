# openMap4u App

This is a TypeScript Node.js project configured to use ES Modules (`"type": "module"`).

## Architecture

This project implements a custom, vanilla Web Component architecture without relying on external frameworks. It uses standard DOM APIs and custom decorators (e.g., `@Provider`, `@Consumer`, `@Select`, `@Attribute`, `@customElement`, `@style`) to handle element registration, state, and attribute synchronization natively.

### Core Features:
- **Custom Global Namespace**: The project features a custom global namespace named `om4u`, which is attached to `globalThis` at runtime.
- **State Management & Context API**: Web Components use a custom DOM-based Context API and signals. The custom `Signal` implementation supports deep reactivity for objects and arrays via Proxies.
- **Decorators**: The framework relies on a suite of custom decorators located in `src/api/decorator/` to manage context, state, attributes, styling, and element registration natively.

## Development

### Storybook

The project uses Storybook for UI component development, configured for Web Components with the Vite builder.

To start the Storybook development server:
```bash
npm run storybook
```

To build Storybook for production:
```bash
npm run build-storybook
```

### Testing

The project uses [Vitest](https://vitest.dev/) for testing. DOM-dependent component tests are supported using `jsdom`.

To run tests:
```bash
npm run test
```

*Note: Test files should be separated and organized to strictly mirror the source code file structure.*
