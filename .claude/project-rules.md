# SoundCloud Extension - Project Rules

## Project Overview
This is a browser extension (Chrome/Firefox compatible) that adds console logging functionality to the SoundCloud website.

## Extension Structure Rules

### Manifest Version
- Always use Manifest V3 for compatibility with modern Chrome and Firefox
- Keep the manifest simple and only add permissions when absolutely necessary

### File Organization
- `src/` - TypeScript source files (edit these)
  - `content.ts` - Content script source
  - Future: `background.ts`, popup scripts, etc.
- `dist/` - Compiled JavaScript (auto-generated, never edit directly)
- `manifest.json` - Extension configuration (single source of truth)
- `package.json` - Dependencies and build scripts
- `tsconfig.json` - TypeScript compiler configuration

### Content Script Guidelines
- Content scripts should be lightweight and non-intrusive
- Always check if elements exist before manipulating them
- Use `console.log` with clear prefixes to distinguish extension logs
- Run at `document_start` for early execution or `document_idle` for DOM-ready execution

### Browser Compatibility
- Test on both Chrome and Firefox
- Avoid browser-specific APIs unless absolutely necessary
- Use standard Web APIs when possible
- Document any browser-specific behavior

### Code Style
- Write all code in TypeScript (`.ts` files in `src/`)
- Use explicit type annotations for function parameters and return types
- Define interfaces for complex data structures
- Use `const` and `let` (never `var`)
- Use clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Target ES2020+ for modern browser features

### Security
- Never inject untrusted content into the page
- Validate all data from the page before using it
- Minimize permissions in manifest.json
- Avoid using `eval()` or inline scripts

### Performance
- Minimize DOM queries
- Use event delegation when possible
- Clean up event listeners and observers when no longer needed
- Avoid blocking the main thread

### Version Control
- Commit logical, atomic changes
- Write clear commit messages
- Keep the .gitignore updated for build artifacts
- Only commit source files (`src/`), not compiled output (`dist/`)

### TypeScript Build Process
- Run `npm install` after cloning the repository
- Build TypeScript: `npm run build` (compiles `src/*.ts` → `dist/*.js`)
- Development mode: `npm run watch` (auto-rebuild on file changes)
- Always build before testing the extension
- Never edit files in `dist/` directly - they are auto-generated
- TypeScript errors must be fixed before the code will compile

### Testing
- Build the project first: `npm run build`
- Manually test on both Chrome and Firefox after changes
- Reload the extension after building (don't forget this step!)
- Test on different SoundCloud pages (home, track, playlist, profile)
- Check browser console for errors
- Verify extension loads correctly after browser restart
- Check for TypeScript compilation errors in the terminal

### MCP Servers
- The project uses MCP (Model Context Protocol) servers for enhanced development capabilities
- **filesystem** server provides file search and directory browsing
- Configuration is stored in `.mcp.json` and shared via git
- Use `@filesystem` to reference project files in conversations with Claude
- Check server status with `claude mcp list` or `/mcp` in Claude Code
- Only add MCP servers that benefit the entire team (project scope)

## Future Enhancements Guidelines
If adding new features:
- Update manifest.json version number
- Document new permissions if needed
- Update README.md with new functionality
- Consider user privacy and performance impact
