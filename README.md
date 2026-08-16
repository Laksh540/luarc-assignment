# Luarc Assignment

## Setup

Install dependencies:

```bash
npm install
```

For local configuration, copy `.env.example` to `.env` and update values as needed. Keep `.env` local; only variables prefixed with `VITE_` are available to browser code.

## Development

Start the frontend and mock API together:

```bash
npm run dev:all
```

This starts the Vite development server and the mock API on port 3001. Press
`Ctrl+C` to stop both processes.

To start only the Vite development server:

```bash
npm run dev
```

Run validation and production checks:

```bash
npm run lint
npm run typecheck
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Mock API

The mock API serves paginated assets from `data/assets.json` at
`http://localhost:3001/assets`. The optional `search` parameter performs a
case-insensitive substring search across asset names and ticker symbols. The
`assetType` and `currency` parameters provide case-insensitive exact-match
filters. Search and filters are applied before pagination.

Examples:

```text
GET /assets?search=apple&page=1&limit=50
GET /assets?search=AAPL
GET /assets?assetType=Equity&currency=USD&page=1&limit=50
GET /assets?search=apple&assetType=Equity
```

Responses have the shape:

```json
{
  "assets": [],
  "metadata": {
    "total": 50000,
    "page": 1,
    "limit": 50,
    "totalPages": 1000,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextPage": 2
  }
}
```

The metadata is calculated after search and filters are applied. When no next
page exists, `hasNextPage` is `false` and `nextPage` is `null`. Clients can
continue loading results while `hasNextPage` is `true`, using `nextPage` for
the following request.

The project uses React, TypeScript, Vite, and Tailwind CSS.

---

## Vite template reference

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
