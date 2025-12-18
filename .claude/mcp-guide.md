# MCP Server Configuration

## Overview
This project uses Model Context Protocol (MCP) servers to extend Claude Code's capabilities with file system operations.

## Installed MCP Servers

### Filesystem Server
- **Name**: `filesystem`
- **Type**: stdio (local)
- **Command**: `npx -y @modelcontextprotocol/server-filesystem`
- **Allowed Directory**: `/Users/romain/Workspace/soundcloud-ext`
- **Status**: ✓ Connected

**Capabilities**:
- Read files and directories
- Search for files by pattern
- List directory contents
- Access file metadata

## Using MCP Resources

### In Conversation
You can reference filesystem resources using @ mentions:

```
@filesystem:file:///Users/romain/Workspace/soundcloud-ext/manifest.json
@filesystem:dir:///Users/romain/Workspace/soundcloud-ext/
```

### Search Examples

```
Search for @filesystem files containing "console.log"
List all JavaScript files in @filesystem
Show me the structure of @filesystem
```

## Managing MCP Servers

### View Configuration
```bash
claude mcp list
```

### Check Status
Within Claude Code, use:
```
/mcp
```

### Configuration File
The MCP server configuration is stored in `.mcp.json` at the project root. This file is checked into version control so the entire team has access to the same MCP servers.

## Security Notes

- The filesystem server is scoped to only access files within the project directory
- This prevents accidental access to system files or other projects
- The configuration is shared via git for team consistency

## Adding More MCP Servers

To add additional MCP servers:

```bash
# Project scope (shared with team)
claude mcp add --transport stdio <name> --scope project -- <command>

# User scope (only you)
claude mcp add --transport stdio <name> --scope user -- <command>
```

## Troubleshooting

If the MCP server shows as disconnected:

1. Check that Node.js and npx are installed
2. Verify the directory path exists
3. Run `claude mcp list` to see error details
4. Try restarting Claude Code

## Benefits for This Project

With the filesystem MCP server, you can:

1. **Quick file searches**: Find all occurrences of specific code patterns
2. **Directory exploration**: Browse the project structure efficiently
3. **File metadata**: Check file sizes, modification times, etc.
4. **Content analysis**: Search across multiple files simultaneously

This is particularly useful for:
- Finding where specific extension APIs are used
- Locating all console.log statements
- Searching for SoundCloud-specific DOM selectors
- Auditing security patterns across files
