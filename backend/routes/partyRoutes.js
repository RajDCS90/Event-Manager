const express = require('express');
const router = express.Router();
const { checkTableAccess } = require('../middlewares/roleMiddleware');
const {
  getAllPartyMembers,
  createPartyMember,
  updatePartyMember,
  deletePartyMember,
  reactivatePartyMember
} = require('../controllers/partyController');
const { protect } = require('../middlewares/authMiddleware');

// Public route for creating party members (no access check)
router.post('/', createPartyMember);

// Protected routes (require party table access)
router.use(protect);
router.use(checkTableAccess('party'));

router.get('/', getAllPartyMembers);
router.put('/:id', updatePartyMember);
router.delete('/:id', deletePartyMember);
router.put('/reactivate/:id', reactivatePartyMember);

module.exports = router;