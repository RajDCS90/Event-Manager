// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { sendMorningReminders,  sendCustomMessages } = require('../controllers/whatsappReminderController');

router.get('/send-morning-reminders', sendMorningReminders);

// For custom messages from the frontend
router.post('/send-custom-messages', sendCustomMessages);

module.exports = router;
