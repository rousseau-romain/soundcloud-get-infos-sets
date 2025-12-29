/**
 * Track collection management module
 * Handles storing and managing a collection of tracks added via shift+click
 * Uses chrome.storage.local for cross-context storage (content scripts + extension pages)
 */

import { Track } from './types';

const COLLECTION_KEY = 'soundcloud-extension-collection';

/**
 * Get the browser storage API (works in both Chrome and Firefox)
 */
function getStorage() {
  // Chrome uses chrome.storage, Firefox uses browser.storage (but also supports chrome.storage)
  return typeof chrome !== 'undefined' && chrome.storage ? chrome.storage.local : null;
}

/**
 * Load the track collection from chrome.storage
 */
export async function loadCollection(): Promise<Track[]> {
  try {
    const storage = getStorage();
    if (!storage) {
      console.warn('[SoundCloud Extension] Storage API not available');
      return [];
    }

    const result = await storage.get(COLLECTION_KEY);
    return result[COLLECTION_KEY] || [];
  } catch (err) {
    console.error('[SoundCloud Extension] Failed to load collection:', err);
    return [];
  }
}

/**
 * Save the track collection to chrome.storage
 */
export async function saveCollection(tracks: Track[]): Promise<void> {
  try {
    const storage = getStorage();
    if (!storage) {
      throw new Error('Storage API not available');
    }

    await storage.set({ [COLLECTION_KEY]: tracks });
  } catch (err) {
    console.error('[SoundCloud Extension] Failed to save collection:', err);
    throw err;
  }
}

/**
 * Add a track to the collection
 * @param track - The track to add
 * @returns true if added, false if already exists (duplicate)
 */
export async function addToCollection(track: Track): Promise<boolean> {
  const collection = await loadCollection();

  // Check for duplicates based on URL
  const isDuplicate = collection.some(t => t.url === track.url);

  if (isDuplicate) {
    return false;
  }

  collection.push(track);
  await saveCollection(collection);
  return true;
}

/**
 * Remove a track from the collection by URL
 */
export async function removeFromCollection(url: string): Promise<void> {
  const collection = await loadCollection();
  const filtered = collection.filter(t => t.url !== url);
  await saveCollection(filtered);
}

/**
 * Clear all tracks from the collection
 */
export async function clearCollection(): Promise<void> {
  await saveCollection([]);
}

/**
 * Get the number of tracks in the collection
 */
export async function getCollectionCount(): Promise<number> {
  const collection = await loadCollection();
  return collection.length;
}

/**
 * Check if a track is already in the collection
 */
export async function isInCollection(url: string): Promise<boolean> {
  const collection = await loadCollection();
  return collection.some(t => t.url === url);
}
