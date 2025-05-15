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

## Quality Assurance
- After any file changes, always run `yarn typecheck` to verify TypeScript correctness
- Fix any type errors before committing changes

## Documentation
- Always use Context7 as the primary tool for fetching library documentation
- Run `mcp__context7__resolve-library-id` followed by `mcp__context7__get-library-docs` for obtaining up-to-date library documentation
- Only fall back to other documentation sources if Context7 doesn't have the required library

## Project Rules
- Primary project rules are located in `.cursor/rules/index.mdc` - this file should be consulted first and strictly followed to understand project architecture
- Additional specialized rules in `.cursor/rules/` directory are optional and referenced as needed
- The index.mdc file provides an overview of all available rules and serves as the entry point
- When making significant architectural changes or major code modifications, update the relevant `.cursor/rules/` files to reflect these changes
