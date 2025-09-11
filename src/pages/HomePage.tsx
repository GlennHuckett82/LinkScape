import { useEffect } from 'react';
import SearchBar from '@/ui/SearchBar';
import FilterChips from '@/ui/FilterChips';
import PostList from '@/ui/PostList';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchFeed, searchPosts } from '@/store/postsSlice';
import { setSearchTerm, resetHome } from '@/store/uiSlice';

/**
 * HomePage is the main hub that wires search + category chips to the data store.
 * - It waits for the first user interaction (search or chip click) before loading.
 * - Searches honor the selected sort (Hot/New/Top) and can be re-triggered.
 * - A footer shows "Back to homepage" (always when content shows) and "Load more" when available.
 */
const HomePage = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, selectedCategory, searchNonce, hasInteracted } = useSelector((s: RootState) => s.ui);
  const { status, error, items, after } = useSelector((s: RootState) => s.posts);

  // Fetch posts whenever the search term (debounced in SearchBar) or category changes
  useEffect(() => {
    // Do not auto-fetch on first view; wait until the user interacts.
    if (!hasInteracted) return;
    const term = searchTerm.trim();
    if (term) {
      // When searching, respect the selected category as the sort for search results.
      dispatch(searchPosts({ query: term, sort: selectedCategory }));
    } else {
      dispatch(fetchFeed({ category: selectedCategory }));
    }
  }, [dispatch, searchTerm, selectedCategory, searchNonce, hasInteracted]);

  // Auto-clear the search box if a search returns zero items, so it's blank for the next attempt
  useEffect(() => {
    if (status === 'succeeded' && searchTerm.trim() && items.length === 0) {
      dispatch(setSearchTerm(''));
    }
  }, [status, searchTerm, items.length, dispatch]);

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
          {/* Removed retry banner */}
        </div>
        <FilterChips />
      </div>

  {/* Loading skeleton for the posts grid (only after first interaction) */}
  {hasInteracted && status === 'loading' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading posts">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Post grid */}
  {hasInteracted && items.length > 0 && <div className="animate-fade-in-slow"><PostList /></div>}

      {/* Footer actions: Back to homepage is always available when content is shown; Load more appears when there's a next page. */}
      {hasInteracted && items.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-brand/30 bg-white px-4 py-2 text-sm text-brand hover:bg-brand/5 focus:outline-none focus:ring-2 focus:ring-brand/40"
            onClick={() => {
              dispatch(resetHome());
              // HomePage will hide the grid immediately due to hasInteracted=false
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span aria-hidden>←</span>
            <span>Back to homepage</span>
          </button>
          {after && status !== 'loading' && (
            <button
              className="inline-flex items-center rounded bg-brand px-4 py-2 text-white hover:brightness-95"
              onClick={() => {
                const term = searchTerm.trim();
                if (term) dispatch(searchPosts({ query: term, sort: selectedCategory, after }));
                else dispatch(fetchFeed({ category: selectedCategory, after }));
              }}
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
