import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// ESM dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to Mongoose database (for app data)
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Custom sanitize middleware (express-mongo-sanitize incompatible with Express 5)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };
  if (req.body) sanitize(req.body);
  next();
});

// Rate limiting on custom auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.match(/^http:\/\/localhost:\d+$/)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'production') {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

// ─── Better Auth handler (MUST be BEFORE express.json()) ───
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON parsing (after Better Auth handler)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'DataWill API is running',
    betterAuth: true,
    timestamp: new Date().toISOString()
  });
});

// ─── API Routes (app data — using JWT from existing auth or Better Auth sessions) ───
const { default: assetRoutes } = await import('./routes/assetRoutes.js');
const { default: ruleRoutes } = await import('./routes/ruleRoutes.js');
const { default: contactRoutes } = await import('./routes/contactRoutes.js');
const { default: checkInRoutes } = await import('./routes/checkInRoutes.js');
const { default: deathVerificationRoutes } = await import('./routes/deathVerificationRoutes.js');
const { default: executionRoutes } = await import('./routes/executionRoutes.js');
const { default: auditLogRoutes } = await import('./routes/auditLogRoutes.js');
const { default: notificationRoutes } = await import('./routes/notificationRoutes.js');
const { default: messageRoutes } = await import('./routes/messageRoutes.js');
const { default: willVersionRoutes } = await import('./routes/willVersionRoutes.js');
const { default: beneficiaryRoutes } = await import('./routes/beneficiaryRoutes.js');
const { default: willPdfRoutes } = await import('./routes/willPdfRoutes.js');
// Legacy auth routes (JWT-based — kept for backward compat)
const { default: authRoutes } = await import('./routes/authRoutes.js');

app.use('/api/legacy-auth', authLimiter, authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/checkin', checkInRoutes);
app.use('/api/death-report', deathVerificationRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/audit-log', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/will-versions', willVersionRoutes);
app.use('/api/beneficiary', beneficiaryRoutes);
app.use('/api/will-pdf', willPdfRoutes);

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
  });
}

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DataWill server running on port ${PORT}`);
  console.log(`Better Auth: ${process.env.BETTER_AUTH_URL || 'http://localhost:5000'}/api/auth`);
});

export default app;
