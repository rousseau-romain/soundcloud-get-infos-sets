/**
 * Shared constants for the SoundCloud extension
 */

import { ExtensionSettings } from './types';

/** Button identifier */
export const BUTTON_ID = 'soundcloud-get-info-sets-button';

/** Button label text */
export const BUTTON_LABEL = 'Sets info';

/** localStorage key for settings */
export const SETTINGS_KEY = 'soundcloud-extension-settings';

/** Long press detection threshold in milliseconds */
export const LONG_PRESS_DURATION = 600;

/** Visual feedback pulse duration in milliseconds */
export const PULSE_DURATION = 150;

/** SoundCloud batch loading sizes (varies by playlist type) */
export const BATCH_SIZES = [15, 30];

/** Default extension settings */
export const DEFAULT_SETTINGS: ExtensionSettings = {
  commandsPerLine: 5,
  commandName: 'dl-soundcloud',
  separator: '&&'
};

/** DOM selectors for finding the button container in playlist headers */
export const BUTTON_CONTAINER_SELECTORS = [
  '.systemPlaylistDetails__controls',        // Discover sets header (/discover/sets/)
  '.sc-button-group',                        // User playlists button group (/username/sets/)
  // '.soundActions.sc-button-toolbar',         // Legacy playlist pages with toolbar
  '.soundActions',                           // Generic playlist action buttons
  // '.listenEngagement__footer .soundActions', // Legacy user playlists
  'div[class*="soundActions"]'               // Fallback: any div with "soundActions" in class name
];

/** DOM selectors for track elements in playlists */
export const TRACK_SELECTORS = {
  itemPlaylist: 'li.compactTrackList__item', // Track (playlist) items in set
  item: 'li.trackList__item',              // Track items in set
  itemDiscover: 'li.systemPlaylistTrackList__item', // Track items in discover sets
  username: '.trackItem__username',        // Track username element
  title: '.trackItem__trackTitle'          // Track title link
};

/** Button identifier for song pages */
export const SONG_BUTTON_ID = 'soundcloud-get-info-track-button';

/** Button label text for song pages */
export const SONG_BUTTON_LABEL = 'Track info';

/** DOM selectors for finding the button container on song pages */
export const SONG_BUTTON_CONTAINER_SELECTORS = [
  '.sc-button-group',                  // Modern song pages button group
  '.soundActions.sc-button-toolbar',   // Song pages with toolbar layout
  '.soundActions',                     // Generic song page action buttons
  'div[class*="soundActions"]'         // Fallback: any div with "soundActions" in class name
];

/** Button identifier for artist page tracks */
export const ARTIST_BUTTON_ID_PREFIX = 'soundcloud-get-info-artist-track-button';

/** Button label text for artist page tracks */
export const ARTIST_BUTTON_LABEL = 'Get info';

/** DOM selectors for finding the button container on artist page tracks and playlist track items */
export const ARTIST_BUTTON_CONTAINER_SELECTORS = [
  '.sc-button-group',                  // Modern track item button group (artist pages, feeds, playlist tracks)a
  '.soundActions.sc-button-toolbar',   // Track items with toolbar layout
  '.soundActions',                     // Generic track action buttons
  'div[class*="soundActions"]'         // Fallback: any div with "soundActions" in class name
];
