
const validateEvent = (req, res, next) => {
    const { title, description, location, date, organizer } = req.body;

    const missingFields = [];

    if (!title || !title.trim()) missingFields.push('title');
    if (!description || !description.trim()) missingFields.push('description');
    if (!location || !location.trim()) missingFields.push('location');
    if (!date) missingFields.push('date');
    if (!organizer || !organizer.trim()) missingFields.push('organizer');

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required event fields.',
            missingFields
        });
    }

    if (isNaN(Date.parse(date))) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid event date.'
        });
    }

    next();
};

module.exports = validateEvent;
