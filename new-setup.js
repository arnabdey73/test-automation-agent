#!/usr/bin/env node

import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = process.cwd();

console.log('\n🚀 Setting up Test Automation Agent...\n');

// Check if we need to migrate from old structure to new structure
const isLegacyStructure = fs.existsSync(path.join(rootDir, 'agent-ui')) &&
                        fs.existsSync(path.join(rootDir, 'ai')) &&
                        fs.existsSync(path.join(rootDir, 'runner'));

if (isLegacyStructure) {
  console.log('🔄 Detected legacy project structure. Migrating to Astro monorepo...\n');
  
  // Check if we have the new structure files
  if (fs.existsSync(path.join(rootDir, 'new-package.json')) &&
      fs.existsSync(path.join(rootDir, 'new-astro.config.mjs'))) {
    
    console.log('📋 Moving new configuration files to root...');
    fs.renameSync(
      path.join(process.cwd(), 'new-package.json'),
      path.join(process.cwd(), 'package.json')
    );
    
    fs.renameSync(
      path.join(process.cwd(), 'new-astro.config.mjs'),
      path.join(process.cwd(), 'astro.config.mjs')
    );
    
    // Copy existing tailwind.config.mjs if it exists
    if (fs.existsSync(path.join(process.cwd(), 'tailwind.config.mjs'))) {
      console.log('📋 Using existing Tailwind configuration...');
    } else {
      console.log('📋 Setting up Tailwind configuration...');
      if (fs.existsSync(path.join(process.cwd(), 'agent-ui', 'tailwind.config.mjs'))) {
        fs.copyFileSync(
          path.join(process.cwd(), 'agent-ui', 'tailwind.config.mjs'),
          path.join(process.cwd(), 'tailwind.config.mjs')
        );
      }
    }
    
    console.log('🗂️  Creating necessary directories...');
    const dirs = [
      'src',
      'src/pages',
      'src/components',
      'src/layouts',
      'src/styles',
      'src/lib',
      'src/services',
      'src/services/ai',
      'src/services/runner',
      'src/pages/api',
      'src/pages/api/ai',
      'src/pages/api/runner',
      'public'
    ];
    
    dirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
    
    console.log('📋 Copying UI files to new structure...');
    copyDir(
      path.join(process.cwd(), 'agent-ui', 'src', 'pages'),
      path.join(process.cwd(), 'src', 'pages')
    );
    copyDir(
      path.join(process.cwd(), 'agent-ui', 'src', 'components'),
      path.join(process.cwd(), 'src', 'components')
    );
    copyDir(
      path.join(process.cwd(), 'agent-ui', 'src', 'layouts'),
      path.join(process.cwd(), 'src', 'layouts')
    );
    copyDir(
      path.join(process.cwd(), 'agent-ui', 'src', 'styles'),
      path.join(process.cwd(), 'src', 'styles')
    );
    copyDir(
      path.join(process.cwd(), 'agent-ui', 'src', 'lib'),
      path.join(process.cwd(), 'src', 'lib')
    );
    copyDir(
      path.join(process.cwd(), 'agent-ui', 'public'),
      path.join(process.cwd(), 'public')
    );
    
    console.log('📋 Copying AI module files to new structure...');
    copyDir(
      path.join(process.cwd(), 'ai'),
      path.join(process.cwd(), 'src', 'services', 'ai'),
      ['node_modules', 'package.json', 'package-lock.json']
    );
    
    console.log('📋 Copying runner files to new structure...');
    copyDir(
      path.join(process.cwd(), 'runner'),
      path.join(process.cwd(), 'src', 'services', 'runner'),
      ['node_modules', 'package.json', 'package-lock.json']
    );
    
    console.log('📋 Creating necessary directories for test results...');
    const testDirs = [
      'manual-tests',
      'test-results',
      'test-results/screenshots',
      'test-results/baselines',
      'test-results/visual-diff'
    ];
    
    testDirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  } else {
    console.error('❌ Migration files not found. Please run the migration process first.');
    process.exit(1);
  }
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
spawnSync('npm', ['install'], { stdio: 'inherit', shell: true });

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

console.log('\n✅ Setup completed successfully!');
console.log('🚀 Run the application with: npm run dev');

// Helper function to recursively copy directory
function copyDir(src, dest, excludeList = []) {
  if (!fs.existsSync(src)) {
    return;
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (excludeList.includes(entry.name)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, excludeList);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
