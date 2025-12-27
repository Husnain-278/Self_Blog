import { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import placeholder from '../assets/placeholder.webp';
import { PostContext } from '../context/PostContext';
import Loading from './Loading';
const PostDetail = () => {
  const { slug } = useParams();
  const { fetchPostById, loading, currentPost } = useContext(PostContext);
  useEffect(() => {
    fetchPostById(slug);
  }, []);

  if (loading) return <Loading />;
  if (!currentPost) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Content Card */}
        <article className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Featured Image */}

          {currentPost.image != null && (
            <div className="w-full h-64 sm:h-96 overflow-hidden">
              <img
                src={currentPost.image}
                alt={currentPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {currentPost.image == null && (
            <div className="w-full h-64 sm:h-96 overflow-hidden">
              <img
                src={placeholder}
                alt={currentPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-10">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                {currentPost.category.title}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {currentPost.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-6 mb-6 border-b border-gray-200">
              {/* Author */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {currentPost.user?.charAt?.(0) ||
                    (typeof currentPost.user === 'object'
                      ? currentPost.user?.username?.charAt(0)
                      : 'U')}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Author</p>
                  <p className="font-semibold text-gray-900">
                    {typeof currentPost.user === 'string'
                      ? currentPost.user
                      : currentPost.user?.username || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="font-medium text-gray-900">
                    {currentPost.created_at}
                  </p>
                </div>
              </div>

              {/* Views */}
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="font-medium text-gray-900">
                    {currentPost.views?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Description/Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {currentPost.description}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
