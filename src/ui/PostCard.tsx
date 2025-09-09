import React from 'react';
import { Link } from 'react-router-dom';
import { PostItem } from '../store/postsSlice';

interface Props { post: PostItem }

/**
 * PostCard shows a single post summary (title, meta) and links to the in-app reader.
 */
const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <Link
      to={`/post/${post.id}`}
      className="block rounded-lg border bg-white p-5 hover:shadow-md transition-shadow animate-fade-in"
      onClick={() => {
        // Preserve Home scroll position so returning restores the list position
        try { sessionStorage.setItem('homeScrollY', String(window.scrollY)); } catch {}
      }}
    >
      <h3 className="font-medium text-base sm:text-lg leading-snug whitespace-normal break-words">{post.title}</h3>
      <div className="mt-2 text-sm text-gray-600">{post.subreddit} • u/{post.author}</div>
      <div className="mt-2 text-xs text-gray-500">⬆️ {post.score} • 💬 {post.num_comments}</div>
    </Link>
  );
};

export default PostCard;
