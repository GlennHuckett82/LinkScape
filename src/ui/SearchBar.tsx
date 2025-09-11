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

  // Sync local input when store term is externally cleared/changed
  useEffect(() => {
    setValue(storeTerm);
  }, [storeTerm]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value !== storeTerm) dispatch(setSearchTerm(value));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    // If user cleared the field, immediately clear global term to return to feed
    if (next === '' && storeTerm !== '') dispatch(setSearchTerm(''));
  };

  return (
    <form onSubmit={onSubmit} className="contents">
      <input
        aria-label="Search posts"
        className="w-full md:w-80 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
        placeholder="Search (press Enter)"
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

export default SearchBar;
