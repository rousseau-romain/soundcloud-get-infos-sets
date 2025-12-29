/**
 * Button feedback utility functions
 * Provides consistent visual feedback across all buttons
 */

export type FeedbackType = 'success' | 'error' | 'warning';

interface FeedbackColors {
  background: string;
  color: string;
}

const FEEDBACK_COLORS: Record<FeedbackType, FeedbackColors> = {
  success: { background: '#28a745', color: '#fff' },
  error: { background: '#dc3545', color: '#fff' },
  warning: { background: '#ffc107', color: '#fff' }
};

const DEFAULT_RESTORE_DELAY = 2000;

/**
 * Show temporary feedback on a button and auto-restore after delay
 *
 * @param button - The button element to show feedback on
 * @param message - The message to display (can include emoji)
 * @param type - The feedback type (success, error, or warning)
 * @param restoreDelay - Milliseconds before restoring (default: 2000)
 * @param originalText - Optional: explicit text to restore to (useful when button was already modified)
 * @returns The original button HTML for manual restoration if needed
 *
 * @example
 * showButtonFeedback(button, '✅ Saved!', 'success');
 * showButtonFeedback(button, '❌ Failed', 'error', 3000);
 *
 * // When button text was already changed:
 * const original = button.innerHTML;
 * button.innerHTML = 'Loading...';
 * // ... async work ...
 * showButtonFeedback(button, '✅ Done!', 'success', 2000, original);
 */
export function showButtonFeedback(
  button: HTMLButtonElement,
  message: string,
  type: FeedbackType,
  restoreDelay: number = DEFAULT_RESTORE_DELAY,
  originalText?: string
): string {
  const textToRestore = originalText ?? button.innerHTML;
  const colors = FEEDBACK_COLORS[type];

  button.innerHTML = message;
  button.style.background = colors.background;
  button.style.color = colors.color;

  setTimeout(() => {
    button.innerHTML = textToRestore;
    button.style.background = '';
    button.style.color = '';
  }, restoreDelay);

  return textToRestore;
}

/**
 * Set button to a feedback state without auto-restore
 * Useful when you need manual control over restoration
 *
 * @param button - The button element
 * @param message - The message to display
 * @param type - The feedback type
 * @returns Function to restore the button to its original state
 *
 * @example
 * const restore = setButtonState(button, '⏳ Loading...', 'success');
 * // ... do async work ...
 * restore();
 */
export function setButtonState(
  button: HTMLButtonElement,
  message: string,
  type: FeedbackType
): () => void {
  const originalText = button.innerHTML;
  const colors = FEEDBACK_COLORS[type];

  button.innerHTML = message;
  button.style.background = colors.background;
  button.style.color = colors.color;

  // Return restoration function
  return () => {
    button.innerHTML = originalText;
    button.style.background = '';
    button.style.color = '';
  };
}
