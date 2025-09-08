import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const PostPage = () => {
  const { id } = useParams();
  const post = useSelector((s: RootState) => s.posts.items.find(p => p.id === id));
  return (
    <div className="space-y-4">
      <Link to="/" className="text-brand">← Back</Link>
      {post ? (
        <>
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <div className="text-sm text-gray-600">{post.subreddit} • u/{post.author}</div>
          <div className="text-xs text-gray-500">⬆️ {post.score} • 💬 {post.num_comments}</div>
        </>
      ) : (
        <p className="text-gray-600">Post not found.</p>
      )}
    </div>
  );
};

export default PostPage;
