import SearchBar from '@/ui/SearchBar';
import FilterChips from '@/ui/FilterChips';
import PostList from '@/ui/PostList';

const HomePage = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchBar />
        <FilterChips />
      </div>
      <PostList />
    </div>
  );
};

export default HomePage;
