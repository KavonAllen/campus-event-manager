
const mongoose = require('mongoose');

// Define the structure of a campus event
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    organizer: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Create and export the Event model
module.exports = mongoose.model('Event', eventSchema);
