
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST: Register a new user
router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (
            typeof username !== 'string' || !username.trim() ||
            typeof email !== 'string' || !email.trim() ||
            typeof password !== 'string' || password.length < 8
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a username, valid email, and password with at least 8 characters.'
            });
        }

        // Check whether the email or username is already registered
        const existingUser = await User.findOne({
            $or: [
                { email: email.trim().toLowerCase() },
                { username: username.trim() }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username or email is already registered.'
            });
        }

        // Create the user (password is hashed by the User model)
        const user = await User.create({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
});

// POST: Log in an existing user
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' || !email.trim() ||
            typeof password !== 'string' || !password
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your email and password.'
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Authentication service is not configured.'
            });
        }

        // Create a signed authentication token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
