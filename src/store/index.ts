import { configureStore } from '@reduxjs/toolkit';
import uiReducer, { UIState } from '@/store/uiSlice';
import postsReducer, { PostsState } from '@/store/postsSlice';

/**
 * Root Redux store configuration for LinkScape.
 * - ui: lightweight UI preferences (search term, category)
 * - posts: Reddit posts data and request status/pagination
 */
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    posts: postsReducer
  }
});

/** Typed selector view of the store shape. */
export interface RootState {
  ui: UIState;
  posts: PostsState;
}
/** Dispatch type derived from the configured store. */
export type AppDispatch = typeof store.dispatch;
