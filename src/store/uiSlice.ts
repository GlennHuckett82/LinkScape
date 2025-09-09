import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** UI state for lightweight view preferences and inputs. */
export interface UIState {
  /** Current search query typed by the user (debounced in SearchBar). */
  searchTerm: string;
  /** Active category for the frontpage feed filter. */
  selectedCategory: 'hot' | 'new' | 'top';
}

const initialState: UIState = {
  searchTerm: '',
  selectedCategory: 'hot'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /** Update the global search term. Triggers fetch/search in HomePage effect. */
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    /** Set the active category filter (Hot/New/Top). */
    setSelectedCategory(state, action: PayloadAction<'hot' | 'new' | 'top'>) {
      state.selectedCategory = action.payload;
    }
  }
});

export const { setSearchTerm, setSelectedCategory } = uiSlice.actions;
export default uiSlice.reducer;
