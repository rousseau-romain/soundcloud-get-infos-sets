/**
 * Options page for SoundCloud Extension
 */

import { ExtensionSettings } from './shared/types';
import { DEFAULT_SETTINGS } from './shared/constants';
import { loadSettings, saveSettings } from './shared/settings';

/**
 * Show status message
 */
function showStatus(message: string, type: 'success' | 'error'): void {
  const statusEl = document.getElementById('status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;

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

  const commandName = (formData.get('commandName') as string).trim();
  const commandsPerLineStr = formData.get('commandsPerLine') as string;
  const separator = formData.get('separator') as string;

  // Validation
  if (!commandName) {
    showStatus('❌ Command name cannot be empty', 'error');
    return;
  }

  const commandsPerLine = parseInt(commandsPerLineStr, 10);
  if (isNaN(commandsPerLine) || commandsPerLine < 1 || commandsPerLine > 100) {
    showStatus('❌ Commands per line must be between 1 and 100', 'error');
    return;
  }

  if (!separator) {
    showStatus('❌ Separator cannot be empty', 'error');
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
    showStatus('✅ Settings saved successfully!', 'success');
  } catch (err) {
    showStatus('❌ Failed to save settings. Please try again.', 'error');
  }
}

/**
 * Reset settings to defaults
 */
function handleReset(): void {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    saveSettings(DEFAULT_SETTINGS);
    populateForm();
    showStatus('🔄 Settings reset to defaults', 'success');
  }
}

/**
 * Initialize options page
 */
function initializeOptionsPage(): void {
  // Populate form with current settings
  populateForm();

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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeOptionsPage);
} else {
  initializeOptionsPage();
}
