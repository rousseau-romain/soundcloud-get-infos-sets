/**
 * Button creation and interaction handling module
 */

import { LONG_PRESS_DURATION, PULSE_DURATION } from '../shared/constants';
import { openOptionsPage } from '../shared/settings';
import { copyTracksAsJSON, copyTracksAsScript } from '../utils/clipboard';
import { createIconSVG } from './icon';

/**
 * Attach long-press detection handlers to a button
 * - Short press: Copy full track JSON
 * - Long press (600ms+): Copy URLs as batch script
 * - Shift+Click: Open settings page
 */
export function attachLongPressHandlers(button: HTMLButtonElement): void {
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
      // Shift + Click = Open settings page
      openOptionsPage();
    } else if (isLongPress) {
      // Long press = Copy URLs with user settings
      copyTracksAsScript();
    } else {
      // Short press = Copy full JSON
      copyTracksAsJSON();
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
 */
export function createCustomButton(id: string, title: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = id;
  button.className = 'sc-button-primary sc-button sc-button-medium sc-button-responsive';
  button.type = 'button';
  button.title = `${title}\n\nClick: Copy JSON\nLong-press: Copy batch script\nShift+Click: Settings`;
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
  attachLongPressHandlers(button);

  return button;
}
