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

// Protect all routes
router.use(protect);

// Apply table access middleware to all routes
router.use(checkTableAccess('grievance'));

router.get('/', getAllGrievances);
router.post('/', createGrievance);
router.put('/:id', updateGrievance);
router.delete('/:id', deleteGrievance);

module.exports = router;