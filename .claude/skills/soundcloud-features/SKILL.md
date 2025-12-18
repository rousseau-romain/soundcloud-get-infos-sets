---
name: soundcloud-features
description: Add features and enhancements to the SoundCloud browser extension. Use when implementing new SoundCloud-specific functionality, UI modifications, or custom features.
---

# SoundCloud Extension Feature Development

## Overview
This skill helps add new features to the SoundCloud browser extension while maintaining quality and compatibility.

## Feature Development Process

### 1. Planning
- Define the feature clearly
- Identify which SoundCloud pages it affects
- Determine required permissions
- Consider performance impact
- Check if it requires background scripts

### 2. Implementation
- Update content.js or create new scripts
- Add necessary permissions to manifest.json
- Follow the extension-dev skill guidelines
- Keep code modular and maintainable

### 3. Testing
- Test on multiple SoundCloud pages (home, tracks, playlists, profiles)
- Verify no conflicts with SoundCloud's existing functionality
- Check both Chrome and Firefox
- Follow extension-test skill procedures

### 4. Documentation
- Update README.md with new feature
- Add code comments for complex logic
- Document any new permissions needed

## SoundCloud DOM Structure Tips

### Common SoundCloud Elements
```javascript
// Wait for SoundCloud to load
window.addEventListener('load', () => {
  // Play button
  const playButton = document.querySelector('.playControl');

  // Track title
  const trackTitle = document.querySelector('.soundTitle__title');

  // User profile
  const userProfile = document.querySelector('.userInfo');
});
```

### Observing Dynamic Content
SoundCloud is a Single Page Application (SPA), so use MutationObserver:

```javascript
const observer = new MutationObserver((mutations) => {
  // Handle dynamic changes
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

## Feature Ideas

### Basic Enhancements
- Download button for tracks
- Enhanced keyboard shortcuts
- Dark mode toggle
- Custom player controls
- Track analytics display

### Advanced Features
- Playlist manager
- Track categorization
- Auto-skip tracks
- Volume normalization
- Lyrics display
- Waveform analyzer

## Best Practices

### DOM Manipulation
- Always check if elements exist before accessing
- Use `querySelector` for single elements
- Use `querySelectorAll` for multiple elements
- Clean up event listeners on navigation

### Performance
- Debounce frequent operations
- Use event delegation for dynamic content
- Cache DOM queries when possible
- Avoid blocking the main thread

### User Experience
- Provide visual feedback for actions
- Handle errors gracefully
- Don't interfere with SoundCloud's core functionality
- Make features optional/configurable when possible

## Common Patterns

### Adding UI Elements
```javascript
// Create button
const button = document.createElement('button');
button.textContent = 'My Feature';
button.className = 'my-extension-button';
button.addEventListener('click', () => {
  // Handle click
});

// Find insertion point
const targetElement = document.querySelector('.soundHeader');
if (targetElement) {
  targetElement.appendChild(button);
}
```

### Listening to Track Changes
```javascript
let currentUrl = window.location.href;

setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    console.log('Track changed:', currentUrl);
    // Re-initialize features
  }
}, 1000);
```

### Storage for Preferences
```javascript
// Save preference
chrome.storage.sync.set({ 'darkMode': true });

// Load preference
chrome.storage.sync.get(['darkMode'], (result) => {
  console.log('Dark mode is:', result.darkMode);
});
```

Note: Requires `"storage"` permission in manifest.json

## Security Considerations

- Sanitize any user input before inserting into DOM
- Don't expose sensitive data in console logs
- Validate data from SoundCloud's page before using
- Use CSP (Content Security Policy) headers

## Updating Manifest for New Features

### Adding Storage Permission
```json
"permissions": ["storage"]
```

### Adding Background Script
```json
"background": {
  "service_worker": "background.js"
}
```

### Adding Popup UI
```json
"action": {
  "default_popup": "popup.html",
  "default_icon": "icon.png"
}
```

## Testing New Features

1. Test on different SoundCloud pages:
   - Homepage: https://soundcloud.com
   - Discover: https://soundcloud.com/discover
   - Track page: https://soundcloud.com/artist/track
   - Playlist: https://soundcloud.com/user/sets/playlist
   - User profile: https://soundcloud.com/username

2. Test edge cases:
   - Fast navigation between tracks
   - Multiple tabs open
   - Extension reload while on SoundCloud
   - Page refresh

3. Verify no console errors

4. Check performance (no lag or slowdown)
