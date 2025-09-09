import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postsActions } from '@/store/postsSlice';

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
    // Navigate back home to see the new post on top
    navigate('/', { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Write a post</h1>
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
