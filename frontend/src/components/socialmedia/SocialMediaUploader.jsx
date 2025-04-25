import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image, Video, File, Facebook, Instagram, Twitter, Youtube, FileText } from 'lucide-react';
import { useSocialMedia } from '../../context/SocialMediaContext';

const SocialMediaUploader = () => {
  // Available social media platforms with Lucide icons
  const socialMediaPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4 mr-2" /> },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4 mr-2" /> },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-4 h-4 mr-2" /> },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4 mr-2" /> }, // Added YouTube
  ];

  // Get context functions and state
  const { createPost, loading, error, uploadProgress, successMessage, clearMessages } = useSocialMedia();

  // State management
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [tags, setTags] = useState(''); // Added for YouTube tags
  const [showTagsInput, setShowTagsInput] = useState(false); // To control tags input visibility
  const fileInputRef = useRef(null);

  // Handle file change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newMedia = [...selectedMedia, ...files];
    setSelectedMedia(newMedia);

    // Create preview URLs
    const newPreviewUrls = files.map(file => {
      let type = 'file';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.endsWith('pdf')) type = 'pdf';
      else if (file.type.includes('word') || file.type.includes('document')) type = 'doc';
      
      return {
        url: URL.createObjectURL(file),
        type,
        name: file.name
      };
    });
    
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  // Handle platform selection
  const togglePlatform = (platformId) => {
    const newSelectedPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    
    setSelectedPlatforms(newSelectedPlatforms);
    
    // Show tags input if YouTube is selected, hide otherwise
    setShowTagsInput(newSelectedPlatforms.includes('youtube'));
  };

  // Remove a selected file
  const removeFile = (index) => {
    const newMedia = [...selectedMedia];
    newMedia.splice(index, 1);
    setSelectedMedia(newMedia);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index].url);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  // Clear messages after showing
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, clearMessages]);

  // Reset form after successful upload
  useEffect(() => {
    if (successMessage) {
      setSelectedMedia([]);
      setPreviewUrls([]);
      setTitle('');
      setDescription('');
      setSelectedPlatforms([]);
      setTags('');
      setShowTagsInput(false);
    }
  }, [successMessage]);

  // Show warning if YouTube is selected but no video file is selected
  const youtubeWithoutVideo = () => {
    if (selectedPlatforms.includes('youtube')) {
      const hasVideo = selectedMedia.some(media => media.type && media.type.startsWith('video/'));
      if (!hasVideo) {
        return true;
      }
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMedia.length === 0 || selectedPlatforms.length === 0) return;
  
    try {
      const postData = {
        title,
        description,
        media: selectedMedia,
        platforms: selectedPlatforms
      };
      
      // Add tags for YouTube if provided
      if (tags && selectedPlatforms.includes('youtube')) {
        // Split tags by comma and trim whitespace
        const tagArray = tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
          
        postData.tags = tagArray;
      }
      
      await createPost(postData);
    } catch (err) {
      // Error is handled in context
      console.error('Upload failed:', err);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'file':
      default:
        return <File className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl text-center font-bold mb-6 text-black-500">Social Media Content Uploader</h2>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Media Upload Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Upload Media</h3>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
            onClick={triggerFileInput}
          >
            <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400 mt-1">Supports images, videos, PDFs, Word documents and more</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </div>
          
          {/* YouTube Warning */}
          {selectedPlatforms.includes('youtube') && (
            <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
              <p>Note: YouTube only supports video uploads. Please select a video file to post to YouTube.</p>
            </div>
          )}
          
          {/* Preview Section */}
          {previewUrls.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2 text-gray-700">Selected Media:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {previewUrls.map((item, index) => (
                  <div key={index} className="relative border rounded-md p-2 bg-gray-50">
                    {item.type === 'image' && (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    {item.type === 'video' && (
                      <video 
                        src={item.url} 
                        className="w-full h-32 object-cover rounded"
                        controls
                      />
                    )}
                    {['file', 'pdf', 'doc'].includes(item.type) && (
                      <div className="flex flex-col items-center justify-center h-32">
                        {getFileIcon(item.type)}
                        <p className="text-xs text-gray-500 mt-2 truncate w-full text-center">{item.name}</p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Title</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title for your post..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300"
          />
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for your post..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            rows={4}
          />
        </div>

        {/* YouTube Tags Section - Only show when YouTube is selected */}
        {showTagsInput && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">YouTube Tags</h3>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags for your YouTube video (comma separated)..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Example: social media, marketing, tutorial</p>
          </div>
        )}

        {/* Platform Selection Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Select Platforms</h3>
          <div className="flex flex-wrap gap-3">
            {socialMediaPlatforms.map(platform => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center px-4 py-2 rounded-full border ${selectedPlatforms.includes(platform.id) ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
              >
                {platform.icon}
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar (shows when uploading) */}
        {loading && uploadProgress > 0 && (
          <div className="mb-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Uploading
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div 
                  style={{ width: `${uploadProgress}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-out"
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center animate-pulse">
                {uploadProgress < 100 ? 'Uploading your content...' : 'Processing your post...'}
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={selectedMedia.length === 0 || selectedPlatforms.length === 0 || loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${selectedMedia.length === 0 || selectedPlatforms.length === 0 || loading ? 'bg-orange-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : `Post to ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
};

export default SocialMediaUploader;