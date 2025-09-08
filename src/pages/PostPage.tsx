import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const PostPage = () => {
  const { id } = useParams();
  const post = useSelector((s: RootState) => s.posts.items.find(p => p.id === id));
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">
          <span aria-hidden>←</span>
          <span>Back to results</span>
        </Link>
      </div>

      {post ? (
        <article className="rounded-lg bg-white/95 shadow p-5 md:p-7">
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">{post.subreddit}</span>
              <span>u/{post.author}</span>
              <span className="text-gray-400">•</span>
              <span>⬆️ {post.score}</span>
              <span className="text-gray-400">•</span>
              <span>💬 {post.num_comments}</span>
            </div>
          </header>

          {post.thumbnail ? (
            <div className="mt-5">
              <img
                src={post.thumbnail}
                alt="Post thumbnail"
                className="w-full h-auto rounded-md object-cover"
                loading="lazy"
              />
            </div>
          ) : null}

          {/* Body/content will be populated once Reddit API is wired */}
          <div className="mt-6 text-[1.05rem] leading-8 text-gray-800">
            <p className="text-gray-600">A richer reading view will appear here when we connect to Reddit. For now, enjoy the clean layout with improved readability.</p>
          </div>
        </article>
      ) : (
        <p className="text-gray-600">Post not found.</p>
      )}
    </div>
  );
};

export default PostPage;
