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

/** DOM selectors for finding the button container */
export const BUTTON_CONTAINER_SELECTORS = [
  '.soundActions.sc-button-toolbar',
  '.soundActions',
  '.listenEngagement__footer .soundActions',
  'div[class*="soundActions"]'
];

/** DOM selectors for track elements */
export const TRACK_SELECTORS = {
  item: 'li.trackList__item',
  username: '.trackItem__username',
  title: '.trackItem__trackTitle'
};
