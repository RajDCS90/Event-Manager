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
const upload = require('../middlewares/upload');

// Protect all routes
router.get('/', getAllEvents);
router.use(protect);
router.use(checkTableAccess('event'));

router.post('/', createEvent);
router.put('/:id', upload.single('image'),updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;