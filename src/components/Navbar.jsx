import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  // Get user profile picture or use placeholder
  const userProfilePic =
    user?.profile?.profile_picture ||
    'https://ui-avatars.com/api/?name=' +
      (user?.username || 'User') +
      '&background=6366f1&color=fff&size=128';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              {/* Logo Icon */}
              <div className="bg-white p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-white text-xl sm:text-2xl font-extrabold tracking-tight group-hover:text-gray-100 transition duration-300">
                  Self Blog
                </span>
                <span className="text-blue-100 text-[10px] sm:text-xs font-medium -mt-1 hidden sm:block">
                  Share Your Story
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-white/10"
            >
              Home
            </Link>

            {isAuthenticated && (
              <Link
                to="/create-post"
                className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-300 shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create Post</span>
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={userProfilePic}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-white font-semibold text-sm group-hover:text-gray-100">
                    {user?.username}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-300 shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button and User Icon */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <Link to="/profile" className="relative">
                <img
                  src={userProfilePic}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 p-2 rounded-md"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-blue-700 to-purple-700">
          <Link
            to="/"
            className="text-white hover:text-gray-200 hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {isAuthenticated && (
            <Link
              to="/create-post"
              className="flex items-center justify-center space-x-2 bg-white text-blue-600 hover:bg-gray-100 px-4 py-3 mx-2 rounded-md text-base font-medium transition duration-300 shadow-md"
              onClick={() => setIsOpen(false)}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create Post</span>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-3 mx-2 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative">
                  <img
                    src={userProfilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-white font-semibold">
                  {user?.username}
                </span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium transition duration-300 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-gray-200 hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-gray-200 hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
