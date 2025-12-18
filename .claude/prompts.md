# Project Context

## What is this project?
A cross-browser extension (Chrome/Firefox) that adds a custom action button to SoundCloud playlist pages.

## Current Features
- Detects SoundCloud playlist/set pages (URLs with `/sets/`)
- Injects a custom button with icon into the playlist header action bar
- Button displays the extension icon inline before the text "Get sets info"
- Extracts all track data from playlist:
  - Track titles
  - Artist/username
  - Clean URLs (without query parameters)
- Smart loading detection: warns if track count is multiple of 30 (lazy-load batch)
- Copies track data to clipboard as JSON
- Displays track data in console table format
- Handles SPA navigation automatically (SoundCloud doesn't reload pages)
- Integrates seamlessly with SoundCloud's existing UI design

## Tech Stack
- Manifest V3 (browser extension standard)
- TypeScript (for type safety and better tooling)
- Node.js build process (npm)
- Content scripts injected into SoundCloud pages

## Key Files
- `src/content.ts` - TypeScript source for content script
- `dist/content.js` - Compiled JavaScript (auto-generated)
- `manifest.json` - Extension configuration and permissions
- `package.json` - Dependencies and build scripts
- `tsconfig.json` - TypeScript compiler configuration
- `.mcp.json` - MCP server configuration (filesystem access)
- `README.md` - User-facing documentation

## MCP Server
- **filesystem**: Provides file search and directory browsing capabilities
- Use `@filesystem` to reference project files in conversations
- Configuration in `.mcp.json` (shared with team via git)

## Development Workflow
1. Edit TypeScript source files in `src/`
2. Build the project: `npm run build` (or use `npm run watch` for auto-rebuild)
3. Test in Chrome (`chrome://extensions/` → Reload extension)
4. Test in Firefox (`about:debugging` → Reload extension)
5. Verify console logs appear on soundcloud.com
6. Commit changes (source files only, `dist/` is gitignored)

## When Working on This Project
- Write TypeScript code in `src/` directory (never edit `dist/` directly)
- Build before testing: `npm run build`
- Always maintain Manifest V3 compatibility
- Keep the extension lightweight
- Test on both browsers before committing
- Use TypeScript types for better code quality
- Follow the rules in `.claude/project-rules.md`
