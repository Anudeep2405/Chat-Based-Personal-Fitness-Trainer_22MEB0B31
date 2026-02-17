/**
 * Bootstrap File
 * Loads environment variables BEFORE the app starts.
 * This fixes ESM import order issues.
 */

import dotenv from 'dotenv';

// Load .env first
dotenv.config();

// Start the actual server
import './server.js';
