import React from 'react';
import { Link } from 'react-router-dom';
import { PostItem } from '../store/postsSlice';

interface Props { post: PostItem }

const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="block rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium truncate">{post.title}</h3>
      <div className="mt-2 text-sm text-gray-600">{post.subreddit} • u/{post.author}</div>
      <div className="mt-2 text-xs text-gray-500">⬆️ {post.score} • 💬 {post.num_comments}</div>
    </Link>
  );
};

export default PostCard;
