/**
 * Song page utility functions
 */

import { Track } from '../shared/types';

/**
 * Check if the current page is a SoundCloud song/track page
 * Song pages follow the pattern: /{username}/{track-slug}
 * This excludes playlists (/sets/), user pages, and other special pages
 */
export function isSongPage(): boolean {
  const path = window.location.pathname;

  // Must have at least 2 path segments: /{username}/{track}
  const segments = path.split('/').filter(s => s.length > 0);

  // Exclude playlists (contain /sets/)
  if (path.includes('/sets/')) {
    return false;
  }

  // Exclude other non-song pages
  const excludedPaths = ['/likes', '/tracks', '/albums', '/reposts', '/popular-tracks', '/following', '/followers'];
  if (excludedPaths.some(excluded => path.includes(excluded))) {
    return false;
  }

  // Song pages have exactly 2 segments: username and track slug
  return segments.length === 2;
}

/**
 * Extract track data from the current song page
 * Uses multiple extraction strategies for robustness:
 * 1. OpenGraph meta tags (most reliable)
 * 2. Twitter meta tags
 * 3. DOM selectors (fallback)
 *
 * @returns Track object with username, title, and URL, or null if extraction fails
 */
export function getSongTrack(): Track | null {
  // Strategy 1: Try OpenGraph meta tags (most reliable)
  const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');

  // Strategy 2: Try Twitter meta tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
  const twitterUrl = document.querySelector('meta[name="twitter:url"]')?.getAttribute('content');

  // Strategy 3: Try page title
  const pageTitle = document.querySelector('title')?.textContent;

  // Strategy 4: Try DOM selectors (less reliable, but fallback)
  const soundTitleElement = document.querySelector('.soundTitle__title');
  const usernameLinkElement = document.querySelector('.soundTitle__username a');

  // Compile data with fallbacks
  const url = (ogUrl || twitterUrl || window.location.href).replace(/\?.*$/, '');
  let trackTitle = ogTitle || twitterTitle || pageTitle || soundTitleElement?.textContent?.trim() || '';
  const username = usernameLinkElement?.textContent?.trim() || '';

  // Clean up track title (remove " by Artist" suffix if present in page title)
  if (trackTitle.includes(' by ')) {
    trackTitle = trackTitle.split(' by ')[0].trim();
  }

  // Validate we have at least URL and title
  if (!url || !trackTitle) {
    console.warn('[SoundCloud Extension] Could not extract song data from page');
    return null;
  }

  return {
    username,
    trackTitle,
    url
  };
}

/**
 * Get the song title for display purposes
 * Extracts the actual track title from page metadata
 *
 * @returns The track title, or URL slug as fallback
 */
export function getSongName(): string {
  // Try to get the actual track title from metadata
  const track = getSongTrack();
  if (track && track.trackTitle) {
    return track.trackTitle;
  }

  // Fallback to URL slug if metadata extraction fails
  const pathParts = window.location.pathname.split('/').filter(s => s.length > 0);
  return pathParts[pathParts.length - 1] || 'track';
}
