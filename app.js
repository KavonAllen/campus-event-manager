
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Application middleware
app.use(requestLogger);
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Campus Event Manager API!',
        status: 'Server is running successfully'
    });
});

// Event routes
app.use('/api/events', eventRoutes);

// Authentication routes
app.use('/api/auth', authRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Centralized error handling
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully!');

        app.listen(PORT, () => {
            console.log(`Campus Event Manager server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });
