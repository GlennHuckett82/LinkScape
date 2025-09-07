import { createSlice } from '@reduxjs/toolkit';

export interface PostItem {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  thumbnail?: string;
  score: number;
  num_comments: number;
  created_utc: number;
}

export interface PostsState {
  items: PostItem[];
}

const initialState: PostsState = {
  items: [
    {
      id: '1',
      title: 'Welcome to LinkScape – your gateway to Reddit!',
      author: 'mod',
      subreddit: 'r/popular',
      thumbnail: '',
      score: 1234,
      num_comments: 345,
      created_utc: Math.floor(Date.now() / 1000)
    },
    {
      id: '2',
      title: 'Search and filter posts with a clean, responsive UI',
      author: 'dev',
      subreddit: 'r/reactjs',
      thumbnail: '',
      score: 888,
      num_comments: 120,
      created_utc: Math.floor(Date.now() / 1000) - 3600
    }
  ]
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}
});

export default postsSlice.reducer;
