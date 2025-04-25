const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const mandalController = require('../controllers/mandalController')
// router.use(protect);

router.post('/', mandalController.createMandal);
router.get('/', mandalController.getAllMandals);
router.get('/:id', mandalController.getMandalById);
router.put('/:id', mandalController.updateMandal);
router.delete('/:id', mandalController.deleteMandal);

module.exports = router;