import LZString from 'lz-string';
import type { AppState } from '../types';
import { defaultState } from '../types';

const HISTORY_KEY = 'cf_generator_history';
const MAX_HISTORY = 10;

export const saveHistory = (state: AppState) => {
  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    let history: AppState[] = historyStr ? JSON.parse(historyStr) : [];
    
    // Check if duplicate (simple serialization check)
    const stateStr = JSON.stringify(state);
    history = history.filter(h => JSON.stringify(h) !== stateStr);
    
    // Add to top
    history.unshift(state);
    
    // Limit to 10
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history', e);
  }
};

export const getHistory = (): AppState[] => {
  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    return historyStr ? JSON.parse(historyStr) : [];
  } catch (e) {
    return [];
  }
};

export const serializeStateToHash = (state: AppState) => {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
  window.history.replaceState(null, '', `#config=${compressed}`);
};

export const deserializeStateFromHash = (): AppState | null => {
  const hash = window.location.hash;
  if (hash.startsWith('#config=')) {
    const compressed = hash.substring(8);
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
      if (decompressed) {
        return { ...defaultState, ...JSON.parse(decompressed) };
      }
    } catch (e) {
      console.error('Failed to parse config from URL', e);
    }
  }
  return null;
};
