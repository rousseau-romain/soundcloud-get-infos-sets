/**
 * SoundCloud Extension - Main Content Script
 *
 * This script injects a custom button into SoundCloud pages that allows:
 * - Playlist pages: Export all tracks
 * - Song pages: Export single track
 * - Click: Export track data as JSON
 * - Long-press: Export as batch download script (configurable)
 * - Shift+Click: Open settings page
 */

import {
  BUTTON_ID,
  BUTTON_LABEL,
  BUTTON_CONTAINER_SELECTORS,
  SONG_BUTTON_ID,
  SONG_BUTTON_LABEL,
  SONG_BUTTON_CONTAINER_SELECTORS,
  ARTIST_BUTTON_ID_PREFIX,
  ARTIST_BUTTON_CONTAINER_SELECTORS
} from './shared/constants';
import { isPlaylistPage } from './utils/playlist';
import { isSongPage, getSongTrack, getSongName } from './utils/song';
import { isArtistPage, getTrackItems, extractTrackFromElement } from './utils/artist';
import { createCustomButton, createPlaylistButtonHandlers, createSongButtonHandlers } from './ui/button';

/**
 * Page type enum
 */
enum PageType {
  PLAYLIST = 'playlist',
  SONG = 'song',
  ARTIST = 'artist',
  OTHER = 'other'
}

/**
 * Detect the current page type based on URL
 */
function detectPageType(): PageType {
  if (isPlaylistPage()) return PageType.PLAYLIST;
  if (isSongPage()) return PageType.SONG;
  if (isArtistPage()) return PageType.ARTIST;
  return PageType.OTHER;
}

/**
 * Inject button for playlist pages
 */
function injectPlaylistButton(): void {
  // Check if button already exists
  if (document.getElementById(BUTTON_ID)) {
    return;
  }

  // Find the button container in the playlist header
  let container: HTMLElement | null = null;
  let matchedSelector: string | null = null;

  for (const selector of BUTTON_CONTAINER_SELECTORS) {
    container = document.querySelector<HTMLElement>(selector);
    if (container) {
      matchedSelector = selector;
      break;
    }
  }

  if (!container) {
    console.log('[SoundCloud Extension] Playlist button container not found, retrying...');
    return;
  }

  // Create and inject the button with playlist handlers
  const handlers = createPlaylistButtonHandlers();
  const button = createCustomButton(BUTTON_ID, BUTTON_LABEL, handlers);

  // For discover sets, wrap button in systemPlaylistDetails__button div
  if (matchedSelector === '.systemPlaylistDetails__controls') {
    const wrapper = document.createElement('div');
    wrapper.className = 'systemPlaylistDetails__button';
    wrapper.appendChild(button);
    container.insertBefore(wrapper, container.firstChild);
    console.log('[SoundCloud Extension] Playlist button injected (wrapped for discover sets)');
  } else {
    container.insertBefore(button, container.firstChild);
    console.log('[SoundCloud Extension] Playlist button injected');
  }
}

/**
 * Inject button for song pages
 */
function injectSongButton(): void {
  // Check if button already exists
  if (document.getElementById(SONG_BUTTON_ID)) {
    console.log('[SoundCloud Extension] Song button already exists');
    return;
  }

  // Find the button container on the song page
  let container: HTMLElement | null = null;
  let matchedSelector: string | null = null;

  console.log('[SoundCloud Extension] Trying to find button container with selectors:', SONG_BUTTON_CONTAINER_SELECTORS);

  for (const selector of SONG_BUTTON_CONTAINER_SELECTORS) {
    container = document.querySelector<HTMLElement>(selector);
    if (container) {
      matchedSelector = selector;
      console.log('[SoundCloud Extension] Found container with selector:', selector);
      break;
    }
  }

  if (!container) {
    console.log('[SoundCloud Extension] Song button container not found');
    console.log('[SoundCloud Extension] Available elements on page:');
    console.log('  - .soundActions elements:', document.querySelectorAll('.soundActions').length);
    console.log('  - .sc-button-toolbar elements:', document.querySelectorAll('.sc-button-toolbar').length);
    console.log('  - [class*="soundActions"] elements:', document.querySelectorAll('[class*="soundActions"]').length);
    console.log('  - .soundActions__group elements:', document.querySelectorAll('.soundActions__group').length);
    return;
  }

  // Create and inject the button with song handlers
  const handlers = createSongButtonHandlers(() => ({
    track: getSongTrack(),
    name: getSongName()
  }));
  const button = createCustomButton(SONG_BUTTON_ID, SONG_BUTTON_LABEL, handlers);
  container.appendChild(button);
  console.log('[SoundCloud Extension] Song button injected successfully using selector:', matchedSelector);
}

/**
 * Inject buttons for artist page tracks
 */
function injectArtistButtons(): void {
  console.log('[SoundCloud Extension] Attempting to inject artist page buttons...');

  const trackItems = getTrackItems();

  if (trackItems.length === 0) {
    console.log('[SoundCloud Extension] No track items found on artist page');
    return;
  }

  console.log(`[SoundCloud Extension] Found ${trackItems.length} track items on artist page`);

  let injectedCount = 0;

  trackItems.forEach((trackItem, index) => {
    const buttonId = `${ARTIST_BUTTON_ID_PREFIX}-${index}`;

    // Check if button already exists for this track
    if (trackItem.querySelector(`#${buttonId}`)) {
      return;
    }

    // Find the action buttons container within this track item
    let container: HTMLElement | null = null;

    for (const selector of ARTIST_BUTTON_CONTAINER_SELECTORS) {
      container = trackItem.querySelector<HTMLElement>(selector);
      if (container) {
        break;
      }
    }

    if (!container) {
      console.log(`[SoundCloud Extension] No container found for track ${index}`);
      return;
    }

    // Extract track data from this specific element
    const trackData = extractTrackFromElement(trackItem);

    if (!trackData) {
      console.log(`[SoundCloud Extension] Could not extract data for track ${index}`);
      return;
    }

    // Create button handlers with the extracted track data
    const handlers = createSongButtonHandlers(() => ({
      track: trackData,
      name: trackData.trackTitle
    }));

    const button = createCustomButton(buttonId, undefined, handlers);
    container.appendChild(button);
    injectedCount++;
  });

  console.log(`[SoundCloud Extension] Injected ${injectedCount} buttons on artist page`);
}

/**
 * Initialize the extension based on page type
 */
function initializeExtension(): void {
  const pageType = detectPageType();
  console.log('[SoundCloud Extension] Page type detected:', pageType, 'URL:', window.location.pathname);

  if (pageType === PageType.PLAYLIST) {
    // Try to inject playlist button immediately and with retries
    injectPlaylistButton();
    setTimeout(injectPlaylistButton, 1000);
    setTimeout(injectPlaylistButton, 2000);

    // Also inject individual track buttons within the playlist
    injectArtistButtons();
    setTimeout(injectArtistButtons, 1000);
    setTimeout(injectArtistButtons, 2000);
    setTimeout(injectArtistButtons, 3000);
    setTimeout(injectArtistButtons, 5000);
  } else if (pageType === PageType.SONG) {
    console.log('[SoundCloud Extension] Detected song page, attempting to inject button...');
    // Try to inject song button immediately and with retries
    injectSongButton();
    setTimeout(injectSongButton, 1000);
    setTimeout(injectSongButton, 2000);
    setTimeout(injectSongButton, 3000);
  } else if (pageType === PageType.ARTIST) {
    console.log('[SoundCloud Extension] Detected artist page, attempting to inject buttons...');
    // Try to inject artist buttons immediately and with retries
    injectArtistButtons();
    setTimeout(injectArtistButtons, 1000);
    setTimeout(injectArtistButtons, 2000);
    setTimeout(injectArtistButtons, 3000);
    setTimeout(injectArtistButtons, 5000);
  }
  // For OTHER page types, do nothing
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
