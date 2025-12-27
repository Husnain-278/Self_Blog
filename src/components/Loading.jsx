const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative inline-flex">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading</h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>

        {/* Optional message */}
        <p className="mt-4 text-gray-600 text-sm">
          Please wait while we load your content...
        </p>
      </div>
    </div>
  );
};

export default Loading;
