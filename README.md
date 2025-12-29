# SoundCloud Extension

A browser extension that adds custom action buttons to **both SoundCloud playlist and song pages**. Extract track information as JSON, generate batch download scripts, or build a collection of tracks across browsing sessions.

## Features

### 🎯 Core Functionality

#### Playlist Pages

- **Three Interaction Modes**:
  - **Click**: Export all tracks as JSON array
  - **Long-press** (600ms): Generate batch download script
  - **Shift+Click**: Open settings page

#### Song Pages (New!)

- **Three Interaction Modes**:
  - **Click**: Export single track as JSON object
  - **Long-press** (600ms): Generate download command for track
  - **Shift+Click**: Add track to collection

#### Track Collection (New!)

- Build a persistent collection across multiple song pages
- View, manage, and export your collection from settings
- Export collection as JSON or batch script
- Duplicate detection (tracks identified by URL)

### ⚙️ Configurable Settings

- **Custom command**: Choose your download tool (`dl-soundcloud`, `yt-dlp`, `wget`, etc.)
- **Commands per line**: Group 1-100 commands per line
- **Separator**: Use `&&` (stop on error), `;` (continue), `||` (on failure), or `&` (parallel)
- **Settings UI**: Beautiful options page integrated with browser

### 🛡️ Smart Features

- **Page type detection**: Automatically detects playlist vs song pages
- **Batch loading detection**: Warns when tracks might not be fully loaded (15 or 30 track increments)
- **Track extraction**: Captures username, track title, and clean URLs from meta tags
- **SPA navigation**: Works with SoundCloud's single-page app
- **Visual feedback**: Button pulse on long-press, inline success/error messages
- **Seamless integration**: Matches SoundCloud's native design
- **Cross-context storage**: Uses chrome.storage.local for data persistence
- **Retry logic**: Multiple attempts to inject buttons (handles dynamic content)

### 🏗️ Developer Features

- **TypeScript**: Full type safety with modular architecture
- **Modular codebase**: Organized into shared, utils, and UI modules
- **Fast builds**: esbuild bundler (~4ms builds)
- **Watch mode**: Auto-rebuild on file changes
- **Automated versioning**: One-command version bumps with git tags

## Development Setup

### Quick Start

For detailed compilation instructions (required for store submissions), see **[BUILD.md](BUILD.md)**.

#### Automated Setup

Run the automated setup script (recommended):

```bash
chmod +x setup.sh
./setup.sh
```

This will check requirements, install dependencies, build the extension, and create the distribution package.

#### Manual Setup

1. Install Node.js (if using nvm, the project includes a `.nvmrc` file):

   ```bash
   nvm install  # Installs Node.js 23.9.0
   nvm use      # Switches to the correct version
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the TypeScript code:

   ```bash
   npm run build
   ```

4. For development with auto-rebuild on changes:

   ```bash
   npm run watch
   ```

5. Validate your extension (recommended before publishing):

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

### Using on Playlist Pages

1. Navigate to a SoundCloud playlist (e.g., `https://soundcloud.com/username/sets/playlist-name`)
2. **Important**: Scroll down to load all tracks! SoundCloud loads tracks in batches of 15-30
3. Look for the **"Sets info"** button in the playlist header (next to Share, Copy Link, etc.)

#### Playlist Button Interactions

- **Click**: Export all tracks as JSON array
- **Long-press** (600ms): Generate batch download script for all tracks
- **Shift+Click**: Open settings page

Example JSON output (playlist):

```json
[
  {
    "username": "Artist Name",
    "trackTitle": "Track Title",
    "url": "https://soundcloud.com/artist/track"
  },
  {
    "username": "Another Artist",
    "trackTitle": "Another Track",
    "url": "https://soundcloud.com/artist2/track2"
  }
]
```

### Using on Song Pages (New!)

1. Navigate to any individual track (e.g., `https://soundcloud.com/acyanmusic/saymyname`)
2. Wait ~1 second for the **"Track info"** button to appear (next to like/repost buttons)

#### Song Button Interactions

- **Click**: Export single track as JSON object (not array!)
- **Long-press** (600ms): Generate download command for this track
- **Shift+Click**: Add track to your collection

Example JSON output (song):

```json
{
  "username": "ACYAN",
  "trackTitle": "Say My Name",
  "url": "https://soundcloud.com/acyanmusic/saymyname"
}
```

### Track Collection Feature (New!)

Build a persistent collection of tracks as you browse:

1. **Add tracks**: On any song page, **Shift+Click** the "Track info" button
2. **View collection**: Open Settings → Scroll to "📚 Track Collection" section
3. **Export collection**: Click "📋 Copy JSON" or "📜 Copy Script"
4. **Remove tracks**: Click "Remove" on individual tracks or "🗑️ Clear All"

**Features**:

- Tracks persist across browser sessions
- Automatic duplicate detection (by URL)
- Inline button feedback (no scrolling)
- Export entire collection as JSON or batch script

### ⚠️ Important: Loading All Tracks (Playlists)

SoundCloud loads tracks lazily (15 or 30 at a time). **Before exporting a playlist**:

- Scroll to the bottom of the playlist
- Wait for all tracks to load
- The extension warns you if track count is exactly 15, 30, 45, 60, etc.

## Project Structure

```
soundcloud-ext/
├── src/                      # TypeScript source files
│   ├── content.ts           # Main content script (page detection & button injection)
│   ├── options.ts           # Options page script (settings + collection UI)
│   ├── shared/              # Shared modules
│   │   ├── types.ts         # Type definitions
│   │   ├── constants.ts     # Configuration constants
│   │   ├── settings.ts      # Settings management (localStorage)
│   │   └── collection.ts    # Collection management (chrome.storage)
│   ├── utils/               # Utility functions
│   │   ├── playlist.ts      # Playlist track extraction
│   │   ├── song.ts          # Song page detection & extraction
│   │   └── clipboard.ts     # Clipboard copy operations
│   └── ui/                  # UI components
│       ├── button.ts        # Button creation & interaction handlers
│       └── icon.ts          # SVG icon generation
├── dist/                    # Compiled output (generated)
│   ├── content.js           # Bundled content script (~10kb)
│   └── options.js           # Bundled options script (~7kb)
├── build.js                 # esbuild bundler configuration
├── update-version.js        # Version management script
├── options.html             # Settings page UI (includes collection section)
├── manifest.json            # Extension configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── memory.jsonl             # Project context (for AI assistants)
├── .nvmrc                   # Node.js version specification (v23.9.0)
├── icon.svg / icon.png      # Extension icons
├── README.md                # This file
├── BUILD.md                 # Complete compilation instructions for reviewers
├── setup.sh                 # Automated setup script
├── VERSIONING.md            # Version management guide
└── PUBLISHING.md            # Store publishing guide
```

### Key Files

| File | Purpose |
|------|---------|
| `src/content.ts` | Main content script (page detection, button injection, SPA navigation) |
| `src/options.ts` | Settings page logic + collection UI |
| `src/shared/collection.ts` | **Track collection management (chrome.storage)** |
| `src/shared/settings.ts` | Settings management (localStorage) |
| `src/shared/constants.ts` | Configuration constants (selectors, IDs, defaults) |
| `src/utils/playlist.ts` | Playlist page detection & track extraction |
| `src/utils/song.ts` | **Song page detection & track extraction (new)** |
| `src/utils/clipboard.ts` | Clipboard operations (JSON, script export) |
| `src/ui/button.ts` | Button creation & interaction handlers (dependency injection) |
| `src/ui/icon.ts` | SVG icon generation |
| `dist/` | Compiled output (auto-generated by esbuild) |
| `build.js` | Build system (bundles modules into single files) |
| `update-version.js` | Automated version management with git tags |
| `options.html` | Settings page UI (includes collection section) |
| `manifest.json` | Extension configuration (permissions: storage, clipboardWrite) |
| `memory.jsonl` | Project context for AI assistants |
| `.nvmrc` | Node.js version specification (23.9.0) for nvm |
| `BUILD.md` | **Complete compilation instructions for store reviewers** |
| `setup.sh` | Automated setup script for building from source |
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
