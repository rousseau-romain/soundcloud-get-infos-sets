---
name: extension-test
description: Test browser extensions across Chrome and Firefox. Use when verifying extension functionality, checking for bugs, or validating changes work correctly.
allowed-tools: Bash, Read, Grep
---

# Browser Extension Testing

## Overview
Systematic testing approach for browser extensions to ensure functionality across Chrome and Firefox.

## Testing Checklist

### Pre-Test Setup
- [ ] Latest changes saved
- [ ] manifest.json is valid JSON
- [ ] All referenced files exist
- [ ] No syntax errors in JavaScript files

### Chrome Testing
1. **Load Extension**
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Reload" if already loaded, or "Load unpacked"
   - Check for load errors

2. **Functionality Testing**
   - Navigate to target website (e.g., soundcloud.com)
   - Open DevTools Console (F12)
   - Verify expected behavior occurs
   - Check for console errors or warnings
   - Test on different pages of the site

3. **Permission Verification**
   - Ensure only necessary permissions requested
   - Check that permissions work as expected

### Firefox Testing
1. **Load Extension**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select manifest.json
   - Check for load errors or warnings

2. **Functionality Testing**
   - Navigate to target website
   - Open Browser Console (Ctrl+Shift+J)
   - Verify expected behavior occurs
   - Check for console errors or warnings
   - Test on different pages of the site

3. **Compatibility Check**
   - Note any Firefox-specific issues
   - Verify behavior matches Chrome version

## Test Scenarios for SoundCloud Extension

### Basic Functionality
- [ ] Extension loads without errors
- [ ] Console logs appear on SoundCloud homepage
- [ ] Logs show correct URL
- [ ] Timestamp is displayed
- [ ] Works on soundcloud.com/discover
- [ ] Works on individual track pages
- [ ] Works on user profile pages

### Edge Cases
- [ ] Test on soundcloud.com subdomain pages
- [ ] Verify no errors on non-SoundCloud sites
- [ ] Check behavior after browser restart
- [ ] Test with browser console closed
- [ ] Test with multiple tabs open

### Performance
- [ ] Page load time not significantly affected
- [ ] No memory leaks over time
- [ ] CPU usage remains normal

## Common Issues and Solutions

### Extension doesn't load
- Check manifest.json syntax
- Verify all file paths are correct
- Check browser console for specific errors

### Console logs don't appear
- Verify content script matches pattern is correct
- Check `run_at` timing in manifest
- Ensure browser console is showing all log levels
- Look for JavaScript errors preventing execution

### Works in Chrome but not Firefox
- Check for Chrome-specific APIs
- Verify manifest v3 compatibility
- Look at Firefox browser console for specific errors

## Debugging Commands

```bash
# Validate manifest.json syntax
cat manifest.json | python -m json.tool

# Check for syntax errors in JavaScript
node -c content.js

# Search for browser-specific APIs
grep -r "chrome\." .
```

## Reporting Issues
When issues are found:
1. Note which browser(s) affected
2. Describe expected vs actual behavior
3. Include console error messages
4. Note specific URL where issue occurs
5. Document steps to reproduce
