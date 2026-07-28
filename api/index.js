const path = require('path');

// Load .env from backend directory (for local dev; on Vercel, env vars come from dashboard)
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

// Import the Express app
const app = require('../backend/server');

module.exports = app;
