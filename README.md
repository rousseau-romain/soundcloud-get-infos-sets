# SoundCloud Playlist Button

A browser extension that adds a custom action button to SoundCloud playlist pages. Extract track information as JSON or generate batch download scripts with customizable settings.

## Features

### 🎯 Core Functionality
- **Three Interaction Modes**:
  - **Click**: Export full track data as JSON
  - **Long-press** (600ms): Generate batch download script
  - **Shift+Click**: Open settings page

### ⚙️ Configurable Settings
- **Custom command**: Choose your download tool (`dl-soundcloud`, `yt-dlp`, `wget`, etc.)
- **Commands per line**: Group 1-100 commands per line
- **Separator**: Use `&&` (stop on error), `;` (continue), `||` (on failure), or `&` (parallel)
- **Settings UI**: Beautiful options page integrated with browser

### 🛡️ Smart Features
- **Batch loading detection**: Warns when tracks might not be fully loaded (15 or 30 track increments)
- **Track extraction**: Captures username, track title, and clean URLs
- **SPA navigation**: Works with SoundCloud's single-page app
- **Visual feedback**: Button pulse on long-press
- **Seamless integration**: Matches SoundCloud's native design

### 🏗️ Developer Features
- **TypeScript**: Full type safety with modular architecture
- **Modular codebase**: Organized into shared, utils, and UI modules
- **Fast builds**: esbuild bundler (~4ms builds)
- **Watch mode**: Auto-rebuild on file changes
- **Automated versioning**: One-command version bumps with git tags

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

### First Time Setup

1. **Configure Settings** (optional):
   - Click the extension icon → **"Options"** or **"Preferences"**
   - Or on any playlist page: **Shift+Click** the "Sets info" button
   - Set your preferred:
     - Command name (e.g., `dl-soundcloud`, `yt-dlp`)
     - Commands per line (default: 5)
     - Separator (default: `&&`)

### Using the Extension

1. Navigate to a SoundCloud playlist page (e.g., `https://soundcloud.com/username/sets/playlist-name`)
2. **Important**: Scroll down to load all tracks! SoundCloud loads tracks in batches of 15-30
3. Look for the **"Sets info"** button 🎵 in the playlist header (next to Share, Copy Link, etc.)

### Three Interaction Modes

#### 1️⃣ **Click** - Export as JSON
Quick click copies full track data to clipboard:

```json
[
  {
    "username": "Artist Name",
    "trackTitle": "Track Title",
    "url": "https://soundcloud.com/artist/track"
  }
]
```

**Use for:** Data analysis, importing to spreadsheets, custom scripts

#### 2️⃣ **Long-press** (600ms) - Generate Download Script
Hold the button for ~1 second to copy a ready-to-run batch script:

```bash
dl-soundcloud https://soundcloud.com/track1 && dl-soundcloud https://soundcloud.com/track2 && dl-soundcloud https://soundcloud.com/track3 && dl-soundcloud https://soundcloud.com/track4 && dl-soundcloud https://soundcloud.com/track5 &&
dl-soundcloud https://soundcloud.com/track6 && ...
```

**Use for:** Bulk downloading tracks with command-line tools

#### 3️⃣ **Shift+Click** - Open Settings
Hold Shift and click to configure the extension.

### ⚠️ Important: Loading All Tracks

SoundCloud loads tracks lazily (15 or 30 at a time). **Before using the button**:
- Scroll to the bottom of the playlist
- Wait for all tracks to load
- The extension warns you if track count is exactly 15, 30, 45, 60, etc.

## Project Structure

```
soundcloud-ext/
├── src/                      # TypeScript source files
│   ├── content.ts           # Main content script
│   ├── options.ts           # Options page script
│   ├── shared/              # Shared modules
│   │   ├── types.ts         # Type definitions
│   │   ├── constants.ts     # Configuration constants
│   │   └── settings.ts      # Settings management
│   ├── utils/               # Utility functions
│   │   ├── playlist.ts      # Track extraction
│   │   └── clipboard.ts     # Copy operations
│   └── ui/                  # UI components
│       ├── button.ts        # Button creation
│       └── icon.ts          # SVG icon generation
├── dist/                    # Compiled output (generated)
│   ├── content.js           # Bundled content script
│   └── options.js           # Bundled options script
├── build.js                 # esbuild bundler configuration
├── update-version.js        # Version management script
├── options.html             # Settings page UI
├── manifest.json            # Extension configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── icon.svg / icon.png      # Extension icons
├── README.md                # This file
├── VERSIONING.md            # Version management guide
└── PUBLISHING.md            # Store publishing guide
```

### Key Files

| File | Purpose |
|------|---------|
| `src/content.ts` | Main content script (button injection, navigation) |
| `src/options.ts` | Settings page logic |
| `src/shared/` | Shared code used by multiple modules |
| `src/utils/` | Utility functions (playlist, clipboard) |
| `src/ui/` | UI components (button, icon) |
| `dist/` | Compiled output (auto-generated by esbuild) |
| `build.js` | Build system (bundles modules into single files) |
| `update-version.js` | Automated version management with git tags |
| `options.html` | Settings page UI |
| `manifest.json` | Extension configuration for browsers |
| `VERSIONING.md` | **Complete guide for version management** |
| `PUBLISHING.md` | Guide for publishing to stores |

## Version Management

This project uses automated version management with git integration.

### Quick Version Commands

```bash
# Patch release (bug fixes) - 1.2.1 → 1.2.2
npm run version:patch

# Minor release (new features) - 1.2.1 → 1.3.0
npm run version:minor

# Major release (breaking changes) - 1.2.1 → 2.0.0
npm run version:major
```

### What Happens

Each version command automatically:
- ✅ Updates `package.json` and `manifest.json`
- ✅ Creates a git commit: `"Bump version to X.Y.Z"`
- ✅ Creates an annotated git tag: `vX.Y.Z`
- ✅ Shows next steps for pushing and publishing

### Complete Workflow

```bash
# 1. Update version
npm run version:patch

# 2. Push to remote
git push origin main --tags

# 3. Build and package
npm run package

# 4. Upload soundcloud-ext-vX.Y.Z.zip to store
```

**📖 See [VERSIONING.md](VERSIONING.md) for the complete guide**, including:
- Semantic versioning explained
- Advanced options (`--no-commit`, `--no-tag`)
- Troubleshooting
- Git tag management
- Pre-release versions

## Publishing

To package the extension for publishing:

```bash
npm run package  # Creates soundcloud-ext-vX.X.X.zip
```

The ZIP contains only runtime files (manifest, options.html, icons, dist/). Screenshots are uploaded separately through the store web interface.

**📖 See [PUBLISHING.md](PUBLISHING.md)** for the complete step-by-step guide to publishing on Chrome Web Store and Firefox Add-ons.

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build extension once (production) |
| `npm run watch` | Watch for changes and rebuild automatically |
| `npm run clean` | Remove dist/ folder |
| `npm run version:patch` | Bump patch version (1.2.1 → 1.2.2) |
| `npm run version:minor` | Bump minor version (1.2.1 → 1.3.0) |
| `npm run version:major` | Bump major version (1.2.1 → 2.0.0) |
| `npm run package` | Build and create distribution ZIP |
| `npm run validate` | Build and run linter |

## Architecture

This extension uses a **modular TypeScript architecture** with clear separation of concerns:

- **`shared/`** - Types, constants, and settings shared across all modules
- **`utils/`** - Pure utility functions (playlist extraction, clipboard operations)
- **`ui/`** - UI components (button, icon generation)
- **Main scripts** - Orchestration layers that compose the modules

Benefits:
- ✅ **No code duplication** - Shared code in one place
- ✅ **Type-safe** - TypeScript across all modules
- ✅ **Testable** - Small, focused modules
- ✅ **Maintainable** - 50-100 lines per file
- ✅ **Fast builds** - esbuild bundles in ~4ms

## Contributing

Contributions are welcome! When submitting changes:

1. Use the automated version management: `npm run version:patch`
2. Follow the existing code structure (modular architecture)
3. Test in both Chrome and Firefox
4. Update documentation if needed

## License

This project is licensed under the MIT License.
