---
name: extension-dev
description: Develop and modify browser extensions for Chrome and Firefox. Use when adding features, fixing bugs, or modifying extension code for manifest.json, content scripts, or background workers.
---

# Browser Extension Development

## Overview
This skill helps develop and maintain cross-browser extensions compatible with Chrome and Firefox using Manifest V3.

## Key Principles

### Manifest V3 Standards
- Always use `"manifest_version": 3`
- Use service workers instead of background pages
- Minimize permissions (only request what's needed)
- Declare all resources in manifest

### Content Script Best Practices
- Check DOM existence before manipulation
- Use clear console.log prefixes for debugging
- Clean up event listeners when done
- Avoid blocking the main thread
- Use `run_at` appropriately:
  - `document_start`: Before any DOM loads
  - `document_end`: DOM loaded, resources may still load
  - `document_idle`: Page fully loaded (default)

### Cross-Browser Compatibility
- Test on both Chrome and Firefox
- Use `browser.*` namespace (works in both with polyfill)
- Avoid browser-specific APIs when possible
- Document any browser-specific code

## Development Workflow

1. **Make Changes**
   - Edit manifest.json, content scripts, or background workers
   - Follow project rules in `.claude/project-rules.md`

2. **Test in Chrome**
   - Navigate to `chrome://extensions/`
   - Click "Reload" on the extension
   - Test functionality on target sites
   - Check console for errors

3. **Test in Firefox**
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Click "Reload" on the extension
   - Test functionality on target sites
   - Check console for errors

4. **Version Update**
   - Increment version in manifest.json for releases
   - Follow semantic versioning (major.minor.patch)

## Common Tasks

### Adding a New Content Script
1. Create the .js file
2. Add to manifest.json under `content_scripts`
3. Specify `matches` patterns for target sites
4. Set appropriate `run_at` timing
5. Test on both browsers

### Adding New Permissions
1. Add to `permissions` array in manifest.json
2. Document why the permission is needed
3. Consider user privacy implications
4. Test that permission is properly requested

### Debugging
- Use `console.log()` with clear prefixes
- Check browser console (F12) on target sites
- Check extension popup console (inspect popup)
- Review background service worker console
- Use Chrome DevTools for content script debugging

## Security Checklist
- [ ] No `eval()` or inline scripts
- [ ] Validate all data from web pages
- [ ] Use Content Security Policy
- [ ] Minimize permissions
- [ ] Sanitize user inputs
- [ ] Avoid `innerHTML` with untrusted content

## Files to Always Check
- `manifest.json` - Extension configuration
- `content.js` - Scripts running on target sites
- `README.md` - Keep updated with new features
