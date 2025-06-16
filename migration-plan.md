# Project Migration Plan to Astro

## Current Structure
- Root project: Node.js with workspaces
- agent-ui: Astro frontend
- ai: Node.js module for AI-powered test generation
- runner: Node.js module for test execution
- tests: Playwright tests

## New Structure (Astro Monorepo)
- Root: Astro project with integrated functionality
- src/
  - pages/ (existing Astro pages with additional functionality)
  - components/ (existing UI components)
  - lib/ (shared utilities)
  - services/
    - ai/ (migrated AI functionality)
    - runner/ (migrated runner functionality)
  - api/ (SSR API endpoints for services)
- tests/ (maintained as is)
- public/ (static assets)

## Migration Steps
1. Update Astro configuration
2. Move and adapt AI functionality to Astro
3. Move and adapt runner functionality to Astro
4. Create API endpoints for service functionality
5. Update scripts and workflow
6. Test the migrated project

## Benefits
- Single integrated codebase
- Better routing with Astro's file-based routing
- Improved DX with integrated tooling
- SSR capability for better performance
- API routes for backend functionality
- Simplified deployment
