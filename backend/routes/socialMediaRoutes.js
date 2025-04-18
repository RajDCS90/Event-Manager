const express = require('express');
const router = express.Router();
const socialMediaController = require('../controllers/socialMediaController');
const { checkAdmin, protect } = require('../middlewares/authMiddleware');


router.use(protect);
// Only essential routes
router.post('/upload', checkAdmin, socialMediaController.createAndPostContent);
router.get('/recent', checkAdmin, socialMediaController.getRecentPosts);

module.exports = router;