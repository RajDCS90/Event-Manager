const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkTableAccess } = require('../middlewares/roleMiddleware');
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Protect all routes
router.use(protect);
router.use(checkTableAccess('event'));

router.get('/', getAllEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;