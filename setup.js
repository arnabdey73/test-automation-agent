#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n🚀 Setting up Test Automation Agent...\n');

// Install root dependencies
console.log('📦 Installing root dependencies...');
spawnSync('npm', ['install'], { stdio: 'inherit', shell: true });

// Install UI dependencies
console.log('\n📦 Installing UI dependencies...');
spawnSync('npm', ['install'], { 
  stdio: 'inherit', 
  shell: true,
  cwd: path.join(process.cwd(), 'agent-ui')
});

// Install runner dependencies
console.log('\n📦 Installing runner dependencies...');
spawnSync('npm', ['install'], { 
  stdio: 'inherit', 
  shell: true,
  cwd: path.join(process.cwd(), 'runner')
});

// Install AI module dependencies
console.log('\n📦 Installing AI module dependencies...');
spawnSync('npm', ['install'], { 
  stdio: 'inherit', 
  shell: true,
  cwd: path.join(process.cwd(), 'ai')
});

// Install test dependencies and set up Playwright
console.log('\n📦 Installing test dependencies...');
spawnSync('npm', ['install'], { 
  stdio: 'inherit', 
  shell: true,
  cwd: path.join(process.cwd(), 'tests')
});

console.log('\n🎭 Installing Playwright browsers...');
spawnSync('npx', ['playwright', 'install', '--with-deps'], { 
  stdio: 'inherit', 
  shell: true,
  cwd: path.join(process.cwd(), 'tests')
});

// Create results directory
const resultsDir = path.join(process.cwd(), 'test-results');
if (!fs.existsSync(resultsDir)) {
  console.log('\n📁 Creating test-results directory...');
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Create visual regression directories
const visualBaselinesDir = path.join(process.cwd(), 'tests', 'visual-baselines');
const visualDiffDir = path.join(process.cwd(), 'test-results', 'visual-diff');
const generatedTestsDir = path.join(process.cwd(), 'tests', 'generated');

console.log('\n📁 Creating directories for AI features...');
if (!fs.existsSync(visualBaselinesDir)) {
  fs.mkdirSync(visualBaselinesDir, { recursive: true });
}
if (!fs.existsSync(visualDiffDir)) {
  fs.mkdirSync(visualDiffDir, { recursive: true });
}
if (!fs.existsSync(generatedTestsDir)) {
  fs.mkdirSync(generatedTestsDir, { recursive: true });
}

// Create manual test directory structure
const manualTestsDir = path.join(process.cwd(), 'manual-tests');
const manualTestSessionsDir = path.join(manualTestsDir, 'sessions');
const manualTestRecordingsDir = path.join(manualTestsDir, 'recordings');
const manualTestScreenshotsDir = path.join(manualTestsDir, 'screenshots');
const manualTestResultsDir = path.join(manualTestsDir, 'results');

console.log('\n📁 Creating directories for Manual Test simulation...');
if (!fs.existsSync(manualTestsDir)) {
  fs.mkdirSync(manualTestsDir, { recursive: true });
}
if (!fs.existsSync(manualTestSessionsDir)) {
  fs.mkdirSync(manualTestSessionsDir, { recursive: true });
}
if (!fs.existsSync(manualTestRecordingsDir)) {
  fs.mkdirSync(manualTestRecordingsDir, { recursive: true });
}
if (!fs.existsSync(manualTestScreenshotsDir)) {
  fs.mkdirSync(manualTestScreenshotsDir, { recursive: true });
}
if (!fs.existsSync(manualTestResultsDir)) {
  fs.mkdirSync(manualTestResultsDir, { recursive: true });
}

// Check for OpenAI API key
console.log('\n🔑 Checking for OpenAI API key...');
if (!process.env.OPENAI_API_KEY) {
  console.log('\n⚠️  No OpenAI API key found. GPT-based test generation will not work.');
  console.log('   Set the OPENAI_API_KEY environment variable to enable this feature.');
} else {
  console.log('✅ OpenAI API key found. GPT-based test generation is enabled.');
}

console.log('\n✅ Setup complete! You can now run the following command to start the application:');
console.log('\n   npm run dev\n');
console.log('📝 This will start:');
console.log('   - The Astro UI at http://localhost:3000');
console.log('   - The test runner API at http://localhost:3001\n');
