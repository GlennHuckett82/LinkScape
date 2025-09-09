import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

/**
 * Status represents the lifecycle of async requests made by this slice.
 * - idle: no request in-flight
 * - loading: pending network call
 * - succeeded: last request resolved OK
 * - failed: last request failed (see error)
 */
type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

/** A simplified subset of a Reddit post used throughout the UI. */
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

/** Comment item for top-level comments. */
export interface CommentItem {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
}

/** Details payload for a specific post (selftext + top-level comments). */
export interface PostDetails {
  status: Status;
  error?: string;
  selftext?: string;
  comments: CommentItem[];
}

/**
 * Redux state owned by the posts slice.
 * items: current list shown in the Home page grid
 * status/error: request state for fetch/search
 * after: pagination cursor from Reddit API (null when no more pages)
 * details: per-post details fetched on demand by PostPage
 */
export interface PostsState {
  items: PostItem[];
  status: Status;
  error?: string;
  after?: string | null; // pagination cursor
  details?: Record<string, PostDetails>;
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
  ],
  status: 'idle',
  error: undefined,
  after: null,
  details: {}
};

// Map Reddit API child to PostItem
function mapRedditPost(d: any): PostItem {
  return {
    id: d.id,
    title: d.title,
    author: d.author,
    subreddit: d.subreddit_name_prefixed || `r/${d.subreddit}`,
    thumbnail: typeof d.thumbnail === 'string' && d.thumbnail.startsWith('http') ? d.thumbnail : '',
    score: d.score ?? 0,
    num_comments: d.num_comments ?? 0,
    created_utc: d.created_utc ?? 0
  };
}

export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async (
    params: { category: 'hot' | 'new' | 'top'; after?: string | null; subreddit?: string },
    thunkAPI
  ) => {
  // Build the Reddit URL for either frontpage or a specific subreddit.
    const { category, after, subreddit } = params;
    const controller = new AbortController();
    thunkAPI.signal.addEventListener('abort', () => controller.abort());
    const base = subreddit ? `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/${category}.json` : `https://www.reddit.com/${category}.json`;
    const url = new URL(base);
    url.searchParams.set('limit', '25');
    if (after) url.searchParams.set('after', after);
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const children = json?.data?.children ?? [];
    const items: PostItem[] = children.map((c: any) => mapRedditPost(c.data));
    const next: string | null = json?.data?.after ?? null;
    return { items, after: next, append: !!after } as { items: PostItem[]; after: string | null; append: boolean };
  }
);

export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (params: { query: string; after?: string | null }, thunkAPI) => {
    const { query, after } = params;
    const controller = new AbortController();
    thunkAPI.signal.addEventListener('abort', () => controller.abort());
    const url = new URL('https://www.reddit.com/search.json');
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '25');
    if (after) url.searchParams.set('after', after);
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const children = json?.data?.children ?? [];
    const items: PostItem[] = children.map((c: any) => mapRedditPost(c.data));
    const next: string | null = json?.data?.after ?? null;
    return { items, after: next, append: !!after } as { items: PostItem[]; after: string | null; append: boolean };
  }
);

/**
 * Fetch a post's selftext and top-level comments by id.
 * Uses the public Reddit JSON endpoint: /comments/:id.json
 */
export const fetchPostDetails = createAsyncThunk(
  'posts/fetchPostDetails',
  async (params: { id: string }, thunkAPI) => {
    const { id } = params;
    const controller = new AbortController();
    thunkAPI.signal.addEventListener('abort', () => controller.abort());
    const url = new URL(`https://www.reddit.com/comments/${encodeURIComponent(id)}.json`);
    url.searchParams.set('limit', '20');
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // json[0] = post listing, json[1] = comments listing
    const postData = json?.[0]?.data?.children?.[0]?.data ?? {};
    const selftext: string | undefined = postData.selftext || undefined;
    const commentsRaw = json?.[1]?.data?.children ?? [];
    const comments: CommentItem[] = commentsRaw
      .filter((c: any) => c?.kind === 't1')
      .map((c: any) => ({
        id: c.data?.id,
        author: c.data?.author,
        body: c.data?.body || '',
        score: c.data?.score ?? 0,
        created_utc: c.data?.created_utc ?? 0
      }));
    return { id, selftext, comments } as { id: string; selftext?: string; comments: CommentItem[] };
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
  /** Set loading immediately to hide any previous error UI before retrying. */
  beginRequest(state) {
      state.status = 'loading';
      state.error = undefined;
    },
  /** Clear all posts and reset pagination and status. */
  clear(state) {
      state.items = [];
      state.after = null;
      state.error = undefined;
      state.status = 'idle';
      state.details = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<{ items: PostItem[]; after: string | null; append: boolean }>) => {
        state.status = 'succeeded';
        state.error = undefined;
        state.after = action.payload.after ?? null;
        state.items = action.payload.append ? [...state.items, ...action.payload.items] : action.payload.items;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load feed';
      })
      .addCase(searchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(searchPosts.fulfilled, (state, action: PayloadAction<{ items: PostItem[]; after: string | null; append: boolean }>) => {
        state.status = 'succeeded';
        state.error = undefined;
        state.after = action.payload.after ?? null;
        state.items = action.payload.append ? [...state.items, ...action.payload.items] : action.payload.items;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to search posts';
      })
      // Post details + comments handlers
      .addCase(fetchPostDetails.pending, (state, action) => {
        const id = (action.meta.arg as { id: string }).id;
        if (!state.details) state.details = {};
        state.details[id] = { status: 'loading', comments: [] };
      })
      .addCase(fetchPostDetails.fulfilled, (state, action: PayloadAction<{ id: string; selftext?: string; comments: CommentItem[] }>) => {
        const { id, selftext, comments } = action.payload;
        if (!state.details) state.details = {};
        state.details[id] = { status: 'succeeded', selftext, comments };
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        const id = (action.meta.arg as { id: string }).id;
        if (!state.details) state.details = {};
        state.details[id] = { status: 'failed', error: action.error.message || 'Failed to load details', comments: [] };
      });
  }
});

export const { clear, beginRequest } = postsSlice.actions;
export default postsSlice.reducer;
