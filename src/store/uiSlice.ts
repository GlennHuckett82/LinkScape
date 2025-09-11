import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * UI state holds lightweight view preferences and inputs.
 * Think of this as the glue between controls (search/chips) and what Home shows.
 */
export interface UIState {
  /** Current search query. Submitted via Enter/button in SearchBar. */
  searchTerm: string;
  /** Active category for the frontpage feed filter. */
  selectedCategory: 'hot' | 'new' | 'top';
  /** Small nonce to force re-running a search even if the term didn’t change. */
  searchNonce: number;
  /**
   * We keep the home nice and clean on first load (just controls + background).
   * This flag flips to true after the user interacts so we can fetch content.
   */
  hasInteracted: boolean;
}

const initialState: UIState = {
  searchTerm: '',
  selectedCategory: 'hot',
  searchNonce: 0,
  hasInteracted: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
  /** Update the global search term. HomePage reacts to this to run a search. */
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      if (action.payload.trim() !== '') state.hasInteracted = true;
    },
  /** Set the active category filter (Hot/New/Top). Also re-sorts current search. */
    setSelectedCategory(state, action: PayloadAction<'hot' | 'new' | 'top'>) {
      state.selectedCategory = action.payload;
      state.hasInteracted = true;
    },
  /** Force-trigger a search without changing the term (useful for same-term resubmits). */
    triggerSearch(state) {
      state.searchNonce++;
    },
  /** Explicitly set hasInteracted to true (used for E2E seed or special flows). */
    markInteracted(state) {
      state.hasInteracted = true;
    },
  /** Reset home to initial—show only controls and the background. */
    resetHome(state) {
      state.searchTerm = '';
      state.selectedCategory = 'hot';
      state.hasInteracted = false;
      // leave searchNonce as-is; it only forces re-run when needed
    }
  }
});

export const { setSearchTerm, setSelectedCategory, triggerSearch, markInteracted, resetHome } = uiSlice.actions;
export default uiSlice.reducer;
