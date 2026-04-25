import dotenv from 'dotenv';
dotenv.config();
import {createServer} from 'http'
import app from './app.js'
import { initSocket } from './socket.js';
import { connectDB } from './db/db.js';
import './config/redis.js'
import { initBrowser } from './config/puppeteer.js';

import './cron/appointmentExpiry.js'
import './cron/settlement.cron.js'
import './cron/withdrawal.cron.js'

const port = process.env.PORT || 5000;
const baseURL = `http://localhost:${port}`

const server = createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    initSocket(server);
    await initBrowser();

    server.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });

    server.on('error', (err) => {
      console.error('Server failed to start:', err.message);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to establish connection:', error.message || error);
    process.exit(1);
  }
};



startServer();


