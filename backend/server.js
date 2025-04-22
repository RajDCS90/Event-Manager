const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');

// Load env vars
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const socialMedia = require('./routes/socialMediaRoutes');
const partyRoutes = require('./routes/partyRoutes');
const uploadDir = require('./utils/fileUpload');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from uploads directory
// app.use('/uploads', express.static(uploadDir));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Static files served from:', uploadDir);

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/social-media', socialMedia);
app.use('/api/party-members', partyRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Role-Based Dashboard API');
});

const PORT = process.env.PORT || 5000;

const cron = require('node-cron');
const { sendMorningReminders } = require('./controllers/whatsappReminderController');

cron.schedule('0 8 * * *', () => {
  sendMorningReminders();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
});