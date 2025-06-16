#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = process.cwd();

// Environment setup
const environment = process.env.NODE_ENV || 'production';
const port = process.env.PORT || 4000;

console.log(`\n🚀 Deploying Test Automation Agent (${environment})...\n`);

// Create necessary directories
async function ensureDirectories() {
  console.log('📁 Creating necessary directories...');
  
  const dirs = [
    './manual-tests', 
    './test-results'
  ];

  for (const dir of dirs) {
    await fs.mkdir(path.join(rootDir, dir), { recursive: true });
  }
}

// Build the application
async function buildApp() {
  console.log('🔨 Building application...');
  
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build:prod'], { 
      stdio: 'inherit', 
      shell: true
    });
    
    build.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });
  });
}

// Start the server
function startServer() {
  console.log(`🌎 Starting server on port ${port}...`);
  
  const server = spawn('node', ['./dist/entry.mjs'], { 
    stdio: 'inherit', 
    shell: true,
    env: { ...process.env, PORT: port, HOST: '0.0.0.0' }
  });
  
  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n⛔ Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
}

// Main deployment process
async function deploy() {
  try {
    await ensureDirectories();
    await buildApp();
    startServer();
    
    console.log('\n✅ Deployment completed successfully!');
    console.log(`📊 Server is running at http://localhost:${port}\n`);
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy();
