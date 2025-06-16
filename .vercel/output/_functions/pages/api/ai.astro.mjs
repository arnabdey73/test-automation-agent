import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import resemble from 'resemblejs';
import { glob } from 'glob';
export { renderers } from '../../renderers.mjs';

// Get dirname
path.dirname(fileURLToPath(import.meta.url));

// OpenAI client initialization
let openai;

/**
 * Initialize the OpenAI client
 * @param {string} apiKey - OpenAI API key
 */
function initializeOpenAI(apiKey) {
  try {
    openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    return true;
  } catch (error) {
    console.error(chalk.red('Error initializing OpenAI client:'), error);
    return false;
  }
}

/**
 * Generate test cases from a specification
 * @param {Object} spec - Specification object
 * @param {string} testType - Type of test (e.g., 'ui', 'regression', 'api')
 * @returns {Promise<string>} - Generated test code
 */
async function generateTestFromSpec(spec, testType = 'ui') {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  console.log(chalk.blue('🧠 Generating test cases from specification...'));
  
  try {
    // Prepare prompt with test type specific instructions
    let testFrameworkInstructions = '';
    
    if (testType === 'ui') {
      testFrameworkInstructions = `
Use Playwright Test API for UI testing with TypeScript.
Include selectors that are robust and won't break easily.
Add assertions that verify both visibility and functionality.
Structure the test with test.describe() and test.beforeEach() for setup.
Include appropriate waits and handle timing issues properly.
Add comments for clarity on each section of the test.
`;
    } else if (testType === 'regression') {
      testFrameworkInstructions = `
Use Playwright Test API with TypeScript.
Focus on regression testing patterns - checking that existing functionality works across different scenarios.
Include data-driven tests where appropriate.
Add assertions that are specific and meaningful.
Structure the test with test.describe() and test.beforeEach() for setup.
Use test.step() for clear test organization.
`;
    } else if (testType === 'api') {
      testFrameworkInstructions = `
Use Playwright Test API with TypeScript for API testing.
Include proper request construction and response validation.
Add assertions for status codes, headers, and response body.
Handle authentication if specified in the spec.
Include error case testing.
Structure with test.describe() and organize by endpoints.
`;
    }
    
    // Create the system prompt
    const systemPrompt = `You are a testing expert that creates high-quality test code from specifications.
You generate clean, maintainable, and effective test cases using Playwright Test.
${testFrameworkInstructions}

Format your response as a complete test file, ready to run.

Only include imports that are actually used in the test.
Ensure all test cases are well-commented and follow best practices.
`;

    // Format the user prompt based on the spec
    const userPrompt = `Generate a complete Playwright test file for the following specification:

${JSON.stringify(spec, null, 2)}

The test should be comprehensive and handle edge cases appropriately.
The output should be a complete TypeScript file that can be executed directly with Playwright.
Include appropriate imports, test groups, and assertions.
`;

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 2500,
    });

    const generatedCode = completion.choices[0].message.content;
    
    console.log(chalk.green('✅ Test generation complete!'));
    
    return generatedCode;
  } catch (error) {
    console.error(chalk.red('Error generating test:'), error);
    throw error;
  }
}

/**
 * Generate test cases from a feature file
 * @param {string} featureFilePath - Path to feature file
 * @returns {Promise<string>} - Generated test code
 */
async function generateTestFromFeatureFile(featureFilePath) {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  try {
    // Read feature file
    const featureContent = await fs.readFile(featureFilePath, 'utf8');
    
    console.log(chalk.blue(`🧠 Generating test cases from feature file: ${path.basename(featureFilePath)}`));

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are a testing expert that creates high-quality Playwright test code from Gherkin feature files.
Generate TypeScript code using Playwright Test API.
Include proper test organization, assertions, and setup code.
Make sure to handle all scenarios described in the feature file.
Your output should be a complete test file that can be run directly.` 
        },
        { 
          role: "user", 
          content: `Generate a complete Playwright test file for the following Gherkin feature:

${featureContent}

The output should be a complete TypeScript file that can be executed directly with Playwright.
Include appropriate imports, test groups, and assertions.`
        }
      ],
      temperature: 0.5,
      max_tokens: 2500,
    });

    const generatedCode = completion.choices[0].message.content;
    
    console.log(chalk.green('✅ Test generation from feature file complete!'));
    
    return generatedCode;
  } catch (error) {
    console.error(chalk.red('Error generating test from feature file:'), error);
    throw error;
  }
}

/**
 * Generate test cases from API documentation
 * @param {string} apiDocs - API documentation content
 * @returns {Promise<string>} - Generated test code
 */
async function generateTestFromAPIDocs(apiDocs) {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  try {
    console.log(chalk.blue('🧠 Generating API test cases from documentation...'));

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are a testing expert that creates high-quality API test code from API documentation.
Generate TypeScript code using Playwright Test API for API testing.
Include tests for each endpoint with proper request construction and response validation.
Add assertions for status codes, headers, and response body.
Include tests for both successful and error scenarios.
Your output should be a complete test file that can be run directly.` 
        },
        { 
          role: "user", 
          content: `Generate a complete API test file for the following API documentation:

${apiDocs}

The output should be a complete TypeScript file that can be executed directly with Playwright.
Include appropriate imports, test groups, and assertions for each API endpoint.`
        }
      ],
      temperature: 0.5,
      max_tokens: 2500,
    });

    const generatedCode = completion.choices[0].message.content;
    
    console.log(chalk.green('✅ API test generation complete!'));
    
    return generatedCode;
  } catch (error) {
    console.error(chalk.red('Error generating API tests:'), error);
    throw error;
  }
}

/**
 * Generate test improvement suggestions based on test results
 * @param {Object} testResults - Test results object
 * @returns {Promise<string>} - Improvement suggestions
 */
async function generateTestImprovementSuggestions(testResults) {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  try {
    console.log(chalk.blue('🧠 Generating test improvement suggestions...'));

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are a testing expert that analyzes test results and provides actionable improvements.
Focus on test coverage, test reliability, and best practices.
Identify patterns in failures and suggest remediation.
Provide concrete code examples where appropriate.` 
        },
        { 
          role: "user", 
          content: `Analyze the following test results and provide improvement suggestions:

${JSON.stringify(testResults, null, 2)}

Include suggestions for:
1. Improving test reliability
2. Enhancing test coverage
3. Fixing common issues in the failing tests
4. Better test organization if needed`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const suggestions = completion.choices[0].message.content;
    
    console.log(chalk.green('✅ Test improvement suggestions generated!'));
    
    return suggestions;
  } catch (error) {
    console.error(chalk.red('Error generating test improvement suggestions:'), error);
    throw error;
  }
}

const testGenerator = {
  initializeOpenAI,
  generateTestFromSpec,
  generateTestFromFeatureFile,
  generateTestFromAPIDocs,
  generateTestImprovementSuggestions
};

// Get dirname
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));

// Default configurations
const defaultConfig = {
  baselineDir: '../tests/visual-baselines',
  actualDir: '../test-results/test-artifacts/chromium',
  diffDir: '../test-results/visual-diff',
  threshold: 0.1, // 0.1% difference threshold by default
};

/**
 * Compare screenshots against baseline images
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Comparison results
 */
async function compareScreenshots(options = {}) {
  const config = { ...defaultConfig, ...options };
  
  console.log(chalk.blue('🖼️ Running visual regression comparison...'));
  
  try {
    // Ensure directories exist
    await fs.mkdir(path.join(__dirname$1, config.diffDir), { recursive: true });
    
    // Find all actual screenshots
    const screenshotPaths = await glob(`${path.join(__dirname$1, config.actualDir)}/**/*.png`);
    
    if (screenshotPaths.length === 0) {
      console.log(chalk.yellow('⚠️ No screenshots found for comparison.'));
      return { success: true, message: 'No screenshots found', results: [] };
    }
    
    console.log(chalk.blue(`Found ${screenshotPaths.length} screenshots to compare`));
    
    const results = [];
    let failedComparisons = 0;
    
    // Process each screenshot
    for (const screenshotPath of screenshotPaths) {
      const relativePath = path.relative(path.join(__dirname$1, config.actualDir), screenshotPath);
      const baselinePath = path.join(__dirname$1, config.baselineDir, relativePath);
      const diffPath = path.join(__dirname$1, config.diffDir, relativePath);
      
      // Create directory for diff if it doesn't exist
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      
      let comparisonResult;
      
      try {
        // Check if baseline exists
        await fs.access(baselinePath);
        
        // Compare images
        comparisonResult = await compareImages(baselinePath, screenshotPath, diffPath, config.threshold);
        
        if (!comparisonResult.match) {
          failedComparisons++;
          console.log(chalk.red(`❌ Visual difference detected: ${relativePath}`));
          console.log(chalk.red(`   Mismatch percentage: ${comparisonResult.misMatchPercentage}%`));
        } else {
          console.log(chalk.green(`✅ Visual match: ${relativePath}`));
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(chalk.yellow(`⚠️ Baseline does not exist for: ${relativePath}`));
          console.log(chalk.yellow(`   Creating baseline from current screenshot.`));
          
          // Create baseline directory if it doesn't exist
          await fs.mkdir(path.dirname(baselinePath), { recursive: true });
          
          // Copy current screenshot as baseline
          await fs.copyFile(screenshotPath, baselinePath);
          
          comparisonResult = {
            match: true,
            misMatchPercentage: 0,
            baselineCreated: true,
            baselinePath,
            actualPath: screenshotPath,
            diffPath: null
          };
        } else {
          console.error(chalk.red(`Error comparing ${relativePath}:`), error);
          comparisonResult = {
            match: false,
            error: error.message,
            baselinePath,
            actualPath: screenshotPath,
            diffPath: null
          };
          failedComparisons++;
        }
      }
      
      results.push({
        file: relativePath,
        ...comparisonResult
      });
    }
    
    const success = failedComparisons === 0;
    
    if (success) {
      console.log(chalk.green('✅ Visual regression tests passed!'));
    } else {
      console.log(chalk.red(`❌ Visual regression tests failed with ${failedComparisons} mismatches.`));
    }
    
    return {
      success,
      failedComparisons,
      totalComparisons: screenshotPaths.length,
      results
    };
  } catch (error) {
    console.error(chalk.red('Error running visual regression tests:'), error);
    throw error;
  }
}

/**
 * Compare two images using resemble.js
 * @param {string} baselinePath - Path to baseline image
 * @param {string} actualPath - Path to actual image
 * @param {string} diffPath - Path to save difference image
 * @param {number} threshold - Threshold for mismatch percentage
 * @returns {Promise<Object>} - Comparison result
 */
async function compareImages(baselinePath, actualPath, diffPath, threshold) {
  return new Promise(async (resolve, reject) => {
    try {
      const baselineImage = await fs.readFile(baselinePath);
      const actualImage = await fs.readFile(actualPath);
      
      resemble(actualImage)
        .compareTo(baselineImage)
        .ignoreColors()
        .onComplete(async data => {
          const misMatchPercentage = parseFloat(data.misMatchPercentage);
          const match = misMatchPercentage <= threshold;
          
          // Save diff image if there's a mismatch
          if (!match) {
            const diffBuffer = Buffer.from(data.getBuffer().toString('base64'), 'base64');
            await fs.writeFile(diffPath, diffBuffer);
          }
          
          resolve({
            match,
            misMatchPercentage,
            baselinePath,
            actualPath,
            diffPath: match ? null : diffPath
          });
        });
    } catch (error) {
      reject(error);
    }
  });
}

const visualRegression = {
  compareScreenshots
};

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Default history file
const DEFAULT_HISTORY_FILE = '../test-results/test-history.json';

/**
 * Calculate test priorities based on historical results
 * @param {Object} options - Options for prioritization
 * @returns {Promise<Array>} - Prioritized list of tests
 */
async function prioritizeTests(options = {}) {
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
async function updateTestHistory(testRunResults, historyFile = DEFAULT_HISTORY_FILE) {
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

const testPrioritization = {
  prioritizeTests,
  updateTestHistory
};

// Get dirname
path.dirname(fileURLToPath(import.meta.url));

const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, options } = data;
    
    // Initialize OpenAI if needed
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY environment variable is not set' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Initialize OpenAI client for test generator
    testGenerator.initializeOpenAI(process.env.OPENAI_API_KEY);
    
    let result;
    switch (action) {
      case 'generate':
        if (options.spec) {
          const specPath = path.resolve(options.spec);
          result = await testGenerator.generateFromSpec(specPath);
        } else if (options.feature) {
          const featurePath = path.resolve(options.feature);
          result = await testGenerator.generateFromGherkin(featurePath);
        } else if (options.apiDocs) {
          const apiDocsPath = path.resolve(options.apiDocs);
          result = await testGenerator.generateFromApiDocs(apiDocsPath);
        } else {
          return new Response(JSON.stringify({ 
            error: 'Please provide a specification file, feature file, or API documentation' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        
        if (result && options.output) {
          // Create directory if it doesn't exist
          const outputDir = path.dirname(options.output);
          await fs.mkdir(outputDir, { recursive: true });
          
          // Write generated test to file
          await fs.writeFile(options.output, result);
        }
        break;
        
      case 'visual':
        result = await visualRegression.compareScreenshots({
          screenshotsDir: path.resolve(options.dir || '../test-results/screenshots'),
          baselineDir: path.resolve(options.baselineDir || '../test-results/baselines'),
          updateBaselines: options.updateBaselines || false,
          threshold: parseFloat(options.threshold || '0.1')
        });
        break;
        
      case 'prioritize':
        result = await testPrioritization.prioritizeTests({
          testDir: path.resolve(options.testDir || '../tests'),
          changesOnly: options.changesOnly || false
        });
        
        if (options.output) {
          // Create directory if it doesn't exist
          const outputDir = path.dirname(options.output);
          await fs.mkdir(outputDir, { recursive: true });
          
          // Write prioritized tests to file
          await fs.writeFile(options.output, JSON.stringify(result, null, 2));
        }
        break;
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }
    
    return new Response(JSON.stringify({ 
      status: 'success',
      result
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
