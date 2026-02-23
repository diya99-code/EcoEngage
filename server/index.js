const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
const blogRoutes = require('./routes/blog');
const tokenRoutes = require('./routes/tokens');
const agentRoutes = require('./routes/agent');
const authRoutes = require('./routes/auth');

app.use('/api/blog', blogRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('EcoEngage API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
