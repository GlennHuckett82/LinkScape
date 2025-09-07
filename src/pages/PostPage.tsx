import { useParams, Link } from 'react-router-dom';

const PostPage = () => {
  const { id } = useParams();
  return (
    <div className="space-y-4">
      <Link to="/" className="text-brand">← Back</Link>
      <h1 className="text-2xl font-semibold">Post Details</h1>
      <p>Post ID: {id}</p>
      <p>Details will be loaded here.</p>
    </div>
  );
};

export default PostPage;
