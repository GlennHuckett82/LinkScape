import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, triggerSearch } from '../store/uiSlice';
import type { RootState } from '../store';

/**
 * SearchBar is a controlled input that submits on Enter or the Search button.
 * HomePage listens to searchTerm changes (and a small nonce) to run searches.
 * Clearing the field resets the app to the clean homepage state.
 */
const SearchBar = () => {
  const dispatch = useDispatch();
  const storeTerm = useSelector((s: RootState) => s.ui.searchTerm);
  const [value, setValue] = useState(storeTerm);

  // Sync local input when store term is externally cleared/changed
  useEffect(() => {
    setValue(storeTerm);
  }, [storeTerm]);

  const submitValue = () => {
    const trimmed = value.trim();
    if (trimmed === '') return; // don't trigger on empty/whitespace
    if (trimmed !== storeTerm) dispatch(setSearchTerm(trimmed));
    else dispatch(triggerSearch());
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitValue();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    // If user cleared the field, immediately clear global term to return to feed (but do not auto-fetch until interaction)
    if (next === '' && storeTerm !== '') dispatch(setSearchTerm(''));
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input
        aria-label="Search posts"
        className="w-full md:w-80 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
        placeholder="Search (press Enter)"
        value={value}
        onChange={onChange}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitValue();
          }
        }}
      />
      <button type="submit" className="rounded bg-brand px-3 py-2 text-white hover:brightness-95">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
