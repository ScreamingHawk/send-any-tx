# Send Any Tx

A dapp for sending transactions built with Vite, React, TypeScript, and pnpm.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10.15.0+

### Installation

```bash
pnpm install
```

This will automatically install lefthook hooks via the `prepare` script.

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

### Linting

```bash
pnpm lint
```

### Formatting

```bash
pnpm format
```

## Pre-commit Hooks

This repository uses [lefthook](https://github.com/evilmartians/lefthook) to automatically run linting and formatting on staged files before each commit. The hooks are installed automatically when you run `pnpm install`.

If you need to manually install or reinstall the hooks:

```bash
pnpm prepare
```

## GitHub Pages Deployment

The repository is configured to automatically build and deploy to GitHub Pages when changes are pushed to the `main` branch.

Make sure to enable GitHub Pages in your repository settings:

1. Go to Settings > Pages
2. Select "GitHub Actions" as the source

## License

[MIT](./LICENSE)
