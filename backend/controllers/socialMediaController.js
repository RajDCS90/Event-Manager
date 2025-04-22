const SocialMediaPost = require('../models/SocialMediaPost');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const { IgApiClient } = require('instagram-private-api');
const { FB } = require('fb');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter only images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedVideoTypes = /mp4|mov|avi|wmv|flv|mkv/;
  
  // Check file type
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ? 
    'image' : allowedVideoTypes.test(path.extname(file.originalname).toLowerCase()) ? 'video' : '';
  
  if (extname) {
    req.fileType = extname; // Save file type for later use
    return cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: fileFilter
});

// Post to Facebook
async function postToFacebook(post) {
  try {
    FB.setAccessToken(process.env.FACEBOOK_ACCESS_TOKEN);
    const pageId = process.env.FACEBOOK_PAGE_ID;
    
    let result;
    if (post.mediaType === 'image') {
      result = await FB.api(`/${pageId}/photos`, 'POST', {
        url: post.mediaUrl,
        caption: `${post.title}\n\n${post.description}`
      });
    } else {
      result = await FB.api(`/${pageId}/videos`, 'POST', {
        source: fs.createReadStream(post.mediaUrl.replace('http://localhost:5000/', '')),
        description: `${post.title}\n\n${post.description}`
      });
    }
    
    return { success: true, postId: result.id || result.post_id };
  } catch (error) {
    console.error('Facebook posting error:', error);
    return { success: false, error: error.message };
  }
}

// Post to Twitter (X)
async function postToTwitter(post) {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    
    let result;
    const text = `${post.title}\n\n${post.description}`;
    
    if (post.mediaType === 'image') {
      // For image
      const mediaId = await client.v1.uploadMedia(post.mediaUrl.replace('http://localhost:5000/', ''));
      result = await client.v2.tweet({
        text,
        media: { media_ids: [mediaId] }
      });
    } else {
      // For video
      const mediaId = await client.v1.uploadMedia(post.mediaUrl.replace('http://localhost:5000/', ''));
      result = await client.v2.tweet({
        text,
        media: { media_ids: [mediaId] }
      });
    }
    
    return { success: true, postId: result.data.id };
  } catch (error) {
    console.error('Twitter posting error:', error);
    return { success: false, error: error.message };
  }
}

// Post to Instagram
async function postToInstagram(post) {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);
    
    await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
    
    let result;
    if (post.mediaType === 'image') {
      result = await ig.publish.photo({
        file: fs.readFileSync(post.mediaUrl.replace('http://localhost:5000/', '')),
        caption: `${post.title}\n\n${post.description}`
      });
    } else {
      result = await ig.publish.video({
        video: fs.readFileSync(post.mediaUrl.replace('http://localhost:5000/', '')),
        coverImage: fs.readFileSync('uploads/thumbnail.jpg'), // You need a thumbnail for videos
        caption: `${post.title}\n\n${post.description}`
      });
    }
    
    return { success: true, postId: result.media.id };
  } catch (error) {
    console.error('Instagram posting error:', error);
    return { success: false, error: error.message };
  }
}

// Create and post to social media
exports.createAndPostContent = async (req, res) => {
  try {
    upload.single('media')(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a media file' });
      }

      const { title, description, platforms } = req.body;
      
      if (!title || !description || !platforms) {
        return res.status(400).json({ success: false, message: 'Please provide title, description, and platforms' });
      }

      const parsedPlatforms = JSON.parse(platforms);
      if (!Array.isArray(parsedPlatforms) || parsedPlatforms.length === 0) {
        return res.status(400).json({ success: false, message: 'Please select at least one social media platform' });
      }

      // Save media URL
      const mediaUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
      
      // Create social media post entry
      const post = new SocialMediaPost({
        title,
        description,
        mediaType: req.fileType,
        mediaUrl,
        platforms: parsedPlatforms,
        createdBy: req.user._id
      });

      await post.save();

      // Process each platform
      for (const platform of post.platforms) {
        let result;
        
        switch (platform) {
          case 'facebook':
            result = await postToFacebook(post);
            break;
          case 'twitter':
            result = await postToTwitter(post);
            break;
          case 'instagram':
            result = await postToInstagram(post);
            break;
        }

        // Update post status
        post.postStatus[platform] = {
          posted: result.success,
          postId: result.success ? result.postId : undefined,
          errorMessage: result.success ? undefined : result.error
        };
      }

      await post.save();
      
      res.status(201).json({ 
        success: true, 
        message: 'Media uploaded and posted to social media platforms',
        post
      });
    });
  } catch (error) {
    console.error('Error in createAndPostContent:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while uploading media and posting',
      error: error.message
    });
  }
};

// Get recent posts (for confirmation only)
exports.getRecentPosts = async (req, res) => {
  try {
    const posts = await SocialMediaPost.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title description mediaType platforms postStatus createdAt');
    
    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Error getting recent posts:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving posts',
      error: error.message
    });
  }
};

