const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load env vars
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const partyRoutes = require('./routes/partyRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/party-members', partyRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Role-Based Dashboard API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});