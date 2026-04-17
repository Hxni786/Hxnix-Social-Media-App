require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const { testConnection }  = require('./config/db');
const { createTableAndSeed: initPosts } = require('./models/Post');
const { createTableAndSeed: initUsers } = require('./models/User');
const postRoutes          = require('./routes/postRoutes');
const authRoutes          = require('./routes/authRoutes');
const errorHandler        = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 19001;

// ── Middleware ─────────────────────────────────────────
app.use(cors({
  origin: '*',          // allow Expo Go on any local IP
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'hxnix-api', timestamp: new Date().toISOString() });
});

// ── API Routes ─────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/posts', postRoutes);

// ── 404 ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Boot ───────────────────────────────────────────────
async function start() {
  await testConnection();
  await initUsers();
  await initPosts();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Hxnix API running on http://0.0.0.0:${PORT}`);
    console.log(`   Health → http://localhost:${PORT}/health`);
    console.log(`   Posts  → http://localhost:${PORT}/api/posts\n`);
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
