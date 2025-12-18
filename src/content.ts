// SoundCloud Playlist Button Extension

const BUTTON_ID = 'soundcloud-get-info-sets-button';
const BUTTON_LABEL = 'Sets info';

/**
 * Interface for track data extracted from playlist
 */
interface Track {
  username: string;
  trackTitle: string;
  url: string;
}

/**
 * Check if the current page is a SoundCloud playlist/set page
 */
function isPlaylistPage(): boolean {
  return window.location.pathname.includes('/sets/');
}

/**
 * Create a custom button matching SoundCloud's design
 */
function createCustomButton(id: string, title: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = id;
  button.className = 'sc-button-primary sc-button sc-button-medium sc-button-responsive';
  button.type = 'button';
  button.title = title;
  button.setAttribute('aria-label', title);

  // Add icon and text
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
      <circle cx="48" cy="48" r="46" fill="#FF5500" stroke="#FF3300" stroke-width="2"/>
      <g fill="white" opacity="0.9">
        <rect x="22" y="20" width="32" height="4" rx="2"/>
        <circle cx="58" cy="22" r="3"/>
        <rect x="22" y="32" width="28" height="4" rx="2"/>
        <circle cx="54" cy="34" r="3"/>
        <rect x="22" y="44" width="35" height="4" rx="2"/>
        <circle cx="61" cy="46" r="3"/>
        <rect x="22" y="56" width="30" height="4" rx="2"/>
        <circle cx="56" cy="58" r="3"/>
        <rect x="22" y="68" width="26" height="4" rx="2"/>
        <circle cx="52" cy="70" r="3"/>
      </g>
      <g fill="white">
        <path d="M 68 50 L 68 72 L 78 72 L 78 50 Z" opacity="0.95"/>
        <path d="M 73 72 L 83 62 L 73 52 L 63 62 Z" opacity="0.95"/>
      </g>
      <g opacity="0.3" fill="white">
        <rect x="12" y="82" width="2" height="6" rx="1"/>
        <rect x="16" y="80" width="2" height="8" rx="1"/>
        <rect x="20" y="78" width="2" height="10" rx="1"/>
        <rect x="24" y="81" width="2" height="7" rx="1"/>
        <rect x="28" y="83" width="2" height="5" rx="1"/>
      </g>
    </svg>
    <span style="vertical-align: middle;">${title}</span>
  `;

  // Add click handler
  button.addEventListener('click', handleButtonClick);

  return button;
}

/**
 * Extract all tracks from the current playlist page
 */
function getTracks(): Track[] {
  return Array.from(document.querySelectorAll('li.trackList__item')).map((item) => {
    const usernameElement = item.querySelector('.trackItem__username') as HTMLElement;
    const trackTitleElement = item.querySelector('.trackItem__trackTitle') as HTMLAnchorElement;

    const username = usernameElement?.innerText.trim() || '';
    const trackTitle = trackTitleElement?.innerText.trim() || '';
    const url = trackTitleElement?.href.replace(/\?.*$/, '') || '';

    return { username, trackTitle, url };
  });
}

/**
 * Handle button click event
 */
function handleButtonClick(event: MouseEvent): void {
  event.preventDefault();

  // Extract playlist name from URL
  const pathParts = window.location.pathname.split('/');
  const setName = pathParts[pathParts.length - 1];

  // Extract all tracks from the playlist
  const tracks = getTracks();

  // Check if user might need to load more tracks
  // SoundCloud loads tracks in batches (typically 30 at a time)
  if (tracks.length > 0 && tracks.length % 30 === 0) {
    const shouldContinue = confirm(
      `⚠️ Warning: Found exactly ${tracks.length} tracks.\n\n` +
      `SoundCloud loads tracks in batches of 30. You might not have loaded all tracks yet!\n\n` +
      `To load more:\n` +
      `1. Scroll down to the bottom of the playlist\n` +
      `2. Wait for more tracks to load\n` +
      `3. Click this button again\n\n` +
      `Do you want to export the current ${tracks.length} tracks anyway?`
    );

    if (!shouldContinue) {
      return;
    }
  }

  // Copy track data to clipboard as JSON
  const tracksJson = JSON.stringify(tracks, null, 2);
  navigator.clipboard.writeText(tracksJson).then(() => {
    alert(`✅ Copied ${tracks.length} tracks from playlist "${setName}" to clipboard!`);
  }).catch((err) => {
    console.error('[SoundCloud Extension] Failed to copy to clipboard:', err);
    alert(`Found ${tracks.length} tracks. Check console for details.`);
  });
}

/**
 * Inject the custom button into the playlist header
 */
function injectButton(): void {
  // Check if button already exists
  if (document.getElementById(BUTTON_ID)) {
    return;
  }

  // Find the button container in the playlist header
  // SoundCloud uses different selectors, we'll try multiple approaches
  const selectors = [
    '.soundActions.sc-button-toolbar',
    '.soundActions',
    '.listenEngagement__footer .soundActions',
    'div[class*="soundActions"]'
  ];

  let container: HTMLElement | null = null;

  for (const selector of selectors) {
    container = document.querySelector<HTMLElement>(selector);
    if (container) {
      break;
    }
  }

  if (!container) {
    console.log('[SoundCloud Extension] Button container not found, retrying...');
    return;
  }

  // Create and inject the button
  const button = createCustomButton(BUTTON_ID, BUTTON_LABEL);
  container.appendChild(button);
}

/**
 * Initialize the extension on playlist pages
 */
function initializeExtension(): void {
  if (!isPlaylistPage()) {
    return;
  }

  // Try to inject button immediately
  injectButton();

  // Also try after a short delay (for dynamic content)
  setTimeout(injectButton, 1000);
  setTimeout(injectButton, 2000);
}

/**
 * Monitor URL changes for SPA navigation
 */
function watchForNavigation(): void {
  let lastUrl = window.location.href;

  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      initializeExtension();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

}

initializeExtension();

// Watch for navigation changes (SoundCloud is a SPA)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    watchForNavigation();
  });
} else {
  watchForNavigation();
}
