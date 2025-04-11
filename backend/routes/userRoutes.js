const express = require('express');
const router = express.Router();
const { protect, checkAdmin } = require('../middlewares/authMiddleware');
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Public routes
router.post('/login', loginUser);

// Protected routes
router.use(protect);

router.get('/me', getMe);

// Admin-only routes
router.use(checkAdmin);
router.post('/', registerUser);

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;