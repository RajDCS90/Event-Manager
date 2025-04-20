import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import api from '../services/api';

const SocialMediaContext = createContext();

export const SocialMediaProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Create and upload a new social media post
  const createPost = useCallback(async (postData) => {
    try {
      setLoading(true);
      setUploadProgress(0);
      setError(null);
      
      const formData = new FormData();
      
      // Handle media uploads
      if (postData.media && postData.media.length > 0) {
        postData.media.forEach(file => {
          formData.append('media', file);
        });
      }
      
      // Add other post data
      formData.append('title', postData.title);
      formData.append('description', postData.description);
      formData.append('platforms', JSON.stringify(postData.platforms));
      
      // Make API request with upload progress tracking
      const response = await api.post('/social-media/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      setSuccessMessage('Content posted successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check platform connection status
  const checkPlatformStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/social-media/platform-status');
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check platform status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error or success message
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage('');
  }, []);

  // Reset upload progress
  const resetUploadProgress = useCallback(() => {
    setUploadProgress(0);
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    loading,
    error,
    uploadProgress,
    successMessage,
    createPost,
    checkPlatformStatus,
    clearMessages,
    resetUploadProgress
  }), [
    loading,
    error,
    uploadProgress,
    successMessage,
    createPost,
    checkPlatformStatus,
    clearMessages,
    resetUploadProgress
  ]);

  return (
    <SocialMediaContext.Provider value={contextValue}>
      {children}
    </SocialMediaContext.Provider>
  );
};

export const useSocialMedia = () => {
  const context = useContext(SocialMediaContext);
  if (!context) {
    throw new Error('useSocialMedia must be used within a SocialMediaProvider');
  }
  return context;
};