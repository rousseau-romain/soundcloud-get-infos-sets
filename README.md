# SoundCloud Console Logger

A simple browser extension that adds console logs to the SoundCloud website.

## Features

- Logs a message when the extension loads on SoundCloud
- Displays the current URL
- Shows a timestamp

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

1. Navigate to https://soundcloud.com
2. Open the browser console (F12 or Right-click > Inspect > Console)
3. You should see the console logs from the extension

## Files

- `manifest.json` - Extension configuration
- `content.js` - Content script that runs on SoundCloud
- `README.md` - This file

## Note

The extension currently uses a placeholder icon. To add a custom icon, replace `icon.png` with your own 96x96 PNG image.
