/**
 * Shared type definitions for the SoundCloud extension
 */

/**
 * Interface for track data extracted from playlist
 */
export interface Track {
  username: string;
  trackTitle: string;
  url: string;
}

/**
 * Interface for user-configurable settings
 */
export interface ExtensionSettings {
  commandsPerLine: number;
  commandName: string;
  separator: string;
}

/**
 * Output format for URL export
 */
export type OutputFormat = 'script' | 'list';
