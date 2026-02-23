const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const esClient = require('../config/elasticsearch');

const JWT_SECRET = process.env.JWT_SECRET || 'ecoengage_secure_key_123';

// Register
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if user exists
        const searchResult = await esClient.search({
            index: 'users',
            query: { term: { "username.keyword": username } }
        });

        if (searchResult.hits.total.value > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = 'user_' + Math.random().toString(36).substring(2, 9);

        await esClient.index({
            index: 'users',
            id: userId,
            refresh: true,
            document: {
                userId,
                username,
                email,
                password: hashedPassword,
                tokens: 100, // Welcome bonus
                impactScore: 0,
                activities: [{ reason: 'Account Created', amount: 100, date: new Date() }],
                vouchers: []
            }
        });

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const searchResult = await esClient.search({
            index: 'users',
            query: { term: { "username.keyword": username } }
        });

        if (searchResult.hits.total.value === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = searchResult.hits.hits[0]._source;
        const dbUserId = searchResult.hits.hits[0]._id;
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: dbUserId, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                userId: dbUserId,
                username: user.username,
                tokens: user.tokens
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
