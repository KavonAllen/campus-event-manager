
const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Main test route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Campus Event Manager API!',
        status: 'Server is running successfully'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Campus Event Manager server running at http://localhost:${PORT}`);
});
