require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Security: Set various HTTP headers
// Configure helmet to allow serving static files (profile pictures)
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Serve static files (profile pictures)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS: Must be BEFORE rate limiting to handle preflight OPTIONS requests
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security: Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: {
            message: 'Too many requests, please try again later',
            code: 'RATE_LIMIT_EXCEEDED',
            statusCode: 429
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Stricter rate limit for auth routes (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login attempts per windowMs
    message: {
        success: false,
        error: {
            message: 'Too many login attempts, please try again after 15 minutes',
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            statusCode: 429
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Security: Sanitize data against NoSQL injection
// Note: express-mongo-sanitize has issues with Express 5's getter-only req.query
// Using a custom middleware instead
app.use((req, res, next) => {
    // Sanitize req.body only (req.query is getter-only in Express 5)
    if (req.body) {
        const sanitize = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    // Remove $ from string values to prevent NoSQL injection
                    // Note: We don't remove dots from values as they're valid in emails, etc.
                    obj[key] = obj[key].replace(/\$/g, '');
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitize(obj[key]);
                }
                // Remove keys starting with $ or containing . (MongoDB operators)
                if (key.startsWith('$') || key.includes('.')) {
                    delete obj[key];
                }
            }
        };
        sanitize(req.body);
    }
    next();
});

// Request logger (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
        });
        next();
    });
}

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/profile', require('./routes/profile'));
app.use('/api/v1/transactions', require('./routes/transactions'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/accounts', require('./routes/accounts'));
app.use('/api/v1/budgets', require('./routes/budgets'));
app.use('/api/v1/goals', require('./routes/goals'));
app.use('/api/v1/insights', require('./routes/insights'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: 'Route not found',
            code: 'NOT_FOUND',
            statusCode: 404
        }
    });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
