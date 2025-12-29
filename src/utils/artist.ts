/**
 * Artist page detection and track extraction utilities
 */

import { Track } from '../shared/types';

/**
 * Check if current page is an artist page
 * Artist pages have URLs like: /username (no additional path segments)
 * Excludes: /you, /discover, /search, /settings, etc.
 *
 * @returns true if current page is an artist page
 */
export function isArtistPage(): boolean {
  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s.length > 0);

  // Artist pages have exactly 1 segment (the username)
  if (segments.length !== 1) return false;

  // Exclude special SoundCloud pages
  const excludedPages = [
    'you',
    'discover',
    'search',
    'settings',
    'messages',
    'notifications',
    'upload',
    'pages',
    'imprint',
    'popular',
    'charts'
  ];

  return !excludedPages.includes(segments[0].toLowerCase());
}

/**
 * Extract track data from a track item element on an artist page
 *
 * @param trackElement - The track item DOM element
 * @returns Track object or null if extraction fails
 */
export function extractTrackFromElement(trackElement: Element): Track | null {
  try {
    // Try to find the track link
    const trackLink = trackElement.querySelector('a[href*="/"]') as HTMLAnchorElement;
    if (!trackLink || !trackLink.href) {
      console.warn('[SoundCloud Extension] No track link found in element');
      return null;
    }

    // Extract URL
    const url = trackLink.href.split('?')[0]; // Remove query parameters

    // Try to get track title from various possible locations
    let trackTitle = '';

    // Method 1: Look for title element
    const titleElement = trackElement.querySelector('.soundTitle__title') as HTMLElement;
    if (titleElement) {
      trackTitle = titleElement.textContent?.trim() || '';
    }

    // Method 2: Fallback to link text
    if (!trackTitle) {
      const titleLink = trackElement.querySelector('a[itemprop="url"]') as HTMLElement;
      if (titleLink) {
        trackTitle = titleLink.textContent?.trim() || '';
      }
    }

    // Method 3: Extract from URL
    if (!trackTitle) {
      const urlParts = url.split('/');
      trackTitle = urlParts[urlParts.length - 1] || 'Unknown Track';
    }

    // Try to get username
    let username = '';

    // Method 1: Look for username element
    const usernameElement = trackElement.querySelector('.soundTitle__username') as HTMLElement;
    if (usernameElement) {
      username = usernameElement.textContent?.trim() || '';
    }

    // Method 2: Extract from URL
    if (!username) {
      const urlParts = url.split('/');
      if (urlParts.length >= 4) {
        username = urlParts[3] || 'Unknown Artist';
      }
    }

    // Method 3: Get from page
    if (!username) {
      username = window.location.pathname.split('/')[1] || 'Unknown Artist';
    }

    if (!url || !trackTitle) {
      console.warn('[SoundCloud Extension] Missing required track data');
      return null;
    }

    return {
      username,
      trackTitle,
      url
    };
  } catch (error) {
    console.error('[SoundCloud Extension] Error extracting track from element:', error);
    return null;
  }
}

/**
 * Get all track items on the artist page, feed pages, and playlist track lists
 *
 * @returns Array of track item elements
 */
export function getTrackItems(): Element[] {
  // Try multiple selectors to find track items
  const selectors = [
    'li.compactTrackList__item',       // Playlist track lists, feed items
    '.soundList__item',                // Artist page track items
    '.trackItem',                      // Generic track items
    'li[class*="soundList__item"]',    // Partial match for soundList items
    'article[class*="trackItem"]'      // Partial match for trackItem articles
  ];

  for (const selector of selectors) {
    const items = Array.from(document.querySelectorAll(selector));
    if (items.length > 0) {
      console.log(`[SoundCloud Extension] Found ${items.length} track items using selector: ${selector}`);
      return items;
    }
  }

  console.warn('[SoundCloud Extension] No track items found');
  return [];
}
