import { Routes, Route, Link } from 'react-router-dom';
// animations handled via CSS or react-transition-group later
import HomePage from '@/pages/HomePage';
import PostPage from '@/pages/PostPage';
import CreatePostPage from '@/pages/CreatePostPage';

/** App shell: header + main content with client-side routes. */
const App = () => {
  return (
    <div>
      <header className="border-b bg-white">
        <div className="container-page flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-brand">LinkScape</Link>
          <nav className="text-sm text-gray-600 flex items-center gap-4">
            <Link to="/create" className="rounded bg-brand/10 px-3 py-1 hover:bg-brand/20 text-brand">Write Post</Link>
          </nav>
        </div>
      </header>
      <main className="container-page py-6">
        <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-md p-4 md:p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/create" element={<CreatePostPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
