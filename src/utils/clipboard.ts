/**
 * Clipboard utility functions
 */

import { Track, OutputFormat } from '../shared/types';
import { getTracks, getPlaylistName, checkBatchLoadingWarning } from './playlist';
import { loadSettings } from '../shared/settings';

/**
 * Copy full track data as JSON to clipboard
 */
export function copyTracksAsJSON(): void {
  const playlistName = getPlaylistName();
  const tracks = getTracks();

  // Check if user might need to load more tracks
  if (!checkBatchLoadingWarning(tracks.length, 'export')) {
    return;
  }

  // Copy track data to clipboard as JSON
  const tracksJson = JSON.stringify(tracks, null, 2);
  navigator.clipboard.writeText(tracksJson)
    .then(() => {
      alert(`✅ Copied ${tracks.length} tracks from playlist "${playlistName}" to clipboard!`);
    })
    .catch((err) => {
      console.error('[SoundCloud Extension] Failed to copy to clipboard:', err);
      alert(`Found ${tracks.length} tracks. Check console for details.`);
    });
}

/**
 * Copy URLs in specified format to clipboard
 */
export function copyTracksAsScript(
  format: OutputFormat = 'script',
  commandsPerLine?: number,
  commandName?: string,
  separator?: string
): void {
  // Load settings if parameters not provided
  const settings = loadSettings();
  const finalCommandsPerLine = commandsPerLine ?? settings.commandsPerLine;
  const finalCommandName = commandName ?? settings.commandName;
  const finalSeparator = separator ?? settings.separator;

  const playlistName = getPlaylistName();
  const tracks = getTracks();

  // Check if user might need to load more tracks
  if (!checkBatchLoadingWarning(tracks.length, 'export URLs for')) {
    return;
  }

  let outputText: string;
  let successMessage: string;

  if (format === 'script') {
    // Format as batch download script
    outputText = formatAsBatchScript(tracks, finalCommandName, finalCommandsPerLine, finalSeparator);
    successMessage =
      `✅ Long press detected!\n\n` +
      `Copied batch download script for ${tracks.length} tracks from playlist "${playlistName}"!\n\n` +
      `Command: ${finalCommandName}\n` +
      `Format: ${finalCommandsPerLine} per line with '${finalSeparator}' separator`;
  } else {
    // Format as plain list of URLs
    outputText = tracks.map(track => track.url).join('\n');
    successMessage =
      `✅ Long press detected!\n\n` +
      `Copied ${tracks.length} track URLs from playlist "${playlistName}"!\n\n` +
      `Format: One URL per line.`;
  }

  navigator.clipboard.writeText(outputText)
    .then(() => {
      alert(successMessage);
    })
    .catch((err) => {
      console.error('[SoundCloud Extension] Failed to copy to clipboard:', err);
      alert(`Found ${tracks.length} tracks. Check console for details.`);
    });
}

/**
 * Format tracks as batch download script
 */
function formatAsBatchScript(
  tracks: Track[],
  commandName: string,
  commandsPerLine: number,
  separator: string
): string {
  return tracks.reduce((acc, track, i) => {
    acc += `${commandName} ${track.url}`;
    if ((i + 1) % commandsPerLine === 0 && i < tracks.length - 1) {
      // Every Nth command, add separator and newline
      acc += ` ${separator}\n`;
    } else if (i < tracks.length - 1) {
      // Not last command, add separator
      acc += ` ${separator} `;
    }
    return acc;
  }, '');
}
