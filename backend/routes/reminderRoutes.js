// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { sendMorningReminders } = require('../controllers/whatsappReminderController');

router.get('/send-morning-reminders', sendMorningReminders);

module.exports = router;
