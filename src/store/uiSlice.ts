import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  searchTerm: string;
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
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<'hot' | 'new' | 'top'>) {
      state.selectedCategory = action.payload;
    }
  }
});

export const { setSearchTerm, setSelectedCategory } = uiSlice.actions;
export default uiSlice.reducer;
