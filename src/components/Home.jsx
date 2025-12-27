import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import placeholder from '../assets/placeholder.webp';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import Loading from './Loading';
const Home = () => {
  const { user } = useContext(AuthContext);
  const CLOUD_URL = 'https://res.cloudinary.com/dtxh9hjpd/';
  const { posts, fetchPosts, loading, deletePost } = useContext(PostContext);

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle delete confirmation
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Add actual delete logic here
    deletePost(postToDelete.slug);
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  if (loading) return <Loading />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Welcome to Self Blog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover amazing stories, insights, and knowledge from our community
            of writers
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col group"
            >
              {/* Image */}
              <div className="h-48 sm:h-56 overflow-hidden cursor-pointer relative">
                <Link to={`/postdetail/${post.slug}`}>
                  <img
                    src={post.image ? `${CLOUD_URL}${post.image}` : placeholder}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Edit and Delete Icons - Show only if user is the author */}
                {user &&
                  user.username ===
                    (typeof post.user === 'string'
                      ? post.user
                      : post.user?.username) && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
                      {/* Edit Icon */}
                      <Link
                        to={`/edit-post/${post.slug}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                        title="Edit post"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>

                      {/* Delete Icon */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteClick(post);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                        title="Delete post"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
              </div>
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col ">
                {/* Title */}
                <Link to={`/postdetail/${post.slug}`}>
                  <h2 className="cursor-pointer text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h2>
                </Link>
                {/* Description */}
                <p className="text-gray-600 mb-4">
                  {post.description.length > 170
                    ? post.description.substring(0, 170) + '...'
                    : post.description}
                </p>

                {/* Author and Date */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {post.user?.charAt?.(0) ||
                        (typeof post.user === 'object'
                          ? post.user?.username?.charAt(0)
                          : 'U')}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {typeof post.user === 'string'
                        ? post.user
                        : post.user?.username || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {post.created_at}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Modal Content */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
              Delete Post?
            </h3>
            <p className="text-gray-600 text-center mb-2">
              Are you sure you want to delete this post?
            </p>
            {postToDelete && (
              <p className="text-sm text-gray-500 text-center mb-6 font-medium">
                "{postToDelete.title}"
              </p>
            )}
            <p className="text-sm text-red-600 text-center mb-6">
              This action cannot be undone.
            </p>

            {/* Modal Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
