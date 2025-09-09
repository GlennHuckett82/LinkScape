import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store';
import { setSelectedCategory } from '../store/uiSlice';

const categories: Array<{ key: 'hot' | 'new' | 'top'; label: string }> = [
  { key: 'hot', label: 'Hot' },
  { key: 'new', label: 'New' },
  { key: 'top', label: 'Top' }
];

/**
 * FilterChips toggles the active feed category. It writes to ui.selectedCategory,
 * which HomePage uses to fetch the chosen feed.
 */
const FilterChips = () => {
  const dispatch = useDispatch();
  const selected = useAppSelector((s: RootState) => s.ui.selectedCategory);
  return (
    <div className="flex gap-2">
      {categories.map((c) => (
        <button
          key={c.key}
          className={`px-3 py-1 rounded-full border text-sm ${
            selected === c.key ? 'bg-brand text-white border-brand' : 'bg-white hover:bg-gray-50'
          }`}
          onClick={() => dispatch(setSelectedCategory(c.key))}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;
