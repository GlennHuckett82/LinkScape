import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import PostCard from './PostCard';

const PostList: React.FC = () => {
  const posts = useSelector((s: RootState) => s.posts.items);
  const term = useSelector((s: RootState) => s.ui.searchTerm);

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return posts;
    return posts.filter((p) => p.title.toLowerCase().includes(t) || p.subreddit.toLowerCase().includes(t));
  }, [term, posts]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((p) => (
        <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
};

export default PostList;
