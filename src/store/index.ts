import { configureStore } from '@reduxjs/toolkit';
import uiReducer, { UIState } from '@/store/uiSlice';
import postsReducer, { PostsState } from '@/store/postsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    posts: postsReducer
  }
});

export interface RootState {
  ui: UIState;
  posts: PostsState;
}
export type AppDispatch = typeof store.dispatch;
