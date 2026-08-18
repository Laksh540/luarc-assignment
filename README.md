# Luarc Assignment

## Installation

Install dependencies:

```bash
npm install
```

For local configuration, copy `.env.example` to `.env` and update values as needed. Keep `.env` local; only variables prefixed with `VITE_` are available to browser code.

## Generating data

The mock API reads asset records from `data/assets.json`. Generate the default
dataset of 50,000 deterministic records with:

```bash
npm run generate-assets
```

To generate a different number of records, pass the count as an argument:

```bash
npm run generate-assets -- 100000
```

The generator writes to `data/assets.json` and skips generation if that file
already exists. Delete or move the existing file before generating a new
dataset. The generated data uses a fixed seed, so the same count produces the
same records.

## Running the project

Start the frontend and mock API together:

```bash
npm run dev:all
```

This starts the Vite development server and the mock API on port 3001. Press `Ctrl+C` to stop both processes.

To start only the Vite development server:

```bash
npm run dev
```


