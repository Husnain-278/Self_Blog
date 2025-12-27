import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { PostContext } from '../context/PostContext';

const CreatePostPage = () => {
  const { createPost } = useContext(PostContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async (formData) => {
    setError('');
    setIsSubmitting(true);

    try {
      const result = await createPost(formData);

      if (result.success) {
        // Redirect to home page or post detail page
        navigate('/');
      } else {
        // Handle error
        setError(result.error || 'Failed to create post');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="max-w-3xl mx-auto mt-4 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}
      <PostForm onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreatePostPage;
