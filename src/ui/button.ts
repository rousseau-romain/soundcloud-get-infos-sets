/**
 * Button creation and interaction handling module
 */

import { LONG_PRESS_DURATION, PULSE_DURATION } from '../shared/constants';
import { openOptionsPage } from '../shared/settings';
import { copyTracksAsJSON, copyTracksAsScript, copyPlaylistTracksAsJSON, copyPlaylistTracksAsScript } from '../utils/clipboard';
import { createIconSVG } from './icon';
import { Track } from '../shared/types';
import { addToCollection } from '../shared/collection';
import { showButtonFeedback } from './feedback';

/**
 * Button interaction handlers interface
 */
export interface ButtonHandlers {
  onShortPress: (button: HTMLButtonElement) => void;
  onLongPress: (button: HTMLButtonElement) => void;
  onShiftClick?: (button: HTMLButtonElement) => void; // Optional: defaults to opening settings page
}

/**
 * Attach long-press detection handlers to a button
 * - Short press: Execute onShortPress callback
 * - Long press (600ms+): Execute onLongPress callback
 * - Shift+Click: Open settings page
 *
 * @param button - The button element to attach handlers to
 * @param handlers - Object containing onShortPress and onLongPress callbacks
 */
export function attachLongPressHandlers(button: HTMLButtonElement, handlers: ButtonHandlers): void {
  let pressTimer: number | null = null;
  let isLongPress = false;
  let originalOpacity = '';

  const startPress = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    isLongPress = false;

    // Store original opacity for restoration
    originalOpacity = button.style.opacity;

    // Set timer for long press detection
    pressTimer = window.setTimeout(() => {
      isLongPress = true;
      // Visual feedback: pulse the button
      button.style.opacity = '0.7';
      setTimeout(() => {
        button.style.opacity = originalOpacity || '1';
      }, PULSE_DURATION);
    }, LONG_PRESS_DURATION);
  };

  const endPress = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    // Clear the timer
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }

    // Restore opacity
    button.style.opacity = originalOpacity || '1';

    // Check if Shift key was held (for settings)
    const shiftPressed = 'shiftKey' in event && event.shiftKey;

    // Execute appropriate action based on press duration and modifiers
    if (shiftPressed) {
      // Shift + Click = Execute custom shift-click handler or open settings page
      if (handlers.onShiftClick) {
        handlers.onShiftClick(button);
      } else {
        openOptionsPage();
      }
    } else if (isLongPress) {
      // Long press = Execute custom long press handler
      handlers.onLongPress(button);
    } else {
      // Short press = Execute custom short press handler
      handlers.onShortPress(button);
    }
  };

  const cancelPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    button.style.opacity = originalOpacity || '1';
    isLongPress = false;
  };

  // Mouse events
  button.addEventListener('mousedown', startPress);
  button.addEventListener('mouseup', endPress);
  button.addEventListener('mouseleave', cancelPress);

  // Touch events for mobile
  button.addEventListener('touchstart', startPress);
  button.addEventListener('touchend', endPress);
  button.addEventListener('touchcancel', cancelPress);
}

/**
 * Create a custom button matching SoundCloud's design
 *
 * @param id - The button element ID
 * @param title - The button label text
 * @param handlers - Object containing onShortPress and onLongPress callbacks
 * @returns The created button element
 */
export function createCustomButton(id: string, title: string, handlers: ButtonHandlers): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = id;
  button.className = 'sc-button-primary sc-button sc-button-medium sc-button-responsive';
  button.type = 'button';

  // Different tooltip based on whether custom shift-click handler is provided
  const shiftClickAction = handlers.onShiftClick ? 'Add to collection' : 'Settings';
  button.title = `${title}\n\nClick: Copy JSON\nLong-press: Copy batch script\nShift+Click: ${shiftClickAction}`;
  button.setAttribute('aria-label', title);

  // Add icon (created with DOM methods for security)
  const icon = createIconSVG();
  button.appendChild(icon);

  // Add text label
  const label = document.createElement('span');
  label.style.verticalAlign = 'middle';
  label.textContent = title;
  button.appendChild(label);

  // Add long-press handlers
  attachLongPressHandlers(button, handlers);

  return button;
}

/**
 * Create button handlers for playlist pages
 * Uses the backward-compatible wrapper functions
 *
 * @returns ButtonHandlers object for playlist pages
 */
export function createPlaylistButtonHandlers(): ButtonHandlers {
  return {
    onShortPress: (button: HTMLButtonElement) => {
      const originalText = button.innerHTML;
      button.innerHTML = '📋 Copying...';
      button.disabled = true;

      copyPlaylistTracksAsJSON();

      setTimeout(() => {
        button.disabled = false;
        showButtonFeedback(button, '✅ Copied!', 'success', 2000, originalText);
      }, 100);
    },
    onLongPress: (button: HTMLButtonElement) => {
      const originalText = button.innerHTML;
      button.innerHTML = '📜 Copying script...';
      button.disabled = true;

      copyPlaylistTracksAsScript();

      setTimeout(() => {
        button.disabled = false;
        showButtonFeedback(button, '✅ Copied!', 'success', 2000, originalText);
      }, 100);
    }
  };
}

/**
 * Create button handlers for song pages
 * Accepts a function that returns the song data when called
 *
 * @param getSongData - Function that returns the song track and name
 * @returns ButtonHandlers object for song pages
 */
export function createSongButtonHandlers(getSongData: () => { track: Track | null; name: string }): ButtonHandlers {
  return {
    onShortPress: (button: HTMLButtonElement) => {
      const originalText = button.innerHTML;
      const { track, name } = getSongData();

      if (!track) {
        console.warn('[SoundCloud Extension] Could not extract track data');
        showButtonFeedback(button, '❌ No data', 'error');
        return;
      }

      // Show copying state
      button.innerHTML = '📋 Copying...';
      button.disabled = true;

      // Copy single track as object (not array)
      const trackJson = JSON.stringify(track, null, 2);
      navigator.clipboard.writeText(trackJson)
        .then(() => {
          console.log('[SoundCloud Extension] Track copied:', name);
          button.disabled = false;
          showButtonFeedback(button, '✅ Copied!', 'success', 2000, originalText);
        })
        .catch((err) => {
          console.error('[SoundCloud Extension] Failed to copy to clipboard:', err);
          button.disabled = false;
          showButtonFeedback(button, '❌ Failed', 'error', 2000, originalText);
        });
    },
    onLongPress: (button: HTMLButtonElement) => {
      const originalText = button.innerHTML;
      const { track, name } = getSongData();

      if (!track) {
        console.warn('[SoundCloud Extension] Could not extract track data');
        showButtonFeedback(button, '❌ No data', 'error');
        return;
      }

      // Show copying state
      button.innerHTML = '📜 Copying script...';
      button.disabled = true;

      copyTracksAsScript([track], name);

      // Show success feedback
      setTimeout(() => {
        button.disabled = false;
        showButtonFeedback(button, '✅ Copied!', 'success', 2000, originalText);
      }, 100);
    },
    onShiftClick: async (button: HTMLButtonElement) => {
      const originalText = button.innerHTML;
      const { track, name } = getSongData();

      if (!track) {
        console.warn('[SoundCloud Extension] Could not extract track data');
        showButtonFeedback(button, '❌ No data', 'error');
        return;
      }

      // Show adding state
      button.innerHTML = '➕ Adding...';
      button.disabled = true;

      // Add track to collection
      const wasAdded = await addToCollection(track);

      button.disabled = false;

      if (wasAdded) {
        console.log('[SoundCloud Extension] Added to collection:', name);
        showButtonFeedback(button, '✅ Added!', 'success', 2000, originalText);
      } else {
        console.log('[SoundCloud Extension] Track already in collection:', name);
        showButtonFeedback(button, 'ℹ️ Already added', 'warning', 2000, originalText);
      }
    }
  };
}
