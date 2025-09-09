import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../store/uiSlice';

/**
 * SearchBar is a controlled input that debounces updates to the global search term.
 * HomePage listens to searchTerm changes to trigger search/feed fetches.
 */
const SearchBar = () => {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  // Debounce input changes to avoid firing a request on every keystroke
  useEffect(() => {
    const id = setTimeout(() => dispatch(setSearchTerm(value)), 250);
    return () => clearTimeout(id);
  }, [value, dispatch]);

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
