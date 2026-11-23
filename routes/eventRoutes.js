
const express = require('express');
const mongoose = require('mongoose');

const Event = require('../models/Event');
const validateEvent = require('../middleware/validateEvent');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// GET: Retrieve all events (Public)
router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find();

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        next(error);
    }
});

// GET: Retrieve one event (Public)
router.get('/:id', async (req, res, next) => {
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
        next(error);
    }
});

// POST: Create an event (Authenticated users only)
router.post('/', authenticateToken, validateEvent, async (req, res, next) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
});

// PUT: Update an event (Authenticated users only)
router.put('/:id', authenticateToken, validateEvent, async (req, res, next) => {
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
        next(error);
    }
});

// DELETE: Delete an event (Authenticated users only)
router.delete('/:id', authenticateToken, async (req, res, next) => {
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
        next(error);
    }
});

module.exports = router;
