const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

dotenv.config();

const connectDB = require('./config/db');

// Route Handlers
const quoteRoutes = require('./routes/quoteRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const brandRoutes = require('./routes/brandRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.use('/api/quotes', quoteRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/reviews', testimonialRoutes); // backwards compatibility for landing page
app.use('/api/upload', uploadRoutes); // Cloudinary image uploads
app.use('/api/brands', brandRoutes); // Brand logo carousel management

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: 'MongoDB Atlas Architecture (MVC)',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Floor Shield Node+Express API is running on http://localhost:${PORT}`);
});
