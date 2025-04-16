const express = require('express');
const router = express.Router();
const { checkTableAccess } = require('../middlewares/roleMiddleware');
const {
  getAllPartyMembers,
  createPartyMember,
  updatePartyMember,
  deletePartyMember
} = require('../controllers/partyController');

// Public route for creating party members (no access check)
router.post('/', createPartyMember);

// Protected routes (require party table access)
router.use(checkTableAccess('party'));

router.get('/party-members', getAllPartyMembers);
router.put('/:id', updatePartyMember);
router.delete('/:id', deletePartyMember);

module.exports = router;