#!/usr/bin/env node
/**
 * ⏰ Automated Cron Job Service
 * 
 * This service runs continuously and triggers data ingestion at 3 AM IST daily.
 * 
 * Usage:
 *   npm run cron:start
 *   OR
 *   node scripts/cron-service.mjs
 * 
 * Features:
 * - Runs data ingestion automatically at 3:00 AM IST every day
 * - Logs all activities to console and optional log file
 * - Graceful shutdown on SIGTERM/SIGINT
 * - Catches up if missed schedule (runs immediately on startup if last run > 24h ago)
 * 
 * Production Deployment:
 * - Use PM2: pm2 start scripts/cron-service.mjs --name mgnrega-cron
 * - Use systemd: Create a service file for Linux servers
 * - Use Docker: Add to docker-compose with restart policy
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { spawn } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const CRON_SCHEDULE = { hour: 3, minute: 0 }; // 3:00 AM IST
const LOG_FILE = resolve(__dirname, '../logs/cron.log');
const LAST_RUN_FILE = resolve(__dirname, '../logs/last-run.json');

// Ensure logs directory exists
const logsDir = resolve(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function log(message, level = 'INFO') {
  const timestamp = new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  
  console.log(logMessage);
  
  // Append to log file
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (err) {
    console.error('Failed to write to log file:', err.message);
  }
}

function getLastRunTime() {
  try {
    if (fs.existsSync(LAST_RUN_FILE)) {
      const data = JSON.parse(fs.readFileSync(LAST_RUN_FILE, 'utf8'));
      return new Date(data.lastRun);
    }
  } catch (err) {
    log(`Failed to read last run time: ${err.message}`, 'WARN');
  }
  return null;
}

function saveLastRunTime() {
  try {
    fs.writeFileSync(LAST_RUN_FILE, JSON.stringify({ 
      lastRun: new Date().toISOString() 
    }, null, 2));
  } catch (err) {
    log(`Failed to save last run time: ${err.message}`, 'ERROR');
  }
}

function getNextRunTime() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(CRON_SCHEDULE.hour, CRON_SCHEDULE.minute, 0, 0);
  
  // If today's scheduled time has passed, schedule for tomorrow
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  
  return next;
}

function getTimeUntilNextRun() {
  const next = getNextRunTime();
  const now = new Date();
  return next.getTime() - now.getTime();
}

async function runIngestion() {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('🚀 Starting scheduled data ingestion...');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  return new Promise((resolve, reject) => {
    const scriptPath = resolve(__dirname, 'manual-ingest.mjs');
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      env: process.env
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        log('✅ Data ingestion completed successfully!', 'SUCCESS');
        saveLastRunTime();
        resolve();
      } else {
        log(`❌ Data ingestion failed with exit code ${code}`, 'ERROR');
        reject(new Error(`Ingestion failed with code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      log(`❌ Failed to spawn ingestion process: ${err.message}`, 'ERROR');
      reject(err);
    });
  });
}

function scheduleNextRun() {
  const msUntilNext = getTimeUntilNextRun();
  const nextRun = getNextRunTime();
  
  log(`⏰ Next ingestion scheduled for: ${nextRun.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  log(`   (in ${Math.floor(msUntilNext / 1000 / 60 / 60)} hours and ${Math.floor((msUntilNext / 1000 / 60) % 60)} minutes)`);
  
  const timeoutId = setTimeout(async () => {
    try {
      await runIngestion();
    } catch (err) {
      log(`Scheduled ingestion failed: ${err.message}`, 'ERROR');
    }
    
    // Schedule next run
    scheduleNextRun();
  }, msUntilNext);
  
  // Store timeout ID for cleanup
  return timeoutId;
}

function shouldRunCatchup() {
  const lastRun = getLastRunTime();
  if (!lastRun) {
    log('No previous run detected. Will wait for scheduled time.', 'INFO');
    return false;
  }
  
  const hoursSinceLastRun = (Date.now() - lastRun.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLastRun > 24) {
    log(`⚠️  Last run was ${Math.floor(hoursSinceLastRun)} hours ago. Running catch-up ingestion...`, 'WARN');
    return true;
  }
  
  log(`Last successful run: ${lastRun.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 'INFO');
  return false;
}

// Main service
let currentTimeout = null;

async function startCronService() {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('⏰ MGNREGA Cron Service Started');
  log(`🕒 Schedule: Daily at ${CRON_SCHEDULE.hour}:${String(CRON_SCHEDULE.minute).padStart(2, '0')} AM IST`);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check if we need to run catch-up
  if (shouldRunCatchup()) {
    try {
      await runIngestion();
    } catch (err) {
      log(`Catch-up ingestion failed: ${err.message}`, 'ERROR');
    }
  }
  
  // Schedule next run
  currentTimeout = scheduleNextRun();
  
  log('✅ Cron service is running. Press Ctrl+C to stop.');
}

// Graceful shutdown
function shutdown() {
  log('🛑 Shutting down cron service...');
  if (currentTimeout) {
    clearTimeout(currentTimeout);
  }
  log('👋 Cron service stopped.');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  log(`💥 Uncaught exception: ${err.message}`, 'FATAL');
  log(err.stack, 'FATAL');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled rejection at: ${promise}, reason: ${reason}`, 'FATAL');
  process.exit(1);
});

// Start the service
startCronService().catch((err) => {
  log(`Failed to start cron service: ${err.message}`, 'FATAL');
  process.exit(1);
});
