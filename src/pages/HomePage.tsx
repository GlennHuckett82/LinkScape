import { useEffect } from 'react';
import SearchBar from '@/ui/SearchBar';
import FilterChips from '@/ui/FilterChips';
import PostList from '@/ui/PostList';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchFeed, searchPosts, beginRequest } from '@/store/postsSlice';

/**
 * HomePage wires the search/category UI to the posts slice.
 * - Triggers fetchFeed/searchPosts based on search term & category
 * - Renders loading/empty/content states
 * - Displays an inline error+retry banner next to the SearchBar on failure
 */
const HomePage = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, selectedCategory } = useSelector((s: RootState) => s.ui);
  const { status, error, items, after } = useSelector((s: RootState) => s.posts);

  // Fetch posts whenever the search term (debounced in SearchBar) or category changes
  useEffect(() => {
    const term = searchTerm.trim();
    if (term) {
      dispatch(searchPosts({ query: term }));
    } else {
      dispatch(fetchFeed({ category: selectedCategory }));
    }
  }, [dispatch, searchTerm, selectedCategory]);

  // Restore scroll position when returning from PostPage
  useEffect(() => {
    try {
      const y = sessionStorage.getItem('homeScrollY');
      if (y) {
        window.scrollTo({ top: Number(y), behavior: 'instant' as ScrollBehavior });
        sessionStorage.removeItem('homeScrollY');
      }
    } catch {}
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left cluster: Search + inline error banner when failed */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <SearchBar />
          {status === 'failed' && (
            <div
              className="md:w-[22rem] inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm md:shrink-0"
              title={error || undefined}
              aria-live="polite"
            >
              <span className="truncate">Couldn’t load posts</span>
              <button
                className="ml-auto inline-flex items-center rounded bg-red-600 px-2.5 py-1 text-white hover:bg-red-700"
                onClick={() => {
                  // Hide error immediately and retry the last request (search or feed)
                  const term = searchTerm.trim();
                  dispatch(beginRequest());
                  if (term) dispatch(searchPosts({ query: term }));
                  else dispatch(fetchFeed({ category: selectedCategory }));
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
        <FilterChips />
      </div>

      {/* Loading skeleton for the posts grid */}
      {status === 'loading' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading posts">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}
      {/* Failed state is shown inline next to the search bar */}
      {status === 'succeeded' && items.length === 0 && (
        <div className="rounded bg-gray-50 p-6 text-gray-700">No results found.</div>
      )}

      {/* Post grid */}
  {items.length > 0 && <div className="animate-fade-in-slow"><PostList /></div>}

      {/* Pagination: show Load more when we have a next-page cursor and we are not currently loading */}
      {after && status !== 'loading' && (
        <div className="flex justify-center pt-2">
          <button
            className="inline-flex items-center rounded bg-brand px-4 py-2 text-white hover:brightness-95"
            onClick={() => {
              const term = searchTerm.trim();
              if (term) dispatch(searchPosts({ query: term, after }));
              else dispatch(fetchFeed({ category: selectedCategory, after }));
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
