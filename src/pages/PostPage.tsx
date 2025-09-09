import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { renderSelfText } from '@/utils/format';
import { fetchPostDetails } from '@/store/postsSlice';

/**
 * PostPage renders an in-app reading card for the selected post id from the route.
 * It reads the post from the posts slice and, if needed, fetches details+comments.
 */
const PostPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const post = useSelector((s: RootState) => s.posts.items.find(p => p.id === id));
  const details = useSelector((s: RootState) => (id ? s.posts.details?.[id] : undefined));

  useEffect(() => {
    if (id && (!details || details.status === 'idle' || details.status === 'failed')) {
      dispatch(fetchPostDetails({ id }));
    }
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">
          <span aria-hidden>←</span>
          <span>Back to results</span>
        </Link>
      </div>

      {post ? (
        <article className="rounded-lg bg-white/95 shadow p-5 md:p-7 animate-fade-in">
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

          {/* Body/content or states */}
          <div className="mt-6 text-[1.05rem] leading-8 text-gray-800">
            {!details || details.status === 'loading' ? (
              <div className="animate-pulse h-24 rounded bg-gray-100" aria-label="Loading post details" />
            ) : details.status === 'failed' ? (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700 text-sm">Failed to load details.</div>
            ) : (
              <>
                {details.selftext ? (
                  <div className="text-gray-800">{renderSelfText(details.selftext)}</div>
                ) : (
                  <p className="text-gray-600">No text content.</p>
                )}
                {/* Comments */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-3">Top comments</h2>
                  {details.comments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments found.</p>
                  ) : (
                    <ul className="space-y-4">
                      {details.comments.map((c) => (
                        <li key={c.id} className="rounded border bg-white p-3">
                          <div className="text-sm text-gray-600 mb-1">u/{c.author} • ⬆️ {c.score}</div>
                          <div className="whitespace-pre-wrap break-words text-gray-800">{c.body}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </article>
      ) : (
        <p className="text-gray-600">Post not found.</p>
      )}
    </div>
  );
};

export default PostPage;
