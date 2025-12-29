/**
 * Playlist utility functions
 */

import { Track } from '../shared/types';
import { TRACK_SELECTORS, BATCH_SIZES } from '../shared/constants';

/**
 * Check if the current page is a SoundCloud playlist/set page
 * Includes both user playlists (/sets/) and discover sets (/discover/sets/)
 */
export function isPlaylistPage(): boolean {
  return window.location.pathname.includes('/sets/');
}

/**
 * Extract playlist name from current URL
 */
export function getPlaylistName(): string {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

/**
 * Extract all tracks from the current playlist page
 * Tries multiple selectors to support different playlist layouts
 */
export function getTracks(): Track[] {
  // Try multiple selectors for track items
  const selectors = [
    TRACK_SELECTORS.itemPlaylist,  // Playlist track lists
    TRACK_SELECTORS.item,          // Track lists      
    TRACK_SELECTORS.itemDiscover   // Discover sets item 
  ];

  let trackElements: Element[] = [];

  for (const selector of selectors) {
    trackElements = Array.from(document.querySelectorAll(selector));
    if (trackElements.length > 0) {
      console.log(`[SoundCloud Extension] Found ${trackElements.length} tracks using selector: ${selector}`);
      break;
    }
  }

  return trackElements.map((item) => {
    const usernameElement = item.querySelector(TRACK_SELECTORS.username) as HTMLElement;
    const trackTitleElement = item.querySelector(TRACK_SELECTORS.title) as HTMLAnchorElement;

    const username = usernameElement?.innerText.trim() || '';
    const trackTitle = trackTitleElement?.innerText.trim() || '';
    const url = trackTitleElement?.href.replace(/\?.*$/, '') || '';

    return { username, trackTitle, url };
  });
}

/**
 * Check if user should be warned about potentially incomplete track loading
 * Returns true if user wants to continue, false if they want to cancel
 */
export function checkBatchLoadingWarning(trackCount: number, actionName: string = 'export'): boolean {
  // Check if track count is a multiple of any known batch size
  const matchingBatchSize = BATCH_SIZES.find(size => trackCount > 0 && trackCount % size === 0);

  if (matchingBatchSize) {
    return confirm(
      `⚠️ Warning: Found exactly ${trackCount} tracks.\n\n` +
      `SoundCloud loads tracks in batches (typically ${BATCH_SIZES.join(' or ')} at a time). ` +
      `You might not have loaded all tracks yet!\n\n` +
      `To load more:\n` +
      `1. Scroll down to the bottom of the playlist\n` +
      `2. Wait for more tracks to load\n` +
      `3. ${actionName === 'export' ? 'Click' : 'Long-press'} this button again\n\n` +
      `Do you want to ${actionName} the current ${trackCount} tracks anyway?`
    );
  }
  return true; // No warning needed
}
