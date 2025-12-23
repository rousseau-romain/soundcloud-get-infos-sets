/**
 * Settings management module
 */

import { ExtensionSettings } from './types';
import { SETTINGS_KEY, DEFAULT_SETTINGS } from './constants';

/**
 * Load settings from localStorage
 */
export function loadSettings(): ExtensionSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('[SoundCloud Extension] Failed to load settings:', err);
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: ExtensionSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('[SoundCloud Extension] Failed to save settings:', err);
    throw err;
  }
}

/**
 * Open the extension options page
 */
export function openOptionsPage(): void {
  // Check if running in Chrome or Firefox
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    // Fallback: notify user to open settings manually
    alert(
      '⚙️ To configure settings:\n\n' +
      '1. Right-click the extension icon\n' +
      '2. Select "Options" or "Preferences"\n\n' +
      'Or go to your browser\'s extensions page and click the settings icon for this extension.'
    );
  }
}
