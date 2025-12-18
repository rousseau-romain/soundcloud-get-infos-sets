# SoundCloud Playlist Button

A browser extension that adds a custom action button to SoundCloud playlist pages. Built with TypeScript for type safety and modern development practices.

## Features

- **Playlist Detection**: Automatically detects SoundCloud playlist/set pages (URLs matching `/sets/`)
- **Track Extraction**: Extracts all tracks from the playlist including:
  - Track title
  - Artist/Username
  - Track URL (cleaned, without query parameters)
- **Smart Loading Detection**: Warns users when track count is a multiple of 30 (SoundCloud's lazy-load batch size)
- **Clipboard Export**: Copies track data to clipboard as formatted JSON
- **Console Table Display**: Shows extracted tracks in a formatted table for easy review
- **Seamless Integration**: Button matches SoundCloud's native design system
- **SPA Support**: Handles Single Page Application navigation automatically
- **TypeScript**: Full type safety and modern development practices

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. For development with auto-rebuild on changes:
```bash
npm run watch
```

4. Validate your extension (recommended before publishing):
```bash
npm run lint        # Packages and runs Mozilla's addons-linter
npm run validate    # Builds and lints in one command
```

## Installation

### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `soundcloud-ext` folder
5. The extension is now installed

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the `soundcloud-ext` folder and select `manifest.json`
4. The extension is now installed (temporary until Firefox restart)

For permanent installation in Firefox, you need to sign the extension through Mozilla's AMO.

## Usage

1. Navigate to a SoundCloud playlist page (e.g., `https://soundcloud.com/rowm1/sets/playlist-name`)
2. **Important**: Scroll down to load all tracks! SoundCloud loads tracks in batches of 30
3. Look for the **"Sets info"** button with the playlist icon 🎵 in the playlist header action bar (next to Share, Copy Link, etc.)
4. Click the button to extract all tracks from the playlist
5. If you have exactly 30, 60, 90, etc. tracks, you'll get a warning to scroll and load more
6. Track data is automatically copied to your clipboard as JSON
7. Open browser console (F12) to see detailed track information displayed in a table format

### ⚠️ Important Note

SoundCloud loads tracks lazily (30 at a time). **Before clicking the button**:
- Scroll to the bottom of the playlist
- Wait for all tracks to load
- The extension will warn you if it detects you might have incomplete data

### Example Output

The button extracts data in this format:

```json
[
  {
    "username": "Blossom, D38",
    "trackTitle": "Blossom & D38 - Moshpit",
    "url": "https://soundcloud.com/artist/track"
  },
  {
    "username": "Hadex, Arrdee, Digital Farm Animals",
    "trackTitle": "Same Cycle",
    "url": "https://soundcloud.com/artist/track-2"
  }
]
```

### Customizing the Button

The `getTracks()` function extracts track data using these CSS selectors:
- `li.trackList__item` - Individual track items
- `.trackItem__username` - Artist/username
- `.trackItem__trackTitle` - Track title and URL

To customize the behavior, edit `src/content.ts` and modify the `handleButtonClick` or `getTracks` functions, then rebuild with `npm run build`.

## Project Structure

```
soundcloud-ext/
├── src/
│   └── content.ts        # TypeScript source code
├── dist/
│   └── content.js        # Compiled JavaScript (generated)
├── screenshots/          # Store listing screenshots
│   ├── image-store.png   # Main screenshot
│   └── README.md         # Screenshot guidelines
├── manifest.json         # Extension configuration
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
├── icon.svg              # Extension icon (SVG)
├── icon.png              # Extension icon (PNG for Chrome)
├── PUBLISHING.md         # Publishing guide
└── README.md             # This file
```

### Key Files

- `src/content.ts` - TypeScript source for content script
- `dist/content.js` - Compiled JavaScript (auto-generated, do not edit)
- `manifest.json` - Extension configuration and permissions
- `tsconfig.json` - TypeScript compiler settings
- `package.json` - Project dependencies and build scripts
- `icon.svg` / `icon.png` - Extension icons
- `icon-preview.html` - Interactive icon preview and customization guide
- `screenshots/` - Screenshots for store listings (NOT included in ZIP package)
- `PUBLISHING.md` - Complete guide for publishing to Chrome/Firefox stores

## Publishing

To package the extension for publishing:

```bash
npm run package  # Creates soundcloud-ext-v1.1.0.zip
```

The ZIP contains only runtime files (manifest, icon, dist/). Screenshots are uploaded separately through the store web interface.

See **[PUBLISHING.md](PUBLISHING.md)** for the complete step-by-step guide.
