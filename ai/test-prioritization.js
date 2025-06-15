import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Default history file
const DEFAULT_HISTORY_FILE = '../test-results/test-history.json';

/**
 * Calculate test priorities based on historical results
 * @param {Object} options - Options for prioritization
 * @returns {Promise<Array>} - Prioritized list of tests
 */
export async function prioritizeTests(options = {}) {
  const {
    historyFile = DEFAULT_HISTORY_FILE,
    testDir = '../tests',
    weightFactors = {
      failureRate: 0.4,
      recentFailures: 0.3,
      executionTime: 0.15,
      age: 0.05,
      codeChanges: 0.1,
    },
  } = options;
  
  console.log(chalk.blue('🧠 Calculating test priorities based on historical results...'));
  
  try {
    // Load test history
    let testHistory = {};
    
    try {
      const historyPath = path.join(__dirname, historyFile);
      const historyData = await fs.readFile(historyPath, 'utf8');
      testHistory = JSON.parse(historyData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(chalk.yellow('⚠️ No test history found. Creating new history file.'));
        // Create empty history file
        await fs.mkdir(path.dirname(path.join(__dirname, historyFile)), { recursive: true });
        await fs.writeFile(path.join(__dirname, historyFile), JSON.stringify({}, null, 2));
      } else {
        console.error(chalk.red('Error loading test history:'), error);
        throw error;
      }
    }
    
    // Find all test files
    const testPaths = await glob(`${path.join(__dirname, testDir)}/**/*.{test,spec}.{js,ts}`);
    
    if (testPaths.length === 0) {
      console.log(chalk.yellow('⚠️ No test files found.'));
      return [];
    }
    
    console.log(chalk.blue(`Found ${testPaths.length} test files to prioritize`));
    
    // Calculate priority for each test
    const now = Date.now();
    const testPriorities = [];
    
    for (const testPath of testPaths) {
      const relativePath = path.relative(path.join(__dirname, testDir), testPath);
      const testInfo = testHistory[relativePath] || {
        runs: 0,
        failures: 0,
        lastRun: null,
        lastFailed: null,
        avgExecutionTime: 0,
        created: now,
        modified: now,
      };
      
      // Get file stats
      const stats = await fs.stat(testPath);
      
      // Calculate priority factors
      const failureRate = testInfo.runs > 0 ? testInfo.failures / testInfo.runs : 0;
      
      // Recent failures (decay function based on time since last failure)
      const recentFailures = testInfo.lastFailed
        ? Math.exp(-0.00000001 * (now - testInfo.lastFailed)) // Exponential decay
        : 0;
      
      // Test age in days
      const ageInDays = (now - (testInfo.created || stats.birthtime.getTime())) / (1000 * 60 * 60 * 24);
      const ageScore = Math.min(1, Math.log(1 + ageInDays) / Math.log(365)); // Logarithmic scale, max at 1 year
      
      // Code changes (based on file modification time)
      const lastModified = stats.mtime.getTime();
      const daysSinceModified = (now - lastModified) / (1000 * 60 * 60 * 24);
      const changeScore = Math.exp(-0.1 * daysSinceModified); // Higher score for recent changes
      
      // Execution time score (normalized between 0-1, higher for slower tests)
      const executionTimeScore = testInfo.avgExecutionTime > 0
        ? Math.min(1, testInfo.avgExecutionTime / 10000) // Normalize to max of 10s
        : 0.5; // Default score for tests without execution time data
      
      // Calculate total priority score
      const priorityScore = 
        failureRate * weightFactors.failureRate +
        recentFailures * weightFactors.recentFailures +
        executionTimeScore * weightFactors.executionTime +
        ageScore * weightFactors.age +
        changeScore * weightFactors.codeChanges;
      
      testPriorities.push({
        path: testPath,
        relativePath,
        priorityScore,
        factors: {
          failureRate,
          recentFailures,
          executionTimeScore,
          ageScore,
          changeScore
        },
        history: testInfo
      });
    }
    
    // Sort by priority score (descending)
    testPriorities.sort((a, b) => b.priorityScore - a.priorityScore);
    
    console.log(chalk.green('✅ Test prioritization complete!'));
    
    // Add normalized priority (0-100 range)
    const maxScore = Math.max(...testPriorities.map(t => t.priorityScore));
    const minScore = Math.min(...testPriorities.map(t => t.priorityScore));
    const scoreRange = maxScore - minScore || 1;
    
    return testPriorities.map((test, index) => ({
      ...test,
      normalizedPriority: Math.round(((test.priorityScore - minScore) / scoreRange) * 100),
      rank: index + 1
    }));
    
  } catch (error) {
    console.error(chalk.red('Error prioritizing tests:'), error);
    throw error;
  }
}

/**
 * Update test history with results from a test run
 * @param {Object} testRunResults - Results from test run
 * @param {string} historyFile - Path to history file
 * @returns {Promise<Object>} - Updated history
 */
export async function updateTestHistory(testRunResults, historyFile = DEFAULT_HISTORY_FILE) {
  console.log(chalk.blue('📝 Updating test history with new results...'));
  
  try {
    // Load existing history
    let testHistory = {};
    
    try {
      const historyPath = path.join(__dirname, historyFile);
      const historyData = await fs.readFile(historyPath, 'utf8');
      testHistory = JSON.parse(historyData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(chalk.yellow('⚠️ No test history found. Creating new history file.'));
        // Create directory if it doesn't exist
        await fs.mkdir(path.dirname(path.join(__dirname, historyFile)), { recursive: true });
      } else {
        console.error(chalk.red('Error loading test history:'), error);
        throw error;
      }
    }
    
    const now = Date.now();
    
    // Update history with new results
    for (const result of testRunResults.results || []) {
      const { file, status, duration } = result;
      
      if (!file) continue;
      
      // Initialize history entry if needed
      if (!testHistory[file]) {
        testHistory[file] = {
          runs: 0,
          failures: 0,
          lastRun: null,
          lastFailed: null,
          avgExecutionTime: 0,
          created: now,
        };
      }
      
      const history = testHistory[file];
      
      // Update counters
      history.runs += 1;
      if (status === 'failed') {
        history.failures += 1;
        history.lastFailed = now;
      }
      
      // Update execution time as weighted average
      if (duration) {
        if (history.avgExecutionTime === 0) {
          history.avgExecutionTime = duration;
        } else {
          history.avgExecutionTime = 
            (history.avgExecutionTime * 0.7) + (duration * 0.3); // 70% old value, 30% new value
        }
      }
      
      // Update last run timestamp
      history.lastRun = now;
    }
    
    // Save updated history
    await fs.writeFile(
      path.join(__dirname, historyFile),
      JSON.stringify(testHistory, null, 2)
    );
    
    console.log(chalk.green('✅ Test history updated successfully!'));
    
    return testHistory;
  } catch (error) {
    console.error(chalk.red('Error updating test history:'), error);
    throw error;
  }
}

export default {
  prioritizeTests,
  updateTestHistory
};
