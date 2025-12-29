/**
 * Options page for SoundCloud Extension
 */

import { ExtensionSettings, Track } from './shared/types';
import { DEFAULT_SETTINGS } from './shared/constants';
import { loadSettings, saveSettings } from './shared/settings';
import { loadCollection, saveCollection, clearCollection, removeFromCollection } from './shared/collection';
import { copyTracksAsScript } from './utils/clipboard';
import { showButtonFeedback } from './ui/feedback';

/**
 * Show status message (kept for potential future use, but buttons now show inline feedback)
 */
function showStatus(message: string, type: 'success' | 'error'): void {
  const statusEl = document.getElementById('status');
  if (!statusEl) {
    console.warn('[SoundCloud Extension] Status element not found');
    return;
  }

  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
  statusEl.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}

/**
 * Populate form with current settings
 */
function populateForm(): void {
  const settings = loadSettings();

  const commandNameInput = document.getElementById('commandName') as HTMLInputElement;
  const commandsPerLineInput = document.getElementById('commandsPerLine') as HTMLInputElement;
  const separatorInput = document.getElementById('separator') as HTMLInputElement;

  if (commandNameInput) commandNameInput.value = settings.commandName;
  if (commandsPerLineInput) commandsPerLineInput.value = settings.commandsPerLine.toString();
  if (separatorInput) separatorInput.value = settings.separator;

  // Update separator UI
  updateSeparatorUI(settings.separator);
}

/**
 * Update separator button UI
 */
function updateSeparatorUI(value: string): void {
  document.querySelectorAll('.separator-option').forEach(option => {
    const optionValue = option.getAttribute('data-value');
    if (optionValue === value) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

/**
 * Handle form submission
 */
function handleSubmit(event: Event): void {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

  const commandName = (formData.get('commandName') as string).trim();
  const commandsPerLineStr = formData.get('commandsPerLine') as string;
  const separator = formData.get('separator') as string;

  // Validation
  if (!commandName) {
    if (submitButton) {
      showButtonFeedback(submitButton, '❌ Name required', 'error');
    }
    return;
  }

  const commandsPerLine = parseInt(commandsPerLineStr, 10);
  if (isNaN(commandsPerLine) || commandsPerLine < 1 || commandsPerLine > 100) {
    if (submitButton) {
      showButtonFeedback(submitButton, '❌ Invalid number', 'error');
    }
    return;
  }

  if (!separator) {
    if (submitButton) {
      showButtonFeedback(submitButton, '❌ Separator required', 'error');
    }
    return;
  }

  // Save settings
  const newSettings: ExtensionSettings = {
    commandName,
    commandsPerLine,
    separator
  };

  try {
    saveSettings(newSettings);
    if (submitButton) {
      showButtonFeedback(submitButton, '✅ Settings saved!', 'success');
    }
  } catch (err) {
    if (submitButton) {
      showButtonFeedback(submitButton, '❌ Save failed', 'error');
    }
  }
}

/**
 * Reset settings to defaults
 */
function handleReset(event: Event): void {
  const button = event.target as HTMLButtonElement;

  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    saveSettings(DEFAULT_SETTINGS);
    populateForm();
    showButtonFeedback(button, '✅ Reset complete!', 'success');
  }
}

/**
 * Render the collection UI
 */
async function renderCollection(): Promise<void> {
  const collection = await loadCollection();
  const emptyState = document.getElementById('collectionEmpty');
  const collectionList = document.getElementById('collectionList');
  const collectionCount = document.getElementById('collectionCount');
  const tracksContainer = document.getElementById('collectionTracks');

  if (!emptyState || !collectionList || !collectionCount || !tracksContainer) return;

  if (collection.length === 0) {
    emptyState.style.display = 'block';
    collectionList.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    collectionList.style.display = 'block';
    collectionCount.textContent = `${collection.length} track${collection.length !== 1 ? 's' : ''}`;

    // Render tracks
    tracksContainer.innerHTML = '';
    collection.forEach((track) => {
      const trackEl = document.createElement('div');
      trackEl.className = 'track-item';
      trackEl.innerHTML = `
        <div class="track-info">
          <div class="track-title">${escapeHtml(track.trackTitle)}</div>
          <div class="track-artist">${escapeHtml(track.username)}</div>
          <div class="track-url">${escapeHtml(track.url)}</div>
        </div>
        <button class="track-remove" data-url="${escapeHtml(track.url)}">Remove</button>
      `;
      tracksContainer.appendChild(trackEl);
    });

    // Attach remove handlers
    tracksContainer.querySelectorAll('.track-remove').forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        const button = event.target as HTMLButtonElement;
        const originalText = button.innerHTML;
        const url = btn.getAttribute('data-url');

        if (url) {
          // Show loading state
          button.innerHTML = '⏳ Removing...';
          button.disabled = true;

          await removeFromCollection(url);
          await renderCollection();

          // Success feedback (will be replaced when re-rendered)
          showButtonFeedback(button, '✅ Removed!', 'success', 2000, originalText);
        }
      });
    });
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Export collection as JSON
 */
async function handleExportJSON(event: Event): Promise<void> {
  console.log('[SoundCloud Extension] Export JSON button clicked');
  const button = event.target as HTMLButtonElement;

  try {
    const collection = await loadCollection();
    console.log('[SoundCloud Extension] Collection loaded:', collection);

    if (collection.length === 0) {
      showButtonFeedback(button, '❌ No tracks', 'error');
      return;
    }

    const json = JSON.stringify(collection, null, 2);
    console.log('[SoundCloud Extension] JSON stringified, attempting clipboard write...');

    await navigator.clipboard.writeText(json);
    console.log('[SoundCloud Extension] Clipboard write successful');

    showButtonFeedback(button, `✅ Copied ${collection.length} tracks!`, 'success');
  } catch (err) {
    console.error('[SoundCloud Extension] Export JSON failed:', err);
    showButtonFeedback(button, '❌ Copy failed', 'error');
  }
}

/**
 * Export collection as script
 */
async function handleExportScript(event: Event): Promise<void> {
  const button = event.target as HTMLButtonElement;

  try {
    const collection = await loadCollection();
    if (collection.length === 0) {
      showButtonFeedback(button, '❌ No tracks', 'error');
      return;
    }

    copyTracksAsScript(collection, 'collection');

    showButtonFeedback(button, `✅ Copied ${collection.length} tracks!`, 'success');
  } catch (err) {
    console.error('[SoundCloud Extension] Export script failed:', err);
    showButtonFeedback(button, '❌ Copy failed', 'error');
  }
}

/**
 * Clear collection
 */
async function handleClearCollection(event: Event): Promise<void> {
  const button = event.target as HTMLButtonElement;

  const collection = await loadCollection();
  if (collection.length === 0) {
    showButtonFeedback(button, '❌ Already empty', 'error');
    return;
  }

  if (confirm(`Are you sure you want to clear all ${collection.length} tracks from your collection?`)) {
    await clearCollection();
    await renderCollection();
    showButtonFeedback(button, '✅ Cleared!', 'success');
  }
}

/**
 * Initialize options page
 */
async function initializeOptionsPage(): Promise<void> {
  // Populate form with current settings
  populateForm();

  // Render collection
  await renderCollection();

  // Attach form submit handler
  const form = document.getElementById('settingsForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  // Attach reset button handler
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', handleReset);
  }

  // Attach separator option handlers
  document.querySelectorAll('.separator-option').forEach(option => {
    option.addEventListener('click', () => {
      const value = option.getAttribute('data-value') || '&&';
      const separatorInput = document.getElementById('separator') as HTMLInputElement;
      if (separatorInput) {
        separatorInput.value = value;
        updateSeparatorUI(value);
      }
    });
  });

  // Attach collection action handlers
  const exportJSONBtn = document.getElementById('exportCollectionBtn');
  console.log('[SoundCloud Extension] Export JSON button found:', !!exportJSONBtn);
  if (exportJSONBtn) {
    exportJSONBtn.addEventListener('click', handleExportJSON);
  } else {
    console.warn('[SoundCloud Extension] Export JSON button not found in DOM');
  }

  const exportScriptBtn = document.getElementById('exportScriptBtn');
  console.log('[SoundCloud Extension] Export Script button found:', !!exportScriptBtn);
  if (exportScriptBtn) {
    exportScriptBtn.addEventListener('click', handleExportScript);
  }

  const clearBtn = document.getElementById('clearCollectionBtn');
  console.log('[SoundCloud Extension] Clear button found:', !!clearBtn);
  if (clearBtn) {
    clearBtn.addEventListener('click', handleClearCollection);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeOptionsPage);
} else {
  initializeOptionsPage();
}
