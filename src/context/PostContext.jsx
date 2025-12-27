import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { AuthContext } from './AuthContext';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = 'http://127.0.0.1:8000/api/v1';

  const fetchPosts = async () => {
    if (!accessToken) return { success: false, error: 'Authentication failed' };
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/post-list/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPosts(response.data.results);
      return { success: true, data: response.data.results };
    } catch (error) {
      setError(error.response?.data?.detail || 'failed to fetch posts');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchPostById = async (slug) => {
    if (!accessToken) return { success: false, error: 'Authentication failed' };
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/post-detail/${slug}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrentPost(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.detail || 'failed to fetch post');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/categories/`);
      setCategories(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.detail || 'failed to fetch categories');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    if (!accessToken) return { success: false, error: 'Authentication failed' };
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/post-create/`, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setPosts([response.data, ...posts]);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create post');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (slug, postData) => {
    if (!accessToken) return { success: false, error: 'Authentication failed' };
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_URL}/post-update/${slug}/`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // Update the post in state
      setPosts(
        posts.map((post) => (post.slug === slug ? response.data : post))
      );
      setCurrentPost(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update post');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (slug) => {
    if (!accessToken) return { success: false, error: 'Authentication failed' };
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${API_URL}/post-delete/${slug}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 204) {
        // Remove the deleted post from state
        setPosts(posts.filter((post) => post.slug !== slug));
        return { success: true, message: 'Post deleted successfully' };
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to delete post');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    loading,
    posts,
    currentPost,
    categories,
    error,
    fetchPosts,
    fetchPostById,
    fetchCategories,
    createPost,
    updatePost,
    deletePost,
  };
  return (
    <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>
  );
};
