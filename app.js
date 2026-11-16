
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('./models/Event');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Campus Event Manager API!',
        status: 'Server is running successfully'
    });
});

// GET: Retrieve all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve events',
            error: error.message
        });
    }
});

// GET: Retrieve one event
app.get('/api/events/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve event',
            error: error.message
        });
    }
});

// POST: Create an event
app.post('/api/events', async (req, res) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event information',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error.message
        });
    }
});

// PUT: Update an event
app.put('/api/events/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event information',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update event',
            error: error.message
        });
    }
});

// DELETE: Delete an event
app.delete('/api/events/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: error.message
        });
    }
});

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
