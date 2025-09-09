import { useEffect } from 'react';
import SearchBar from '@/ui/SearchBar';
import FilterChips from '@/ui/FilterChips';
import PostList from '@/ui/PostList';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchFeed, searchPosts } from '@/store/postsSlice';
import { setSearchTerm } from '@/store/uiSlice';

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

      {/* Loading skeleton for the posts grid */}
      {status === 'loading' && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading posts">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
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
