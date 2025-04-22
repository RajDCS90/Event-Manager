const Event = require('../models/Events');
const Grievance = require('../models/Grievance');
const PartyAndYouth = require('../models/PartyAndYouth');
// Import the Twilio client
const twilio = require('twilio');

// Initialize Twilio client with your credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: 'whatsapp:+1XXXXXXXXXX'
const client = new twilio(accountSid, authToken);

// WhatsApp message sending function with Twilio
const sendWhatsAppMessage = async (phone, message) => {
  try {
    // Format the recipient's number for WhatsApp
    // Make sure the phone number is in proper format with country code
    const formattedPhone = `whatsapp:${phone.startsWith('+') ? phone : '+' + phone}`;
    
    // Send message using Twilio's WhatsApp API
    const result = await client.messages.create({
      body: message,
      from: twilioWhatsAppNumber,
      to: formattedPhone
    });
    
    console.log(`WhatsApp message sent successfully to ${phone}, SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error(`Failed to send WhatsApp message to ${phone}:`, error);
    throw error; // Re-throw to handle in the calling function
  }
};

const sendMorningReminders = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get today's events
    const events = await Event.find({
      eventDate: { $gte: todayStart, $lte: todayEnd }
    });

    // Get today's grievances
    const grievances = await Grievance.find({
      programDate: { $gte: todayStart, $lte: todayEnd }
    });

    // Group by mandal
    const mandalEventsMap = {};
    events.forEach(event => {
      if (!mandalEventsMap[event.mandal]) mandalEventsMap[event.mandal] = { events: [], grievances: [] };
      mandalEventsMap[event.mandal].events.push(event);
    });

    grievances.forEach(grievance => {
      if (!mandalEventsMap[grievance.mandal]) mandalEventsMap[grievance.mandal] = { events: [], grievances: [] };
      mandalEventsMap[grievance.mandal].grievances.push(grievance);
    });

    // Track success and failures
    const results = {
      success: [],
      failures: []
    };

    // Iterate mandal-wise and notify relevant Party & Youth users
    for (const mandal in mandalEventsMap) {
      const users = await PartyAndYouth.find({ mandal });

      for (const user of users) {
        let message = `🔔 Good Morning ${user.name}!\n\n📍 *Today's Schedule for ${mandal}*:\n`;

        if (mandalEventsMap[mandal].events.length > 0) {
          message += `\n🗓️ *Events:*\n`;
          mandalEventsMap[mandal].events.forEach((e, idx) => {
            message += `${idx + 1}. ${e.eventName} (${e.eventType}) at ${e.venue} from ${e.startTime} to ${e.endTime}\n`;
          });
        }

        if (mandalEventsMap[mandal].grievances.length > 0) {
          message += `\n🛠️ *Grievances:*\n`;
          mandalEventsMap[mandal].grievances.forEach((g, idx) => {
            message += `${idx + 1}. ${g.grievanceName} (${g.type}) by ${g.applicant}, ${g.startTime}-${g.endTime}\n`;
          });
        }

        try {
          await sendWhatsAppMessage(user.whatsappNo, message);
          results.success.push(user.whatsappNo);
        } catch (error) {
          results.failures.push({
            phone: user.whatsappNo,
            error: error.message
          });
        }
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Morning WhatsApp reminders sent', 
      stats: {
        total: results.success.length + results.failures.length,
        sent: results.success.length,
        failed: results.failures.length
      },
      failures: results.failures
    });
  } catch (error) {
    console.error('Error sending WhatsApp reminders:', error);
    res.status(500).json({ success: false, message: 'Error sending reminders', error: error.message });
  }
};

// Add this new function to your existing controller
const sendCustomMessages = async (req, res) => {
  try {
    const { phoneNumbers, message } = req.body;
    
    if (!phoneNumbers || !phoneNumbers.length) {
      return res.status(400).json({ success: false, message: 'No phone numbers provided' });
    }
    
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const results = {
      success: [],
      failures: []
    };

    // Send to each number
    for (const phone of phoneNumbers) {
      try {
        await sendWhatsAppMessage(phone, message);
        results.success.push(phone);
      } catch (error) {
        results.failures.push({
          phone,
          error: error.message
        });
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'WhatsApp messages sent', 
      stats: {
        total: phoneNumbers.length,
        sent: results.success.length,
        failed: results.failures.length
      },
      failures: results.failures
    });
  } catch (error) {
    console.error('Error sending custom WhatsApp messages:', error);
    res.status(500).json({ success: false, message: 'Error sending messages', error: error.message });
  }
};

// Update your exports to include the new function
module.exports = { sendMorningReminders, sendWhatsAppMessage, sendCustomMessages };