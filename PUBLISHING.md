# Publishing Your SoundCloud Extension

This guide will walk you through publishing your extension to both Chrome Web Store and Firefox Add-ons (AMO).

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] Extension works correctly on both Chrome and Firefox
- [ ] All features have been tested thoroughly
- [ ] No console errors on target websites
- [ ] **Validation passed**: Run `npm run lint` with 0 errors
- [ ] README.md is complete and accurate
- [ ] Icon files are present and properly referenced
- [ ] Version number is set in `manifest.json`
- [ ] Privacy policy prepared (if collecting any data)
- [ ] Screenshots prepared (1280x800 or 640x400 recommended)

## Chrome Web Store

### Step 1: Create Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Pay the **one-time $5 developer registration fee**
4. Accept the developer agreement

### Step 2: Prepare Your Package

1. **Validate the extension:**
   ```bash
   npm run lint
   ```
   This runs Mozilla's addons-linter to catch errors before submission. You should see:
   ```
   Validation Summary:
   errors          0
   notices         0
   warnings        0
   ```

2. **Create a ZIP file:**
   ```bash
   npm run package
   ```
   This automatically builds TypeScript and creates `soundcloud-ext-v1.1.0.zip` containing:
   ```
   soundcloud-ext-v1.1.0.zip
   ├── manifest.json
   ├── icon-48.png
   ├── icon.png
   ├── icon.svg
   └── dist/
       └── content.js
   ```

3. **Important - Excluded from ZIP:**
   - `node_modules/`
   - `src/` (TypeScript source)
   - `.git/`
   - `.claude/`
   - Development files

### Step 3: Upload to Chrome Web Store

1. Go to [Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Click **"New Item"**
3. Upload your `soundcloud-ext.zip` file
4. Fill in the required information:

   **Store Listing:**
   - **Name:** SoundCloud Playlist Exporter (or similar)
   - **Summary:** Extract and export track information from SoundCloud playlists
   - **Description:**
     ```
     Extract track data from SoundCloud playlists with a single click!

     Features:
     • Automatically detects SoundCloud playlist pages
     • Exports all track information (title, artist, URL)
     • Smart loading detection warns if not all tracks are loaded
     • Copies data to clipboard as JSON
     • Clean, non-intrusive button integrated into SoundCloud's UI

     How to use:
     1. Navigate to any SoundCloud playlist
     2. Scroll down to load all tracks
     3. Click the "Sets info" button
     4. Track data is automatically copied to your clipboard

     Perfect for DJs, music curators, and playlist managers who want to:
     • Backup playlist information
     • Analyze track collections
     • Export data for other tools
     • Archive favorite playlists
     ```

   **Category:** Productivity or Fun

   **Language:** English (or your preferred language)

5. **Upload Screenshots** (required):
   - Take screenshots showing the extension in action
   - Recommended size: 1280x800 or 640x400
   - Show the button on a SoundCloud playlist page
   - Show the exported data (console or clipboard)

6. **Upload Icon:**
   - You'll need PNG versions
   - Required: 128x128 pixels
   - Convert your SVG: Use online tool or ImageMagick
   ```bash
   # If you have ImageMagick:
   convert icon.svg -resize 128x128 icon-128.png
   ```

7. **Privacy:**
   - **Permissions justification:** Explain that the extension only runs on SoundCloud and doesn't collect data
   - **Privacy Policy:** If you don't collect data, you can use a simple statement:
     ```
     This extension does not collect, store, or transmit any user data.
     All processing happens locally in your browser.
     ```

8. **Pricing:** Free

9. **Distribution:** Public or Unlisted (your choice)

### Step 4: Submit for Review

1. Click **"Submit for Review"**
2. Review typically takes **1-3 business days**
3. You'll receive an email when approved or if changes are needed

### Step 5: After Approval

- Your extension will be live on Chrome Web Store
- Users can install it directly from the store
- You can update it by uploading new versions

---

## Firefox Add-ons (AMO)

### Step 1: Create Developer Account

1. Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
2. Sign in or create a Firefox Account
3. **No registration fee required** (free!)

### Step 2: Prepare Your Package

Same as Chrome - create a ZIP file:

```bash
npm run build
zip -r soundcloud-ext.zip manifest.json icon.svg dist/ -x "*.DS_Store"
```

### Step 3: Submit to AMO

1. Go to [Submit a New Add-on](https://addons.mozilla.org/developers/addon/submit/)
2. Click **"Submit a New Add-on"**
3. Choose distribution:
   - **"On this site"** - Listed on AMO (recommended)
   - **"On your own"** - Self-distributed

4. Upload `soundcloud-ext.zip`

5. **Automatic Validation:**
   - Firefox will automatically validate your code
   - Fix any errors or warnings shown

6. Fill in details:

   **Basic Information:**
   - **Name:** SoundCloud Playlist Exporter
   - **Add-on URL:** Choose a unique slug
   - **Summary:** Extract and export track information from SoundCloud playlists
   - **Description:** (Same as Chrome)

   **Categories:**
   - Other (or most appropriate)

   **Tags:**
   - soundcloud
   - playlist
   - export
   - music
   - productivity

7. **Support Information:**
   - Support email (your email)
   - Support website (optional - could be GitHub repo)

8. **Version Notes:**
   ```
   Initial release - Extract track information from SoundCloud playlists
   ```

9. **License:** MIT or your preferred open-source license

10. **Screenshots:**
    - Upload screenshots showing functionality
    - Similar to Chrome Web Store

### Step 4: Submit for Review

1. Click **"Submit Version"**
2. **Review Process:**
   - Automated review: Minutes to hours
   - Manual review (if needed): 1-2 weeks
3. You'll receive email notifications

### Step 5: After Approval

- Your extension will be live on Firefox Add-ons
- Users can install directly from AMO
- Auto-updates will work for users

---

## Version Updates

### Updating Your Extension

When you make changes:

1. **Update version in `manifest.json`:**
   ```json
   {
     "version": "1.2.0"  // Follow semantic versioning
   }
   ```

2. **Build and package:**
   ```bash
   npm run build
   zip -r soundcloud-ext-v1.2.0.zip manifest.json icon.svg dist/
   ```

3. **Upload new version:**
   - Chrome: Dashboard → Select your extension → "Upload Updated Package"
   - Firefox: Dashboard → Your add-on → "Upload New Version"

4. **Add version notes** explaining what changed

### Semantic Versioning

Follow this pattern: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

---

## Tips for Approval

### Chrome Web Store

✅ **Do:**
- Use clear, descriptive screenshots
- Provide detailed description
- Explain all permissions used
- Test thoroughly before submitting
- Follow [Chrome Web Store policies](https://developer.chrome.com/docs/webstore/program-policies/)

❌ **Don't:**
- Use misleading screenshots
- Include minified/obfuscated code without justification
- Request unnecessary permissions
- Use trademarked names without permission

### Firefox Add-ons

✅ **Do:**
- Keep code readable
- Document any external libraries
- Test on latest Firefox version
- Follow [AMO policies](https://extensionworkshop.com/documentation/publish/add-on-policies/)

❌ **Don't:**
- Include minified code (unless you provide source)
- Use remote code execution
- Violate user privacy

---

## Monitoring Your Extension

### After Publishing

1. **Monitor Reviews:**
   - Respond to user feedback
   - Fix reported bugs quickly

2. **Track Usage:**
   - Chrome: Developer Dashboard shows install stats
   - Firefox: AMO dashboard shows statistics

3. **Keep Updated:**
   - Update for SoundCloud UI changes
   - Fix compatibility issues
   - Add features based on user requests

---

## Troubleshooting

### Common Rejection Reasons

**Chrome:**
- Unclear permission justifications
- Missing privacy policy
- Trademark issues
- Code quality issues

**Firefox:**
- Minified code without source maps
- External code loading
- Privacy violations
- Permissions not justified

### Getting Help

- **Chrome:** [Chrome Web Store Support](https://support.google.com/chrome_webstore/)
- **Firefox:** [Extension Workshop](https://extensionworkshop.com/)

---

## Alternative: Self-Hosting

If you don't want to publish to stores:

### Chrome (Developer Mode)

Users can install manually:
1. Download ZIP
2. Extract files
3. Go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select extension folder

**Limitation:** No auto-updates, users see warning

### Firefox (Temporary)

Users can install temporarily:
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`

**Limitation:** Removed on browser restart

---

## Cost Summary

| Platform | Registration Fee | Annual Fee | Review Time |
|----------|-----------------|------------|-------------|
| Chrome Web Store | $5 (one-time) | $0 | 1-3 days |
| Firefox Add-ons | $0 | $0 | Minutes to 2 weeks |

---

## Next Steps

1. Test your extension thoroughly
2. Create screenshots and promotional materials
3. Choose your target platform(s)
4. Register developer accounts
5. Package your extension
6. Submit for review
7. Monitor and maintain

Good luck with your extension! 🚀
