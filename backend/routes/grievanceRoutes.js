const express = require('express');
const router = express.Router();
const { checkTableAccess } = require('../middlewares/roleMiddleware');
const {
  getAllGrievances,
  createGrievance,
  updateGrievance,
  deleteGrievance
} = require('../controllers/grievanceController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.get('/', getAllGrievances);
// Protect all routes
router.use(protect);

// Apply table access middleware to all routes
router.use(checkTableAccess('grievance'));

router.post('/', createGrievance);
router.put('/:id',upload.single('image'),  updateGrievance);
router.delete('/:id',deleteGrievance);

module.exports = router;