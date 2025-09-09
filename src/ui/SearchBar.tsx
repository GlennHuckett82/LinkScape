import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../store/uiSlice';
import type { RootState } from '../store';

/**
 * SearchBar is a controlled input that debounces updates to the global search term.
 * HomePage listens to searchTerm changes to trigger search/feed fetches.
 */
const SearchBar = () => {
  const dispatch = useDispatch();
  const storeTerm = useSelector((s: RootState) => s.ui.searchTerm);
  const [value, setValue] = useState(storeTerm);

  // Debounce input changes to avoid firing a request on every keystroke
  useEffect(() => {
    const id = setTimeout(() => {
      if (value !== storeTerm) dispatch(setSearchTerm(value));
    }, 250);
    return () => clearTimeout(id);
  }, [value, storeTerm, dispatch]);

  // Sync local input when store term is externally cleared/changed
  useEffect(() => {
    setValue(storeTerm);
  }, [storeTerm]);

  return (
    <input
      aria-label="Search posts"
      className="w-full md:w-80 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
      placeholder="Search..."
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
    />
  );
};

export default SearchBar;
