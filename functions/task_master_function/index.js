const express = require('express');
const catalystSDK = require('zcatalyst-sdk-node');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load environment variables based on environment
const environment = process.env.CATALYST_ENVIRONMENT || 'development';
let envPath;

if (environment === 'development') {
    envPath = path.resolve(__dirname, '.env.development');
} else if (environment === 'production') {
    envPath = path.resolve(__dirname, '.env.production');
} else {
    envPath = path.resolve(__dirname, '.env');
}

// Load environment variables
dotenv.config({ path: envPath });

const app = express();

app.use(express.json());

// Initialize Catalyst middleware
app.use((req, res, next) => {
    const catalyst = catalystSDK.initialize(req);
    res.locals.catalyst = catalyst;
    next();
});

// Environment check middleware (optional - for debugging)
app.use((req, res, next) => {
    console.log('Environment:', environment);
    console.log('JWT Secret exists:', !!process.env.CATALYST_SECRET);
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use(errorHandler);

module.exports = app;