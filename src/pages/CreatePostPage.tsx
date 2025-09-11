import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postsActions } from '@/store/postsSlice';
import { resetHome } from '@/store/uiSlice';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [subreddit, setSubreddit] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const action: any = (postsActions as any).addLocalPost({ title: t, selftext: body, subreddit });
    dispatch(action);
  // Navigate back home to see the new post on top, keep interacted state since they just posted
  navigate('/', { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Write a post</h1>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-brand/30 bg-white px-3 py-1.5 text-sm text-brand hover:bg-brand/5 focus:outline-none focus:ring-2 focus:ring-brand/40"
          onClick={() => {
            // Reset home so returning shows only controls/background
            dispatch(resetHome());
            navigate('/', { replace: true });
          }}
        >
          <span aria-hidden>←</span>
          <span>Back to homepage</span>
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input className="w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Body</label>
          <textarea className="w-full rounded border px-3 py-2 min-h-[120px]" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Subreddit (optional)</label>
          <input className="w-full rounded border px-3 py-2" value={subreddit} onChange={(e) => setSubreddit(e.target.value)} placeholder="r/reactjs" />
        </div>
        <div className="pt-2">
          <button type="submit" className="rounded bg-brand px-4 py-2 text-white hover:brightness-95">Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
