import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
export { renderers } from '../../renderers.mjs';

/**
 * Runner API - Exports functions for use in API endpoints
 * This is a streamlined version of run.js for use with Astro's serverless endpoints
 */


// Get dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Initialize the test runner with the given options
 */
function initializeRunner(customOptions = {}) {
  // Default options
  const options = {
    testDir: '../../../../tests',
    resultsDir: '../../../../test-results',
    manualTestDir: '../../../../manual-tests',
    enableAi: true,
    enableVisual: true,
    enablePriority: true,
    enableManualTest: true,
    ...customOptions
  };

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
    }
  };

  // Function to run Playwright tests
  async function runTest({ suite = 'all', grep = '', testFile = null }) {
    if (testState.running) {
      console.log('Test already running, cannot start another');
      return { success: false, error: 'Test already running' };
    }

    console.log(`Running tests: ${suite || 'all'} ${grep ? `grep: ${grep}` : ''}`);
    
    // Set test state
    testState.running = true;
    testState.suite = suite;
    testState.startTime = new Date().toISOString();
    testState.currentTest = null;
    testState.results = null;
    
    try {
      // Prepare command
      const args = ['test'];
      
      // Add suite filter if specified
      if (suite && suite !== 'all') {
        if (suite === 'ui') {
          args.push('ui/');
        } else if (suite === 'regression') {
          args.push('regression/');
        } else if (suite === 'generated') {
          args.push('generated/');
        }
      }
      
      // Add specific test file if provided
      if (testFile) {
        args.push(testFile);
      }
      
      // Add grep pattern if specified
      if (grep) {
        args.push('--grep', grep);
      }
      
      // Add reporter options
      args.push('--reporter=list,json');
      
      // Execute test in a child process
      const testProcess = spawn('npx', ['playwright', ...args], { 
        cwd: join(__dirname, options.testDir),
        shell: true
      });
      
      let output = '';
      
      testProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        console.log(chunk);
      });
      
      testProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        console.error(chunk);
      });
      
      const exitPromise = new Promise((resolve) => {
        testProcess.on('close', (code) => {
          console.log(`Test process exited with code ${code}`);
          
          // Update test state
          testState.running = false;
          testState.results = {
            exitCode: code,
            output,
            timestamp: new Date().toISOString()
          };
          
          resolve({ success: code === 0, exitCode: code, output });
        });
      });
      
      return exitPromise;
    } catch (error) {
      console.error('Error running tests:', error);
      
      // Update test state
      testState.running = false;
      testState.results = {
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      return { success: false, error: error.message };
    }
  }

  // Function to stop currently running test
  async function stopTest() {
    if (!testState.running) {
      return { success: false, error: 'No test is currently running' };
    }
    
    try {
      // On Windows, we'd use 'taskkill', on Unix systems we use killall
      const isWindows = process.platform === 'win32';
      const killCmd = isWindows ? 'taskkill' : 'killall';
      const killArgs = isWindows ? ['/F', '/IM', 'playwright'] : ['playwright'];
      
      spawn(killCmd, killArgs, { shell: true });
      
      testState.running = false;
      testState.results = {
        exitCode: -1,
        output: 'Test execution stopped by user',
        timestamp: new Date().toISOString()
      };
      
      return { success: true, message: 'Test execution stopped' };
    } catch (error) {
      console.error('Error stopping test:', error);
      return { success: false, error: error.message };
    }
  }

  // Function to get available test suites
  async function getTestSuites() {
    try {
      const basePath = join(__dirname, options.testDir);
      
      // Get list of test directories
      const testDirs = [
        { id: 'ui', name: 'UI Tests', path: 'ui' },
        { id: 'regression', name: 'Regression Tests', path: 'regression' },
        { id: 'generated', name: 'Generated Tests', path: 'generated' },
      ];
      
      const suites = [];
      
      // Process each test directory
      for (const dir of testDirs) {
        const dirPath = join(basePath, dir.path);
        
        try {
          // Check if directory exists
          await fs.access(dirPath);
          
          // Get list of test files
          const files = await fs.readdir(dirPath);
          const testFiles = files.filter(file => file.endsWith('.test.ts') || file.endsWith('.test.js'));
          
          suites.push({
            id: dir.id,
            name: dir.name,
            path: dir.path,
            tests: testFiles.map(file => ({
              name: file.replace(/\.test\.(js|ts)$/, ''),
              file
            })),
            totalTests: testFiles.length
          });
        } catch (error) {
          console.log(`Directory ${dirPath} does not exist or is not accessible`);
          // Add empty suite
          suites.push({
            id: dir.id,
            name: dir.name,
            path: dir.path,
            tests: [],
            totalTests: 0
          });
        }
      }
      
      return { success: true, suites };
    } catch (error) {
      console.error('Error getting test suites:', error);
      return { success: false, error: error.message };
    }
  }

  // Function to get test results
  async function getTestResults() {
    try {
      const resultsPath = join(__dirname, options.resultsDir);
      
      try {
        // Check if directory exists
        await fs.access(resultsPath);
        
        // Get list of result files
        const files = await fs.readdir(resultsPath);
        const resultFiles = files.filter(file => file.endsWith('.json') || file.endsWith('.html'));
        
        const results = [];
        
        // Process each result file
        for (const file of resultFiles) {
          try {
            if (file.endsWith('.json')) {
              const content = await fs.readFile(join(resultsPath, file), 'utf8');
              const resultData = JSON.parse(content);
              
              results.push({
                file,
                timestamp: resultData.timestamp || new Date().toISOString(),
                stats: resultData.stats || { total: 0, passed: 0, failed: 0 },
                tests: resultData.tests || []
              });
            }
          } catch (error) {
            console.error(`Error processing result file ${file}:`, error);
          }
        }
        
        return { success: true, results };
      } catch (error) {
        console.log(`Directory ${resultsPath} does not exist or is not accessible`);
        return { success: true, results: [] };
      }
    } catch (error) {
      console.error('Error getting test results:', error);
      return { success: false, error: error.message };
    }
  }

  return {
    runTest,
    stopTest,
    getTestSuites,
    getTestResults,
    testState
  };
}

// Export a default instance for convenience
initializeRunner();

// Initialize runner with default options
const runner = initializeRunner();

const GET = async ({ request }) => {
  return new Response(JSON.stringify({ 
    status: 'running', 
    ...runner.testState 
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, suite, grep } = data;
    
    if (action === 'run') {
      runner.runTest({ suite, grep });
      return new Response(JSON.stringify({ status: 'started', suite }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else if (action === 'stop') {
      runner.stopTest();
      return new Response(JSON.stringify({ status: 'stopped' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
