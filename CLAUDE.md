# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
```bash
yarn dev             # Start development server
yarn build           # Build for production
yarn lint            # Run ESLint with auto-fix
yarn typecheck       # Run Vue TypeScript checking
yarn test            # Run tests (use `vitest run testName` for single test)
```

## Code Style
- 2-space indentation
- kebabCase for filenames (except Vue files in client/)
- ESLint with @viapip/eslint-config
- Auto-format on save via ESLint
- Vue 3 Composition API with `<script setup lang="ts">`
- Import organization: local paths use @/ alias
- TypeScript strict mode enabled
- Follow shadcn-vue component patterns
- Error handling: centralized in server/errors