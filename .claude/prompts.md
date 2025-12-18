# Project Context

## What is this project?
A cross-browser extension (Chrome/Firefox) that adds console logging functionality to SoundCloud.com.

## Current Features
- Logs when the extension loads on SoundCloud
- Displays current URL and timestamp in console
- Runs on all SoundCloud pages

## Tech Stack
- Manifest V3 (browser extension standard)
- Vanilla JavaScript (no frameworks)
- Content scripts injected into SoundCloud pages

## Key Files
- `manifest.json` - Extension configuration and permissions
- `content.js` - Script that runs on SoundCloud pages
- `README.md` - User-facing documentation
- `.mcp.json` - MCP server configuration (filesystem access)

## MCP Server
- **filesystem**: Provides file search and directory browsing capabilities
- Use `@filesystem` to reference project files in conversations
- Configuration in `.mcp.json` (shared with team via git)

## Development Workflow
1. Make code changes
2. Test in Chrome (`chrome://extensions/`)
3. Test in Firefox (`about:debugging`)
4. Verify console logs appear on soundcloud.com
5. Commit changes

## When Working on This Project
- Always maintain Manifest V3 compatibility
- Keep the extension lightweight
- Test on both browsers before committing
- Follow the rules in `.claude/project-rules.md`
