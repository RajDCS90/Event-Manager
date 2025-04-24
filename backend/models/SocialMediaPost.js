const mongoose = require('mongoose');

const SocialMediaPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  platforms: [{
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'youtube'], // Added YouTube to allowed platforms
    required: true
  }],
  tags: {
    type: [String], // Added tags array for YouTube videos
    default: []
  },
  postStatus: {
    facebook: {
      posted: { type: Boolean, default: false },
      postId: String,
      errorMessage: String
    },
    twitter: {
      posted: { type: Boolean, default: false },
      postId: String,
      errorMessage: String
    },
    instagram: {
      posted: { type: Boolean, default: false },
      postId: String,
      errorMessage: String
    },
    youtube: { // Added YouTube status
      posted: { type: Boolean, default: false },
      postId: String,
      videoUrl: String, // YouTube video URL
      errorMessage: String
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SocialMediaPost', SocialMediaPostSchema);