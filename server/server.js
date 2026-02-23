const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const connectDB = require('./config/db');
const setupIndexes = require('./config/setupIndexes');

const errorHandler = require('./middleware/errorHandler');
const setupCronJobs = require('./utils/cronJobs');
const requestLogger = require('./middleware/requestLogger');


dotenv.config();
const startServer = async () => {
  await connectDB();
  await setupIndexes();
};

startServer();
const app = express();

// Request logging (first)
app.use(requestLogger);

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🔐 Data Sanitization (AFTER body parser)
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss());           // Prevent XSS attacks
app.use(hpp());           // Prevent HTTP parameter pollution

// Rate limiting
app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later',
});
app.use('/api/', limiter);


// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========= API ROUTES =========
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Frontend is hosted separately on Vercel
app.get('/', (req, res) => {
  res.send('CaQuest API is running');
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/health\n`);
});

if (process.env.NODE_ENV === 'production') {
  setupCronJobs();
}