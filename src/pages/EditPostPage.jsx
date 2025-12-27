import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import { PostContext } from '../context/PostContext';

const EditPostPage = () => {
  const { slug } = useParams();
  const { updatePost, fetchPostById, currentPost } = useContext(PostContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the post data when component mounts
  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      const result = await fetchPostById(slug);
      if (!result.success) {
        setError(result.error || 'Failed to load post');
      }
      setIsLoading(false);
    };
    loadPost();
  }, [slug]);

  const handleUpdatePost = async (formData) => {
    setError('');
    setIsSubmitting(true);

    try {
      const result = await updatePost(slug, formData);

      if (result.success) {
        // Redirect to post detail page or home
        navigate(`/postdetail/${slug}`);
      } else {
        // Handle error
        setError(result.error || 'Failed to update post');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-red-600">Post not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="max-w-3xl mx-auto mt-4 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}
      <PostForm
        onSubmit={handleUpdatePost}
        isSubmitting={isSubmitting}
        initialData={currentPost}
        editMode={true}
      />
    </div>
  );
};

export default EditPostPage;
