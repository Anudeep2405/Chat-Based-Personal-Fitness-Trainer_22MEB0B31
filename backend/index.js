/**
 * Bootstrap File
 * Loads environment variables BEFORE the app starts.
 * This fixes ESM import order issues.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve backend directory (works regardless of process.cwd())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env explicitly to avoid CWD issues
dotenv.config({ path: path.join(__dirname, '.env') });

// Start the actual server after env is loaded (use dynamic import to avoid ESM hoisting)
await import('./server.js');
