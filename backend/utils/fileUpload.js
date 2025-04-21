// utils/fileUpload.js
const fs = require('fs');
const path = require('path');

// Get the absolute path to the uploads directory
const uploadDir = path.resolve(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log('Upload directory path:', uploadDir); // Debug log
module.exports = uploadDir;