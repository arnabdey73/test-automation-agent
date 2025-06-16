import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { program } from 'commander';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// Import ManualTestAPI
import ManualTestAPI from './manual-test-api.js';

// Get dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure CLI options
program
  .option('-p, --port <number>', 'Port to run the server on', '3001')
  .option('-t, --test-dir <path>', 'Path to test directory', '../tests')
  .option('-r, --results-dir <path>', 'Path for test results', '../test-results')
  .option('--ai-dir <path>', 'Path to AI module directory', '../ai')
  .option('--enable-ai', 'Enable AI-powered features', true)
  .option('--enable-visual', 'Enable visual regression testing', true)
  .option('--enable-priority', 'Enable test prioritization', true)
  .option('--enable-manual-test', 'Enable manual test simulation', true)
  .option('--manual-test-dir <path>', 'Path to manual test directory', '../manual-tests')
  .parse(process.argv);

const options = program.opts();

// Initialize Express app
const app = express();
const port = options.port;
const server = createServer(app);

// Setup WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

// Enable CORS
app.use(cors());
app.use(express.json());

// Store test execution state
const testState = {
  running: false,
  suite: null,
  startTime: null,
  results: null,
  history: [],
  aiFeatures: {
    enabled: options.enableAi,
    testGeneration: options.enableAi,
    visualRegression: options.enableVisual,
    testPrioritization: options.enablePriority
  },
  manualTest: {
    enabled: options.enableManualTest,
    sessionsDir: options.manualTestDir
  }
};

// Load config file
let testConfig = {};

async function loadTestConfig() {
  try {
    const configPath = join(__dirname, '../config/test-config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    testConfig = JSON.parse(configData);
    
    // Update state with config
    if (testConfig.ai) {
      testState.aiFeatures = {
        ...testState.aiFeatures,
        ...testConfig.ai,
        testGeneration: testConfig.ai.testGeneration || {},
        visualRegression: testConfig.ai.visualRegression || {},
        testPrioritization: testConfig.ai.testPrioritization || {}
      };
    }
    
    console.log(chalk.green('✅ Test configuration loaded successfully'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to load test configuration:'), error);
  }
}

// Path to AI module
const aiDir = join(__dirname, options.aiDir);

// Serve test results
app.use('/results', express.static(join(__dirname, options.resultsDir)));

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    running: testState.running,
    suite: testState.suite
  });
});

// Manual Test API Endpoints
if (testState.manualTest.enabled) {
  console.log(chalk.blue('🎮 Initializing Manual Test Simulation API...'));
  const manualTestAPI = new ManualTestAPI();
  app.use('/api/manual-test', manualTestAPI.getRouter());
}

// AI Features API Endpoints

// Get AI features configuration
app.get('/api/ai/config', (req, res) => {
  res.json({
    enabled: testState.aiFeatures.enabled,
    features: {
      testGeneration: testState.aiFeatures.testGeneration,
      visualRegression: testState.aiFeatures.visualRegression,
      testPrioritization: testState.aiFeatures.testPrioritization
    }
  });
});

// Update AI features configuration
app.post('/api/ai/config', async (req, res) => {
  try {
    const { enabled, testGeneration, visualRegression, testPrioritization } = req.body;
    
    if (typeof enabled === 'boolean') {
      testState.aiFeatures.enabled = enabled;
    }
    
    if (testGeneration) {
      testState.aiFeatures.testGeneration = {
        ...testState.aiFeatures.testGeneration,
        ...testGeneration
      };
    }
    
    if (visualRegression) {
      testState.aiFeatures.visualRegression = {
        ...testState.aiFeatures.visualRegression,
        ...visualRegression
      };
    }
    
    if (testPrioritization) {
      testState.aiFeatures.testPrioritization = {
        ...testState.aiFeatures.testPrioritization,
        ...testPrioritization
      };
    }
    
    // Update config file
    const configPath = join(__dirname, '../config/test-config.json');
    if (existsSync(configPath)) {
      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);
      
      config.ai = {
        ...config.ai,
        enabled: testState.aiFeatures.enabled,
        testGeneration: testState.aiFeatures.testGeneration,
        visualRegression: testState.aiFeatures.visualRegression,
        testPrioritization: testState.aiFeatures.testPrioritization
      };
      
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    }
    
    res.json({ success: true, message: 'AI configuration updated' });
  } catch (error) {
    console.error(chalk.red('❌ Error updating AI configuration:'), error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate tests from spec
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { specFile, outputPath, testType } = req.body;
    
    if (!specFile) {
      return res.status(400).json({ success: false, error: 'Specification file path is required' });
    }
    
    const result = await runTestGeneration(specFile, outputPath, testType);
    
    if (result.success) {
      res.json({ success: true, message: 'Test generation completed', result });
    } else {
      res.status(500).json({ success: false, error: result.output || result.error });
    }
  } catch (error) {
    console.error(chalk.red('❌ Error generating tests:'), error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Run visual regression
app.post('/api/ai/visual', async (req, res) => {
  try {
    const { updateBaselines, threshold } = req.body;
    
    const result = await runVisualRegression({
      updateBaselines,
      threshold,
      aiDir: options.aiDir
    });
    
    if (result.success) {
      res.json({ success: true, message: 'Visual regression tests completed', result });
    } else {
      res.status(500).json({ success: false, error: result.output || result.error });
    }
  } catch (error) {
    console.error(chalk.red('❌ Error running visual regression:'), error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Run test prioritization
app.post('/api/ai/prioritize', async (req, res) => {
  try {
    const { weightFactors } = req.body;
    
    const result = await runTestPrioritization({
      weightFactors,
      aiDir: options.aiDir
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test prioritization completed', 
        prioritizedTests: result.prioritizedTests || [],
        result 
      });
    } else {
      res.status(500).json({ success: false, error: result.output || result.error });
    }
  } catch (error) {
    console.error(chalk.red('❌ Error prioritizing tests:'), error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get test history
app.get('/api/ai/history', async (req, res) => {
  try {
    res.json({ success: true, history: testState.history });
  } catch (error) {
    console.error(chalk.red('❌ Error retrieving test history:'), error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate test from spec
app.post('/api/ai/generate-test', async (req, res) => {
  try {
    const { spec, type = 'ui', outputPath } = req.body;
    
    if (!testState.aiFeatures.enabled || !testState.aiFeatures.testGeneration) {
      return res.status(400).json({
        status: 'error',
        message: 'AI test generation is disabled'
      });
    }
    
    if (!spec) {
      return res.status(400).json({
        status: 'error',
        message: 'Spec is required'
      });
    }
    
    // Write spec to temporary file
    const specPath = join(__dirname, '../temp/spec-' + Date.now() + '.json');
    await fs.mkdir(join(__dirname, '../temp'), { recursive: true });
    await fs.writeFile(specPath, JSON.stringify(spec, null, 2));
    
    // Default output path
    const defaultOutputPath = join(__dirname, '../tests', type, `generated-${Date.now()}.test.ts`);
    const finalOutputPath = outputPath || defaultOutputPath;
    
    // Make sure output directory exists
    await fs.mkdir(path.dirname(finalOutputPath), { recursive: true });
    
    // Generate test using AI module
    const generateProcess = spawn('node', [
      'index.js',
      'generate',
      '--spec', specPath,
      '--output', finalOutputPath,
      '--type', type
    ], {
      cwd: aiDir,
      env: { ...process.env }
    });
    
    let output = '';
    
    generateProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(chalk.dim(chunk));
    });
    
    generateProcess.stderr.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.error(chalk.red(chunk));
    });
    
    generateProcess.on('close', async (code) => {
      if (code === 0) {
        try {
          // Read generated test
          const generatedTest = await fs.readFile(finalOutputPath, 'utf8');
          
          res.json({
            status: 'success',
            message: 'Test generated successfully',
            data: {
              path: finalOutputPath,
              content: generatedTest
            }
          });
        } catch (error) {
          res.status(500).json({
            status: 'error',
            message: 'Error reading generated test: ' + error.message
          });
        }
      } else {
        res.status(500).json({
          status: 'error',
          message: `Test generation failed with exit code ${code}`,
          output
        });
      }
      
      // Clean up
      try {
        await fs.unlink(specPath);
      } catch (error) {
        console.error('Error cleaning up spec file:', error);
      }
    });
  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating test: ' + error.message
    });
  }
});

app.get('/api/test-suites', (req, res) => {
  // In a real implementation, this would read from your test directory structure
  const testSuites = [
    {
      id: "ui-tests",
      name: "UI Tests",
      total: 24,
      passed: 22,
      failed: 1,
      skipped: 1,
      lastRun: "2025-06-14T10:30:00Z",
    },
    {
      id: "regression-tests",
      name: "Regression Tests",
      total: 36,
      passed: 33,
      failed: 3,
      skipped: 0,
      lastRun: "2025-06-14T09:15:00Z",
    }
  ];
  
  res.json({
    status: 'success',
    data: testSuites
  });
});

app.post('/api/run-tests', async (req, res) => {
  const { suite, usePrioritization = false } = req.body;
  
  if (testState.running) {
    return res.status(409).json({
      status: 'error',
      message: 'Tests are already running'
    });
  }
  
  // Start test execution
  testState.running = true;
  testState.suite = suite;
  testState.startTime = new Date().toISOString();
  testState.results = null;
  
  const testDir = join(__dirname, options.testDir);
  
  // Notify connected clients
  broadcastToClients({
    type: 'test-started',
    data: { suite, time: testState.startTime, usePrioritization }
  });
  
  console.log(chalk.blue(`🧪 Starting test suite: ${suite || 'all tests'}`));
  
  let testCommand = ['playwright', 'test'];
  let testArgs = [];
  
  // Apply test prioritization if enabled and requested
  if (usePrioritization && testState.aiFeatures.enabled && testState.aiFeatures.testPrioritization) {
    try {
      console.log(chalk.blue('🧠 Applying AI-powered test prioritization...'));
      
      // Generate prioritized test list
      const priorityOutput = join(__dirname, '../temp/priority-' + Date.now() + '.json');
      await fs.mkdir(join(__dirname, '../temp'), { recursive: true });
      
      // Run prioritization
      const priorityProcess = spawn('node', [
        'index.js',
        'prioritize',
        '--test-dir', '../tests/' + (suite || ''),
        '--output', priorityOutput
      ], {
        cwd: aiDir,
        stdio: 'pipe',
        shell: true
      });
      
      // Wait for prioritization to finish
      await new Promise((resolve, reject) => {
        priorityProcess.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Prioritization failed with exit code ${code}`));
          }
        });
      });
      
      // Read prioritized test list
      const priorityData = await fs.readFile(priorityOutput, 'utf8');
      const prioritizedTests = JSON.parse(priorityData);
      
      // Use only top 10 tests if there are more than 10
      const testsToRun = prioritizedTests.slice(0, 10).map(test => test.path);
      
      if (testsToRun.length > 0) {
        console.log(chalk.green(`✅ Using ${testsToRun.length} prioritized tests`));
        testArgs = testsToRun;
        
        // Notify about prioritization
        broadcastToClients({
          type: 'test-prioritized',
          data: {
            prioritizedTests: prioritizedTests.slice(0, 10).map(test => ({
              path: test.path,
              relativePath: test.relativePath,
              priority: test.normalizedPriority,
              rank: test.rank
            }))
          }
        });
      } else {
        console.log(chalk.yellow('⚠️ No prioritized tests found, running all tests'));
        testArgs = [suite ? suite + '/' : ''];
      }
      
      // Clean up
      await fs.unlink(priorityOutput);
      
    } catch (error) {
      console.error(chalk.red('Error applying test prioritization:'), error);
      console.log(chalk.yellow('⚠️ Falling back to standard test execution'));
      testArgs = [suite ? suite + '/' : ''];
    }
  } else {
    testArgs = [suite ? suite + '/' : ''];
  }
  
  // Add reporter options
  testArgs.push('--reporter=json,html');
  
  // Spawn playwright test process
  const testProcess = spawn('npx', [
    ...testCommand,
    ...testArgs
  ], {
    cwd: testDir,
    shell: true
  });
  
  let output = '';
  
  testProcess.stdout.on('data', (data) => {
    const chunk = data.toString();
    output += chunk;
    
    // Broadcast updates
    broadcastToClients({
      type: 'test-output',
      data: { text: chunk }
    });
    
    console.log(chalk.dim(chunk));
  });
  
  testProcess.stderr.on('data', (data) => {
    const chunk = data.toString();
    output += chunk;
    
    broadcastToClients({
      type: 'test-error',
      data: { text: chunk }
    });
    
    console.error(chalk.red(chunk));
  });
  
  testProcess.on('close', async (code) => {
    const endTime = new Date().toISOString();
    const success = code === 0;
    
    testState.running = false;
    testState.results = {
      success,
      exitCode: code,
      endTime
    };
    
    // Add to history
    testState.history.push({
      suite: testState.suite,
      startTime: testState.startTime,
      endTime,
      success,
      output: output.substring(0, 5000) // Trim long output
    });
    
    // Keep history manageable
    if (testState.history.length > 10) {
      testState.history.shift();
    }
    
    // Run visual regression tests if enabled
    let visualResults = null;
    
    if (testState.aiFeatures.enabled && testState.aiFeatures.visualRegression) {
      try {
        console.log(chalk.blue('🖼️ Running AI-powered visual regression tests...'));
        
        // Check if screenshots were generated
        const artifactsDir = join(__dirname, options.resultsDir, 'test-artifacts');
        const hasScreenshots = existsSync(artifactsDir);
        
        if (hasScreenshots) {
          // Run visual comparison
          const visualProcess = spawn('node', [
            'index.js',
            'visual',
            '--output', join(__dirname, options.resultsDir, 'visual-results.json')
          ], {
            cwd: aiDir,
            stdio: 'pipe',
            shell: true
          });
          
          let visualOutput = '';
          
          visualProcess.stdout.on('data', (data) => {
            visualOutput += data.toString();
          });
          
          visualProcess.stderr.on('data', (data) => {
            visualOutput += data.toString();
          });
          
          // Wait for visual regression to finish
          await new Promise((resolve) => {
            visualProcess.on('close', (code) => {
              resolve();
            });
          });
          
          // Read visual results
          try {
            const visualData = await fs.readFile(
              join(__dirname, options.resultsDir, 'visual-results.json'),
              'utf8'
            );
            visualResults = JSON.parse(visualData);
            
            console.log(chalk.green('✅ Visual regression tests completed'));
          } catch (error) {
            console.error(chalk.red('Error reading visual regression results:'), error);
          }
        } else {
          console.log(chalk.yellow('⚠️ No screenshots found for visual regression testing'));
        }
      } catch (error) {
        console.error(chalk.red('Error running visual regression tests:'), error);
      }
    }
    
    // Update test history for prioritization if enabled
    if (testState.aiFeatures.enabled && testState.aiFeatures.testPrioritization) {
      try {
        // Find test results JSON
        const resultsPath = join(__dirname, options.resultsDir, 'test-results.json');
        
        if (existsSync(resultsPath)) {
          console.log(chalk.blue('🧠 Updating test history for prioritization...'));
          
          // Run history update
          const historyProcess = spawn('node', [
            'index.js',
            'update-history',
            '--results', resultsPath
          ], {
            cwd: aiDir,
            stdio: 'pipe',
            shell: true
          });
          
          // Wait for history update to finish
          await new Promise((resolve) => {
            historyProcess.on('close', () => {
              resolve();
            });
          });
          
          console.log(chalk.green('✅ Test history updated'));
        }
      } catch (error) {
        console.error(chalk.red('Error updating test history:'), error);
      }
    }
    
    // Notify connected clients
    broadcastToClients({
      type: 'test-completed',
      data: {
        suite: testState.suite,
        startTime: testState.startTime,
        endTime,
        success,
        code,
        visualResults
      }
    });
    
    console.log(chalk.green(`✅ Tests completed with exit code: ${code}`));
  });
  
  res.json({
    status: 'success',
    message: `Started test execution for ${suite || 'all tests'}`,
    data: {
      startTime: testState.startTime
    }
  });
});

// Load test history
async function loadTestHistory() {
  try {
    const historyPath = testState.aiFeatures.testPrioritization?.historyFile || 
      join(__dirname, '../test-results/test-history.json');
      
    if (existsSync(historyPath)) {
      const historyData = await fs.readFile(historyPath, 'utf-8');
      testState.history = JSON.parse(historyData);
      console.log(chalk.green('✅ Test history loaded successfully'));
    } else {
      testState.history = [];
      console.log(chalk.yellow('⚠️ No test history found, starting with empty history'));
    }
  } catch (error) {
    console.error(chalk.red('❌ Failed to load test history:'), error);
    testState.history = [];
  }
}

// Run AI based test generation
async function runTestGeneration(specFile, outputPath, testType) {
  if (!testState.aiFeatures.enabled || !testState.aiFeatures.testGeneration?.enabled) {
    return { error: 'Test generation is not enabled' };
  }
  
  console.log(chalk.blue('🧠 Generating tests from specification...'));
  
  try {
    const args = ['index.js', 'generate'];
    
    if (specFile) {
      if (specFile.endsWith('.json')) {
        args.push('--spec', specFile);
      } else if (specFile.endsWith('.feature')) {
        args.push('--feature', specFile);
      } else if (specFile.endsWith('.md') || specFile.endsWith('.yaml') || specFile.endsWith('.yml')) {
        args.push('--api-docs', specFile);
      }
    }
    
    if (outputPath) {
      args.push('--output', outputPath);
    }
    
    if (testType) {
      args.push('--type', testType);
    }
    
    const process = spawn('node', args, { 
      cwd: join(__dirname, options.aiDir),
      env: { ...process.env }
    });
    
    let output = '';
    
    process.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(chunk);
    });
    
    process.stderr.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.error(chalk.red(chunk));
    });
    
    return new Promise((resolve, reject) => {
      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output, code });
        } else {
          resolve({ success: false, output, code });
        }
      });
      
      process.on('error', (error) => {
        reject({ success: false, error: error.message });
      });
    });
  } catch (error) {
    console.error(chalk.red('❌ Test generation failed:'), error);
    return { success: false, error: error.message };
  }
}

// Run visual regression testing
async function runVisualRegression(options = {}) {
  if (!testState.aiFeatures.enabled || !testState.aiFeatures.visualRegression?.enabled) {
    return { error: 'Visual regression is not enabled' };
  }
  
  console.log(chalk.blue('🖼️ Running visual regression tests...'));
  
  try {
    const args = ['index.js', 'visual'];
    
    if (options.updateBaselines) {
      args.push('--update-baselines');
    }
    
    if (options.threshold) {
      args.push('--threshold', options.threshold.toString());
    }
    
    const process = spawn('node', args, { 
      cwd: join(__dirname, options.aiDir),
      env: { ...process.env }
    });
    
    let output = '';
    
    process.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(chunk);
    });
    
    process.stderr.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.error(chalk.red(chunk));
    });
    
    return new Promise((resolve, reject) => {
      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output, code });
        } else {
          resolve({ success: false, output, code });
        }
      });
      
      process.on('error', (error) => {
        reject({ success: false, error: error.message });
      });
    });
  } catch (error) {
    console.error(chalk.red('❌ Visual regression testing failed:'), error);
    return { success: false, error: error.message };
  }
}

// Run test prioritization
async function runTestPrioritization(options = {}) {
  if (!testState.aiFeatures.enabled || !testState.aiFeatures.testPrioritization?.enabled) {
    return { error: 'Test prioritization is not enabled' };
  }
  
  console.log(chalk.blue('🧠 Prioritizing tests based on history...'));
  
  try {
    const args = ['index.js', 'prioritize'];
    
    if (options.weightFactors) {
      args.push('--weight-factors', JSON.stringify(options.weightFactors));
    }
    
    const process = spawn('node', args, { 
      cwd: join(__dirname, options.aiDir),
      env: { ...process.env }
    });
    
    let output = '';
    
    process.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(chunk);
    });
    
    process.stderr.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.error(chalk.red(chunk));
    });
    
    return new Promise((resolve, reject) => {
      process.on('close', (code) => {
        if (code === 0) {
          try {
            // Try to parse the output to get prioritized tests
            const resultMatch = output.match(/PRIORITIZED_TESTS_JSON_START([\s\S]*?)PRIORITIZED_TESTS_JSON_END/);
            if (resultMatch && resultMatch[1]) {
              const prioritizedTests = JSON.parse(resultMatch[1]);
              resolve({ success: true, prioritizedTests, output, code });
            } else {
              resolve({ success: true, output, code });
            }
          } catch (error) {
            resolve({ success: true, output, code });
          }
        } else {
          resolve({ success: false, output, code });
        }
      });
      
      process.on('error', (error) => {
        reject({ success: false, error: error.message });
      });
    });
  } catch (error) {
    console.error(chalk.red('❌ Test prioritization failed:'), error);
    return { success: false, error: error.message };
  }
}

// WebSocket handling
wss.on('connection', (ws) => {
  console.log(chalk.green('📡 Client connected to test runner'));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`📥 Received message: ${data.type}`);
      
      // Handle client messages if needed
    } catch (error) {
      console.error(`Error parsing message: ${error}`);
    }
  });
  
  ws.on('close', () => {
    console.log(chalk.yellow('👋 Client disconnected from test runner'));
  });
  
  // Send initial state
  ws.send(JSON.stringify({
    type: 'init',
    data: testState
  }));
});

function broadcastToClients(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Initialize data
(async function init() {
  await loadTestConfig();
  
  // Load test history if test prioritization is enabled
  if (testState.aiFeatures.testPrioritization?.enabled) {
    await loadTestHistory();
  }
})();

// Start server
server.listen(port, () => {
  console.log(chalk.green(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🚀 Test Automation Agent Runner                ║
║   🌐 Server running at http://localhost:${port}     ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`));
  console.log(chalk.cyan('Available endpoints:'));
  console.log(chalk.dim('GET  /api/status      - Get current test execution status'));
  console.log(chalk.dim('GET  /api/test-suites - List available test suites'));
  console.log(chalk.dim('POST /api/run-tests   - Run tests {suite: "name"}'));
  console.log(chalk.dim('GET  /results         - Access test results'));
  console.log('\n' + chalk.yellow('Press Ctrl+C to stop the server'));
});
