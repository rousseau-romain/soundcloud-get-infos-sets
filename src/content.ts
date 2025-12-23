/**
 * SoundCloud Playlist Button Extension - Main Content Script
 *
 * This script injects a custom button into SoundCloud playlist pages that allows:
 * - Click: Export track data as JSON
 * - Long-press: Export as batch download script (configurable)
 * - Shift+Click: Open settings page
 */

import { BUTTON_ID, BUTTON_LABEL, BUTTON_CONTAINER_SELECTORS } from './shared/constants';
import { isPlaylistPage } from './utils/playlist';
import { createCustomButton } from './ui/button';

/**
 * Inject the custom button into the playlist header
 */
function injectButton(): void {
  // Check if button already exists
  if (document.getElementById(BUTTON_ID)) {
    return;
  }

  // Find the button container in the playlist header
  let container: HTMLElement | null = null;

  for (const selector of BUTTON_CONTAINER_SELECTORS) {
    container = document.querySelector<HTMLElement>(selector);
    if (container) {
      break;
    }
  }

  if (!container) {
    console.log('[SoundCloud Extension] Button container not found, retrying...');
    return;
  }

  // Create and inject the button
  const button = createCustomButton(BUTTON_ID, BUTTON_LABEL);
  container.appendChild(button);
}

/**
 * Initialize the extension on playlist pages
 */
function initializeExtension(): void {
  if (!isPlaylistPage()) {
    return;
  }

  // Try to inject button immediately
  injectButton();

  // Also try after short delays (for dynamic content)
  setTimeout(injectButton, 1000);
  setTimeout(injectButton, 2000);
}

/**
 * Monitor URL changes for SPA navigation
 */
function watchForNavigation(): void {
  let lastUrl = window.location.href;

  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      initializeExtension();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize extension
initializeExtension();

// Watch for navigation changes (SoundCloud is a SPA)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    watchForNavigation();
  });
} else {
  watchForNavigation();
}
