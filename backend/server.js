// server.js
require('dotenv').config(); // loads .env locally
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.send('Backend running');
});

// API routes
app.use('/api', require('./routes/auth')); // adjust route if needed

// MongoDB connection
const mongoURI = process.env.MONGO_URI; // must match Render env variable
const port = process.env.PORT || 5000;

// Safety check
if (!mongoURI) {
  console.error('Error: MONGO_URI is not defined!');
  process.exit(1); // stop server if URI missing
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
