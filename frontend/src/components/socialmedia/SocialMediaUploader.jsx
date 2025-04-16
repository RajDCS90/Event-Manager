import { useState, useRef } from 'react';
import { Upload, X, Image, Video, File, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const SocialMediaUploader = () => {
  // Available social media platforms with Lucide icons
  const socialMediaPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4 mr-2" /> },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4 mr-2" /> },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-4 h-4 mr-2" /> },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-4 h-4 mr-2" /> },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4 mr-2" /> },
    { id: 'tiktok', name: 'TikTok', icon: <span className="mr-2">🎵</span> }, // No Lucide icon for TikTok
  ];

  // State management
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [description, setDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newMedia = [...selectedMedia, ...files];
    setSelectedMedia(newMedia);

    // Create preview URLs
    const newPreviewUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'file',
      name: file.name
    }));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  // Handle platform selection
  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMedia.length === 0 || selectedPlatforms.length === 0) return;

    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log({
        media: selectedMedia,
        description,
        platforms: selectedPlatforms
      });
      setIsUploading(false);
      alert('Content submitted successfully!');
      // Reset form
      setSelectedMedia([]);
      setPreviewUrls([]);
      setDescription('');
      setSelectedPlatforms([]);
    }, 1500);
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Social Media Content Uploader</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Media Upload Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Upload Media</h3>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={triggerFileInput}
          >
            <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400 mt-1">Supports images, videos, and other files</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*, video/*, .pdf, .doc, .docx"
            />
          </div>
          
          {/* Preview Section */}
          {previewUrls.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2 text-gray-700">Selected Media:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {previewUrls.map((item, index) => (
                  <div key={index} className="relative border rounded-md p-2">
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
                    {item.type === 'file' && (
                      <div className="flex flex-col items-center justify-center h-32">
                        <File className="w-8 h-8 text-gray-400" />
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

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for your post..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={selectedMedia.length === 0 || selectedPlatforms.length === 0 || isUploading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${selectedMedia.length === 0 || selectedPlatforms.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : `Post to ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
};

export default SocialMediaUploader;